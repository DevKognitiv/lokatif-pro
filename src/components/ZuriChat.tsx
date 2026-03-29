import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface Props {
  apiKey: string;
}

const SYSTEM_PROMPT = `Tu es Zuri, une assistante IA de Lokatif — la plateforme de location immobilière en Côte d'Ivoire. 
Tu es une jeune femme ivoirienne, éduquée, intelligente et chaleureuse. Tu utilises parfois des expressions ivoiriennes pour te connecter avec les utilisateurs.
Tu aides les locataires et propriétaires avec:
- La recherche de logements à Abidjan et en Côte d'Ivoire
- Les questions sur la loi ivoirienne de location (dépôt de garantie = 2 mois, premier paiement = 4 mois)
- Les quartiers d'Abidjan (Cocody, Plateau, Marcory, Yopougon, Treichville, etc.)
- Les prix du marché immobilier en FCFA
- Les démarches administratives pour la location
- Les conseils pour propriétaires et locataires
Réponds toujours en français, de manière concise et utile. Utilise des emojis avec modération.`;

export default function ZuriChat({ apiKey }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: "Bonjour ! Je suis Zuri, ton assistante Lokatif 🏠 Comment puis-je t'aider aujourd'hui ? Que tu cherches un appartement à Cocody ou que tu veuilles publier une annonce, je suis là !",
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
      if (!apiKey) {
        setMessages(prev => [...prev, {
          role: 'model',
          text: "Désolée, la clé API Gemini n'est pas configurée. Contacte l'administrateur pour activer l'IA. 🙏",
        }]);
        return;
      }

      // Build conversation history for Gemini
      const allMessages = [...messages, userMsg];
      const contents = allMessages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }],
      }));

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
            contents,
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 512,
            },
          }),
        }
      );

      if (!response.ok) {
        if (response.status === 429) {
          setMessages(prev => [...prev, {
            role: 'model',
            text: "Désolée, je suis un peu débordée en ce moment ! 😅 La clé API vient d'être activée — réessaie dans 1-2 minutes, ça devrait marcher. Merci pour ta patience !",
          }]);
          return;
        }
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Je n'ai pas pu répondre. Réessaie !";

      setMessages(prev => [...prev, { role: 'model', text }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'model',
        text: "Aïe, une erreur s'est produite. Vérifie ta connexion et réessaie ! 😅",
      }]);
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

  return (
    <>
      {/* Floating button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: 88,
            right: 16,
            width: 52,
            height: 52,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #FF6B35, #FF8C5A)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(255,107,53,0.5)',
            zIndex: 150,
          }}
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
          height: '70vh',
          background: '#0d0d1a',
          borderRadius: '20px 20px 0 0',
          border: '1px solid #2d3748',
          borderBottom: 'none',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 200,
          boxShadow: '0 -8px 40px rgba(0,0,0,0.5)',
        }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '16px 20px',
            borderBottom: '1px solid #1e2a3a',
          }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #FF6B35, #C9A84C)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
            }}>
              👩🏾
            </div>
            <div>
              <p style={{ color: 'white', fontWeight: 700, fontSize: 15 }}>Zuri</p>
              <p style={{ color: '#27AE60', fontSize: 12 }}>● En ligne</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                marginLeft: 'auto',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <X size={22} color="#A0AEC0" />
            </button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
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
                  maxWidth: '75%',
                  background: msg.role === 'user' ? '#4A90E2' : '#1e2a3a',
                  borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  padding: '10px 14px',
                }}>
                  <p style={{
                    color: 'white',
                    fontSize: 14,
                    lineHeight: 1.5,
                    whiteSpace: 'pre-wrap',
                  }}>
                    {msg.text}
                  </p>
                </div>
              </div>
            ))}
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
                  background: '#1e2a3a',
                  borderRadius: '18px 18px 18px 4px',
                  padding: '12px 16px',
                  display: 'flex',
                  gap: 4,
                  alignItems: 'center',
                }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: '#A0AEC0',
                      animation: `pulse ${0.6 + i * 0.2}s infinite alternate`,
                    }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: '12px 16px 20px',
            borderTop: '1px solid #1e2a3a',
            display: 'flex',
            gap: 10,
            alignItems: 'center',
          }}>
            <div style={{
              flex: 1,
              background: '#1a1a2e',
              borderRadius: 50,
              padding: '10px 16px',
              border: '1px solid #2d3748',
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
                width: 42,
                height: 42,
                borderRadius: '50%',
                background: input.trim() ? '#FF6B35' : '#2d3748',
                border: 'none',
                cursor: input.trim() ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s',
              }}
            >
              <Send size={18} color="white" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
