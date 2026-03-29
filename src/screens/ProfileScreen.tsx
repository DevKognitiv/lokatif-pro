import React from 'react';
import { Settings, Bell, Shield, FileText, HelpCircle, LogOut, ChevronRight, Star } from 'lucide-react';
import type { Screen } from '../types';
import { mockUsers } from '../data/mock';

interface Props {
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
}

export default function ProfileScreen({ onNavigate, onLogout }: Props) {
  const user = mockUsers[0];

  const menuItems = [
    { icon: Bell, label: 'Notifications', screen: 'notifications' as Screen, color: '#4A90E2' },
    { icon: CreditCard, label: 'Paiements & Loyers', screen: 'payment' as Screen, color: '#27AE60' },
    { icon: FileText, label: 'Documents & Baux', screen: 'documents' as Screen, color: '#FF6B35' },
    { icon: Shield, label: 'Sécurité & Confidentialité', screen: 'profile' as Screen, color: '#9B59B6' },
    { icon: HelpCircle, label: 'Aide & Support', screen: 'profile' as Screen, color: '#E67E22' },
  ];

  return (
    <div className="screen-content" style={{ background: '#0d0d1a', padding: '20px 20px 0' }}>
      {/* Profile card */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
        borderRadius: 20,
        padding: '24px',
        marginBottom: 24,
        border: '1px solid #2d3748',
        textAlign: 'center',
      }}>
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: 12 }}>
          <img
            src={user.avatar}
            alt={user.name}
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              objectFit: 'cover',
              border: '3px solid #C9A84C',
            }}
          />
          <div style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: 24,
            height: 24,
            borderRadius: '50%',
            background: '#27AE60',
            border: '2px solid #0d0d1a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
          }}>
            ✓
          </div>
        </div>

        <h2 style={{ color: 'white', fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{user.name}</h2>
        <p style={{ color: '#A0AEC0', fontSize: 14, marginBottom: 12 }}>
          {user.role === 'locataire' ? 'Locataire' : 'Propriétaire'} · Membre depuis {user.since}
        </p>

        {/* Rating */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 6,
          marginBottom: 16,
        }}>
          {[1, 2, 3, 4, 5].map(i => (
            <Star
              key={i}
              size={16}
              color="#F59E0B"
              fill={i <= Math.floor(user.rating) ? '#F59E0B' : 'none'}
            />
          ))}
          <span style={{ color: '#A0AEC0', fontSize: 13 }}>
            {user.rating} ({user.reviews} avis)
          </span>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: 'white', fontWeight: 700, fontSize: 18 }}>12</p>
            <p style={{ color: '#718096', fontSize: 12 }}>Recherches</p>
          </div>
          <div style={{ width: 1, background: '#2d3748' }} />
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: 'white', fontWeight: 700, fontSize: 18 }}>4</p>
            <p style={{ color: '#718096', fontSize: 12 }}>Visites</p>
          </div>
          <div style={{ width: 1, background: '#2d3748' }} />
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: 'white', fontWeight: 700, fontSize: 18 }}>2</p>
            <p style={{ color: '#718096', fontSize: 12 }}>Baux actifs</p>
          </div>
        </div>
      </div>

      {/* Menu items */}
      <div style={{
        background: '#16213e',
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 16,
        border: '1px solid #1e2a3a',
      }}>
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              onClick={() => onNavigate(item.screen)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '16px 20px',
                background: 'none',
                border: 'none',
                borderBottom: index < menuItems.length - 1 ? '1px solid #1e2a3a' : 'none',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <div style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: `${item.color}22`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Icon size={18} color={item.color} />
              </div>
              <span style={{ flex: 1, color: 'white', fontSize: 15 }}>{item.label}</span>
              <ChevronRight size={16} color="#718096" />
            </button>
          );
        })}
      </div>

      {/* Logout */}
      <button
        onClick={onLogout}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '16px 20px',
          background: '#16213e',
          border: '1px solid #1e2a3a',
          borderRadius: 16,
          cursor: 'pointer',
          marginBottom: 24,
        }}
      >
        <div style={{
          width: 38,
          height: 38,
          borderRadius: 10,
          background: '#E74C3C22',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <LogOut size={18} color="#E74C3C" />
        </div>
        <span style={{ flex: 1, color: '#E74C3C', fontSize: 15, textAlign: 'left' }}>Se déconnecter</span>
      </button>
    </div>
  );
}

// Missing import fix
import { CreditCard } from 'lucide-react';
