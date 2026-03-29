import { Bell, MessageCircle, Home, Calendar, CreditCard, Settings, Star, Check } from 'lucide-react';
import type { Notification } from '../types';
import { mockNotifications } from '../data/mock';

interface Props { onBack: () => void; onMarkRead: () => void; onNavigate: (screen: string) => void; }

const icons: Record<string, React.ReactNode> = {
  message: <MessageCircle size={18} color="#3B82F6"/>, listing: <Home size={18} color="var(--orange)"/>,
  visit: <Calendar size={18} color="var(--success)"/>, payment: <CreditCard size={18} color="var(--warning)"/>,
  system: <Settings size={18} color="var(--text-muted)"/>, review: <Star size={18} color="#F59E0B"/>,
};
const colors: Record<string, string> = {
  message: 'rgba(59,130,246,0.15)', listing: 'rgba(255,107,53,0.15)', visit: 'rgba(34,197,94,0.15)',
  payment: 'rgba(245,158,11,0.15)', system: 'rgba(255,255,255,0.05)', review: 'rgba(245,158,11,0.15)',
};

function NotifCard({ notif, onNavigate }: { notif: Notification; onNavigate: (s: string) => void }) {
  return (
    <div onClick={() => notif.actionScreen && onNavigate(notif.actionScreen)} style={{ display: 'flex', gap: 12, padding: 14, background: notif.read ? 'var(--bg-elevated)' : 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: `1px solid ${notif.read ? 'var(--border)' : 'rgba(255,107,53,0.2)'}`, cursor: notif.actionScreen ? 'pointer' : 'default' }}>
      <div style={{ width: 42, height: 42, borderRadius: 'var(--radius-md)', background: colors[notif.type], display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{icons[notif.type] || <Bell size={18}/>}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
          <span style={{ fontSize: 14, fontWeight: notif.read ? 600 : 700, color: 'var(--text-primary)' }}>{notif.title}</span>
          {!notif.read && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--orange)', flexShrink: 0, marginTop: 4 }}/>}
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>{notif.body}</p>
        <span style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, display: 'block' }}>{notif.timestamp}</span>
      </div>
    </div>
  );
}

export default function NotificationsScreen({ onBack, onMarkRead, onNavigate }: Props) {
  const unread = mockNotifications.filter(n => !n.read);
  const read = mockNotifications.filter(n => n.read);
  return (
    <div className="screen-content">
      <div className="screen-header">
        <span className="screen-header-title">Notifications</span>
        <button onClick={onMarkRead} style={{ background: 'none', border: 'none', color: 'var(--orange)', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}><Check size={13}/> Tout lire</button>
      </div>
      <div style={{ padding: '12px 16px' }}>
        {unread.length > 0 && <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>Nouvelles · {unread.length}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{unread.map(n => <NotifCard key={n.id} notif={n} onNavigate={onNavigate}/>)}</div>
        </div>}
        {read.length > 0 && <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>Lues</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{read.map(n => <NotifCard key={n.id} notif={n} onNavigate={onNavigate}/>)}</div>
        </div>}
      </div>
    </div>
  );
}
