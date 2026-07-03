import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Shield } from 'lucide-react';

interface Message {
  role: 'user' | 'model';
  text: string;
}

/**
 * ZuriChat — Lokatif AI Assistant
 *
 * Security architecture:
 * - All Gemini traffic (dev and prod) is routed through /api/gemini,
 *   the Vercel Edge Function proxy. The API key lives server-side only
 *   and never reaches the browser bundle.
 * - The system prompt, model, and generation limits are enforced by the
 *   server; the client only sends conversation `contents`.
 */

// All Gemini calls go through the server-side proxy — never call Google directly.
const PROXY_URL = '/api/gemini';

async function callGemini(contents: object[]): Promise<string> {
  const response = await fetch(PROXY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents }),
  });

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error('RATE_LIMIT');
    }
    throw new Error(`API_ERROR_${response.status}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "Je n'ai pas pu répondre. Réessaie !";
}

export default function ZuriChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: "Bonjour ! Je suis Zuri, ton assistante Lokatif 🏠\nComment puis-je t'aider aujourd'hui ? Que tu cherches un appartement à Cocody ou que tu veuilles publier une annonce, on va gérer ça ensemble !",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = { role: 'user', text: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const allMessages = [...messages, userMsg];
      const contents = allMessages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }],
      }));

      const text = await callGemini(contents);
      setMessages(prev => [...prev, { role: 'model', text }]);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : '';
      let reply: string;
      if (errMsg === 'RATE_LIMIT') {
        reply = "Je suis un peu débordée là ! 😅 Réessaie dans 1-2 minutes, ça devrait marcher. Merci pour ta patience djo !";
      } else if (errMsg.startsWith('API_ERROR')) {
        reply = `Une erreur technique s'est produite (${errMsg}). L'équipe Lokatif a été notifiée. 🙏`;
      } else {
        reply = "Aïe, problème de connexion. Vérifie ton réseau et réessaie ! 😅";
      }
      setMessages(prev => [...prev, { role: 'model', text: reply }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickPrompts = [
    "Prix moyen à Cocody ?",
    "Comment signer un bail ?",
    "Publier une annonce",
  ];

  return (
    <>
      {/* Floating button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          title="Parler à Zuri — Assistante IA Lokatif"
          style={{
            position: 'fixed',
            bottom: 88,
            right: 16,
            width: 54,
            height: 54,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #FF6B35, #C9A84C)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 24px rgba(255,107,53,0.55)',
            zIndex: 150,
            transition: 'transform 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.08)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <Sparkles size={22} color="white" />
        </button>
      )}

      {/* Chat panel */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: 430,
          height: '72vh',
          background: '#0d0d1a',
          borderRadius: '20px 20px 0 0',
          border: '1px solid #2d3748',
          borderBottom: 'none',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 200,
          boxShadow: '0 -8px 40px rgba(0,0,0,0.6)',
        }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '14px 18px',
            borderBottom: '1px solid #1e2a3a',
            background: 'linear-gradient(135deg, rgba(255,107,53,0.08), rgba(201,168,76,0.06))',
            borderRadius: '20px 20px 0 0',
          }}>
            <div style={{
              width: 42,
              height: 42,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #FF6B35, #C9A84C)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              flexShrink: 0,
              boxShadow: '0 2px 10px rgba(255,107,53,0.4)',
            }}>
              👩🏾
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <p style={{ color: 'white', fontWeight: 700, fontSize: 15, margin: 0 }}>Zuri</p>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  background: 'rgba(39,174,96,0.15)',
                  borderRadius: 20,
                  padding: '2px 8px',
                }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#27AE60' }} />
                  <span style={{ fontSize: 11, color: '#27AE60', fontWeight: 600 }}>En ligne</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                <Shield size={10} color="#C9A84C" />
                <p style={{ color: '#C9A84C', fontSize: 11, margin: 0 }}>
                  Connexion sécurisée
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
            >
              <X size={20} color="#A0AEC0" />
            </button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '14px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                gap: 8,
                alignItems: 'flex-end',
              }}>
                {msg.role === 'model' && (
                  <div style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #FF6B35, #C9A84C)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 14,
                    flexShrink: 0,
                  }}>
                    👩🏾
                  </div>
                )}
                <div style={{
                  maxWidth: '78%',
                  background: msg.role === 'user'
                    ? 'linear-gradient(135deg, #FF6B35, #FF8C5A)'
                    : '#1a2535',
                  borderRadius: msg.role === 'user'
                    ? '18px 18px 4px 18px'
                    : '18px 18px 18px 4px',
                  padding: '10px 14px',
                  border: msg.role === 'model' ? '1px solid #2d3748' : 'none',
                }}>
                  <p style={{
                    color: 'white',
                    fontSize: 14,
                    lineHeight: 1.55,
                    whiteSpace: 'pre-wrap',
                    margin: 0,
                  }}>
                    {msg.text}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
                <div style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #FF6B35, #C9A84C)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                }}>
                  👩🏾
                </div>
                <div style={{
                  background: '#1a2535',
                  borderRadius: '18px 18px 18px 4px',
                  padding: '12px 16px',
                  display: 'flex',
                  gap: 5,
                  alignItems: 'center',
                  border: '1px solid #2d3748',
                }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      background: '#FF6B35',
                      opacity: 0.7,
                      animation: `bounce 1s ${i * 0.2}s infinite`,
                    }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick prompts — shown only when no conversation yet */}
          {messages.length === 1 && !loading && (
            <div style={{
              padding: '0 16px 10px',
              display: 'flex',
              gap: 6,
              flexWrap: 'wrap',
            }}>
              {quickPrompts.map(p => (
                <button
                  key={p}
                  onClick={() => { setInput(p); }}
                  style={{
                    background: 'rgba(255,107,53,0.1)',
                    border: '1px solid rgba(255,107,53,0.3)',
                    borderRadius: 20,
                    padding: '6px 12px',
                    color: '#FF6B35',
                    fontSize: 12,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{
            padding: '10px 14px 18px',
            borderTop: '1px solid #1e2a3a',
            display: 'flex',
            gap: 10,
            alignItems: 'center',
          }}>
            <div style={{
              flex: 1,
              background: '#111827',
              borderRadius: 50,
              padding: '10px 16px',
              border: '1px solid #2d3748',
              display: 'flex',
              alignItems: 'center',
            }}>
              <input
                type="text"
                placeholder="Pose ta question à Zuri..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                style={{
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  color: 'white',
                  fontSize: 14,
                  fontFamily: 'inherit',
                }}
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: input.trim() && !loading
                  ? 'linear-gradient(135deg, #FF6B35, #FF8C5A)'
                  : '#2d3748',
                border: 'none',
                cursor: input.trim() && !loading ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s',
                flexShrink: 0,
              }}
            >
              <Send size={18} color="white" />
            </button>
          </div>
        </div>
      )}

      {/* CSS animations */}
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 0.5; }
          50% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </>
  );
}
