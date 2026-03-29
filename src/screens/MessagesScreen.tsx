import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Search, Send, Phone, Video, MoreVertical, Check, CheckCheck } from 'lucide-react';
import type { Conversation } from '../types';
import { mockConversations, mockMessages } from '../data/mock';

interface Props { onBack: () => void; selectedConversationId?: string | null; onMarkRead: () => void; }

export default function MessagesScreen({ onBack, selectedConversationId, onMarkRead }: Props) {
  const [activeConv, setActiveConv] = useState<Conversation | null>(
    selectedConversationId ? mockConversations.find(c => c.id === selectedConversationId) || null : null
  );
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(mockMessages);
  const [search, setSearch] = useState('');
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
  useEffect(() => { onMarkRead(); }, []);
  const sendMsg = () => {
    if (!message.trim()) return;
    setMessages(prev => [...prev, { id: `m${Date.now()}`, senderId: 'me', senderName: 'Moi', content: message, timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }), read: false, type: 'text' }]);
    setMessage('');
  };
  const filtered = mockConversations.filter(c => !search || c.participant.name.toLowerCase().includes(search.toLowerCase()));
  if (activeConv) return (
    <div style={{ height: '100vh', background: 'var(--bg-app)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: 'rgba(13,17,23,0.95)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--border)' }}>
        <button className="btn-icon" onClick={() => setActiveConv(null)}><ArrowLeft size={18} color="var(--text-secondary)"/></button>
        <div style={{ position: 'relative' }}>
          <img src={activeConv.participant.avatar} alt="" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}/>
          <div style={{ position: 'absolute', bottom: 1, right: 1, width: 10, height: 10, background: 'var(--success)', borderRadius: '50%', border: '2px solid var(--bg-app)' }}/>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{activeConv.participant.name}</div>
          {activeConv.propertyTitle && <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{activeConv.propertyTitle}</div>}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn-icon"><Phone size={16} color="var(--text-secondary)"/></button>
          <button className="btn-icon"><Video size={16} color="var(--text-secondary)"/></button>
          <button className="btn-icon"><MoreVertical size={16} color="var(--text-secondary)"/></button>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {messages.map(msg => {
          const isMe = msg.senderId === 'me';
          if (msg.type === 'system') return <div key={msg.id} style={{ textAlign: 'center', padding: '4px 12px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-full)', fontSize: 11, color: 'var(--text-muted)', margin: '4px auto', maxWidth: '80%' }}>{msg.content}</div>;
          return (
            <div key={msg.id} style={{ display: 'flex', flexDirection: isMe ? 'row-reverse' : 'row', gap: 8, alignItems: 'flex-end' }}>
              {!isMe && <img src={activeConv.participant.avatar} alt="" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}/>}
              <div style={{ maxWidth: '75%' }}>
                <div style={{ background: isMe ? 'var(--orange)' : 'var(--bg-elevated)', borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px', padding: '10px 14px', border: isMe ? 'none' : '1px solid var(--border)' }}>
                  <p style={{ fontSize: 14, color: isMe ? 'white' : 'var(--text-primary)', lineHeight: 1.5, whiteSpace: 'pre-wrap', margin: 0 }}>{msg.content}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 3, justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{msg.timestamp}</span>
                  {isMe && (msg.read ? <CheckCheck size={12} color="var(--info)"/> : <Check size={12} color="var(--text-muted)"/>)}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={endRef}/>
      </div>
      <div style={{ padding: '10px 16px 20px', background: 'rgba(13,17,23,0.95)', backdropFilter: 'blur(16px)', borderTop: '1px solid var(--border)', display: 'flex', gap: 8, alignItems: 'flex-end' }}>
        <div style={{ flex: 1, background: 'var(--bg-elevated)', borderRadius: 20, border: '1px solid var(--border)', padding: '10px 16px' }}>
          <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Ecrire un message..." rows={1} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMsg(); } }} style={{ width: '100%', background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: 14, resize: 'none', fontFamily: 'inherit', outline: 'none', maxHeight: 100, lineHeight: 1.5 }}/>
        </div>
        <button onClick={sendMsg} style={{ width: 40, height: 40, borderRadius: '50%', background: message.trim() ? 'var(--grad-orange)' : 'var(--bg-elevated)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'var(--transition)', flexShrink: 0 }}>
          <Send size={16} color={message.trim() ? 'white' : 'var(--text-muted)'}/>
        </button>
      </div>
    </div>
  );
  return (
    <div className="screen-content">
      <div className="screen-header">
        <span className="screen-header-title">Messages</span>
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{mockConversations.filter(c => c.unread).length} non lus</span>
      </div>
      <div style={{ padding: '12px 16px' }}>
        <div className="search-bar"><Search size={15} color="var(--text-muted)"/><input placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)}/></div>
      </div>
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {filtered.map(conv => (
          <button key={conv.id} onClick={() => setActiveConv(conv)} style={{ display: 'flex', gap: 12, padding: '14px 12px', borderRadius: 'var(--radius-lg)', background: conv.unread ? 'rgba(255,107,53,0.05)' : 'transparent', border: `1px solid ${conv.unread ? 'rgba(255,107,53,0.15)' : 'transparent'}`, cursor: 'pointer', textAlign: 'left', width: '100%' }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <img src={conv.participant.avatar} alt="" style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }}/>
              {conv.unread && <div style={{ position: 'absolute', top: 0, right: 0, width: 12, height: 12, background: 'var(--orange)', borderRadius: '50%', border: '2px solid var(--bg-app)' }}/>}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                <span style={{ fontSize: 14, fontWeight: conv.unread ? 700 : 600, color: 'var(--text-primary)' }}>{conv.participant.name}</span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{conv.timestamp}</span>
              </div>
              {conv.propertyTitle && <div style={{ fontSize: 11, color: 'var(--orange)', marginBottom: 2 }}>{conv.propertyTitle}</div>}
              <div style={{ fontSize: 13, color: conv.unread ? 'var(--text-secondary)' : 'var(--text-muted)', fontWeight: conv.unread ? 500 : 400 }}>{conv.lastMessage}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
