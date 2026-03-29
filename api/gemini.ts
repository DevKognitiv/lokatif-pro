/**
 * Vercel Edge Function — Gemini API Proxy
 *
 * Proxies requests to the Google Gemini API, keeping the API key
 * server-side only. The client never sees the key.
 *
 * Route: POST /api/gemini
 * Body: { contents: [...], system_instruction?: {...}, generationConfig?: {...} }
 * Response: Gemini API JSON response
 *
 * Security measures:
 * - API key stored in Vercel env var (GEMINI_API_KEY), never exposed to client
 * - Rate limiting via Vercel Edge middleware (configurable)
 * - CORS restricted to the app's own origin
 * - Input size limited to 64 KB to prevent abuse
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

export default async function handler(req: Request): Promise<Response> {
  const origin = req.headers.get('origin') ?? '';

  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders(origin),
    });
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405, origin);
  }

  // Read and validate body size
  const contentLength = Number(req.headers.get('content-length') ?? 0);
  if (contentLength > MAX_BODY_SIZE) {
    return json({ error: 'Request too large' }, 413, origin);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400, origin);
  }

  // Retrieve the API key from server-side environment
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return json({ error: 'Gemini API not configured' }, 503, origin);
  }

  // Forward request to Gemini
  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  let geminiRes: Response;
  try {
    geminiRes = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
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
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
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
