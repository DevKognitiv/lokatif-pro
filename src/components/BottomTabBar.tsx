import { Home, Heart, MessageCircle, Megaphone, User, Bell } from 'lucide-react';
import type { Screen } from '../types';

interface Props {
  current: Screen;
  onNavigate: (screen: Screen) => void;
  unreadMessages?: number;
  unreadNotifications?: number;
  userRole?: 'locataire' | 'propriétaire';
}

const TABS_LOCATAIRE = [
  { id: 'home' as Screen, label: 'Explorer', icon: Home },
  { id: 'favorites' as Screen, label: 'Favoris', icon: Heart },
  { id: 'messages' as Screen, label: 'Messages', icon: MessageCircle },
  { id: 'notifications' as Screen, label: 'Alertes', icon: Bell },
  { id: 'profile' as Screen, label: 'Profil', icon: User },
];

const TABS_PROPRIETAIRE = [
  { id: 'home' as Screen, label: 'Explorer', icon: Home },
  { id: 'landlord-dashboard' as Screen, label: 'Gérer', icon: Megaphone },
  { id: 'messages' as Screen, label: 'Messages', icon: MessageCircle },
  { id: 'notifications' as Screen, label: 'Alertes', icon: Bell },
  { id: 'profile' as Screen, label: 'Profil', icon: User },
];

export default function BottomTabBar({ current, onNavigate, unreadMessages = 0, unreadNotifications = 0, userRole = 'locataire' }: Props) {
  const tabs = userRole === 'propriétaire' ? TABS_PROPRIETAIRE : TABS_LOCATAIRE;
  const tabIds = tabs.map(t => t.id);
  const activeTab = tabIds.includes(current) ? current : 'home';

  return (
    <div className="tab-bar">
      {tabs.map(tab => {
        const isActive = activeTab === tab.id;
        const color = isActive ? '#FF6B35' : '#718096';
        const Icon = tab.icon;
        const badge = tab.id === 'messages' ? unreadMessages : tab.id === 'notifications' ? unreadNotifications : 0;
        return (
          <button key={tab.id} onClick={() => onNavigate(tab.id)}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', padding: '8px 10px', position: 'relative', flex: 1 }}>
            <div style={{ position: 'relative' }}>
              <Icon size={22} color={color} strokeWidth={isActive ? 2.5 : 1.8} />
              {badge > 0 && (
                <div style={{ position: 'absolute', top: -4, right: -6, minWidth: 16, height: 16, borderRadius: 8, background: '#E74C3C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: 'white', padding: '0 3px' }}>
                  {badge > 9 ? '9+' : badge}
                </div>
              )}
            </div>
            <span style={{ fontSize: 10, fontWeight: isActive ? 600 : 400, color }}>{tab.label}</span>
            {isActive && <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 4, height: 4, borderRadius: '50%', background: '#FF6B35' }} />}
          </button>
        );
      })}
    </div>
  );
}
