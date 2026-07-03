/**
 * Vercel Edge Function — Gemini API Proxy
 *
 * Proxies requests to the Google Gemini API, keeping the API key
 * server-side only. The client never sees the key.
 *
 * Route: POST /api/gemini
 * Client body: { contents: [{ role: 'user' | 'model', parts: [{ text: string }] }] }
 * Response: Gemini API JSON response
 *
 * Security measures:
 * - API key stored in Vercel env var (GEMINI_API_KEY), never exposed to client
 * - Origin allowlist enforced (non-allowlisted origins are rejected with 403)
 * - In-memory token-bucket rate limiting keyed on x-forwarded-for
 * - Request body measured from actual bytes (not a trusted content-length header)
 * - Payload is rebuilt server-side: the system prompt, model and generation
 *   limits are fixed here; only the client `contents` are forwarded
 * - CORS headers only emitted for allowlisted origins
 * - No logging of message content (privacy)
 */

export const config = {
  runtime: 'edge',
};

const ALLOWED_ORIGINS = [
  'https://lokatif-pro.vercel.app',
  'http://localhost:3000',
  'http://localhost:5173',
];

const MAX_BODY_SIZE = 64 * 1024; // 64 KB
const MAX_CONTENTS = 40; // cap conversation turns forwarded
const MAX_OUTPUT_TOKENS = 600; // hard cap on model output

const GEMINI_MODEL = 'gemini-2.0-flash';

// System prompt is enforced server-side — clients cannot override it.
const SYSTEM_PROMPT = `Tu es Zuri, une assistante IA de Lokatif — la plateforme de location immobilière en Côte d'Ivoire.
Tu es une jeune femme ivoirienne, éduquée, intelligente et chaleureuse. Tu utilises parfois des expressions ivoiriennes pour mieux te connecter avec les utilisateurs (ex: "djo", "on va gérer ça", "c'est bon là").
Tu aides les locataires et propriétaires avec :
- La recherche de logements à Abidjan et en Côte d'Ivoire
- Les questions sur la loi ivoirienne de location (dépôt de garantie = 2 mois, premier paiement = 4 mois)
- Les quartiers d'Abidjan (Cocody, Plateau, Marcory, Yopougon, Treichville, Riviera, Adjamé, Zone 4, etc.)
- Les prix du marché immobilier en FCFA (studios: 80k-150k, T2: 150k-300k, villas: 400k+)
- Les démarches administratives pour la location (contrat de bail, état des lieux, caution)
- Les paiements Mobile Money (Wave, Orange Money, MTN)
- Les conseils pour propriétaires (publier une annonce, gérer les locataires, fixer le loyer)
- La sécurité dans les transactions immobilières
Réponds toujours en français, de manière concise et utile. Utilise des emojis avec modération. Sois directe et pratique.`;

// --- In-memory token-bucket rate limiter -----------------------------------
// Note: Edge isolates are ephemeral and not shared, so this is a best-effort
// limiter. If Upstash/KV is later added, replace this with a durable store.
const RATE_LIMIT_CAPACITY = 15; // burst allowance per client
const RATE_LIMIT_REFILL_PER_MS = 15 / 60_000; // ~15 requests / minute
const MAX_BUCKETS = 10_000; // guard against unbounded memory growth

interface Bucket {
  tokens: number;
  last: number;
}
const buckets = new Map<string, Bucket>();

function allowRequest(key: string): boolean {
  const now = Date.now();
  const bucket = buckets.get(key) ?? { tokens: RATE_LIMIT_CAPACITY, last: now };

  bucket.tokens = Math.min(
    RATE_LIMIT_CAPACITY,
    bucket.tokens + (now - bucket.last) * RATE_LIMIT_REFILL_PER_MS,
  );
  bucket.last = now;

  if (bucket.tokens < 1) {
    buckets.set(key, bucket);
    return false;
  }

  // Bound memory: if the map is saturated with new keys, reset it.
  if (buckets.size >= MAX_BUCKETS && !buckets.has(key)) {
    buckets.clear();
  }
  bucket.tokens -= 1;
  buckets.set(key, bucket);
  return true;
}

// --- Payload sanitization ---------------------------------------------------
interface CleanContent {
  role: 'user' | 'model';
  parts: { text: string }[];
}

function sanitizeContents(input: unknown): CleanContent[] | null {
  if (!Array.isArray(input) || input.length === 0) return null;
  if (input.length > MAX_CONTENTS) return null;

  const out: CleanContent[] = [];
  for (const item of input) {
    if (!item || typeof item !== 'object') return null;
    const role = (item as Record<string, unknown>).role;
    const parts = (item as Record<string, unknown>).parts;
    if (role !== 'user' && role !== 'model') return null;
    if (!Array.isArray(parts) || parts.length === 0) return null;

    const cleanParts: { text: string }[] = [];
    for (const p of parts) {
      if (!p || typeof p !== 'object') return null;
      const partText = (p as Record<string, unknown>).text;
      if (typeof partText !== 'string') return null;
      cleanParts.push({ text: partText });
    }
    out.push({ role, parts: cleanParts });
  }
  return out;
}

export default async function handler(req: Request): Promise<Response> {
  const origin = req.headers.get('origin') ?? '';
  const isAllowedOrigin = ALLOWED_ORIGINS.includes(origin);

  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: isAllowedOrigin ? 204 : 403,
      headers: corsHeaders(origin),
    });
  }

  // Reject requests from non-allowlisted origins outright.
  if (!isAllowedOrigin) {
    return json({ error: 'Forbidden origin' }, 403, origin);
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405, origin);
  }

  // Rate limit by client IP (best-effort in-memory token bucket).
  const clientIp =
    (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'unknown';
  if (!allowRequest(clientIp)) {
    return json({ error: 'Too many requests' }, 429, origin);
  }

  // Read body from actual bytes — do not trust the client content-length header.
  let text: string;
  try {
    text = await req.text();
  } catch {
    return json({ error: 'Invalid body' }, 400, origin);
  }
  if (text.length > MAX_BODY_SIZE) {
    return json({ error: 'Request too large' }, 413, origin);
  }

  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return json({ error: 'Invalid JSON body' }, 400, origin);
  }

  // Only the client `contents` are trusted; everything else is server-built.
  const contents = sanitizeContents(
    body && typeof body === 'object'
      ? (body as Record<string, unknown>).contents
      : undefined,
  );
  if (!contents) {
    return json({ error: 'Invalid or missing contents' }, 400, origin);
  }

  // Retrieve the API key from server-side environment
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return json({ error: 'Gemini API not configured' }, 503, origin);
  }

  // Build the Gemini payload entirely server-side. Client-supplied
  // system_instruction / generationConfig / model overrides are ignored.
  const geminiPayload = {
    system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents,
    generationConfig: {
      temperature: 0.75,
      maxOutputTokens: MAX_OUTPUT_TOKENS,
    },
  };

  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  let geminiRes: Response;
  try {
    geminiRes = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(geminiPayload),
    });
  } catch {
    return json({ error: 'Failed to reach Gemini API' }, 502, origin);
  }

  const data = await geminiRes.json();

  return new Response(JSON.stringify(data), {
    status: geminiRes.status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders(origin),
    },
  });
}

function corsHeaders(origin: string): Record<string, string> {
  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
  // Only advertise CORS access to allowlisted origins.
  if (ALLOWED_ORIGINS.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
  }
  return headers;
}

function json(data: unknown, status: number, origin: string): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders(origin),
    },
  });
}
