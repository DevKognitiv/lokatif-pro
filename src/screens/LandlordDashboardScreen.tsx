import React from 'react';
import { Plus, Eye, MessageCircle, TrendingUp } from 'lucide-react';
import type { Screen, Property } from '../types';
import { mockProperties } from '../data/mock';

interface Props {
  onNavigate: (screen: Screen, property?: Property) => void;
}

export default function LandlordDashboardScreen({ onNavigate }: Props) {
  const stats = [
    { label: 'Annonces actives', value: '3', icon: '🏠', color: '#4A90E2' },
    { label: 'Vues ce mois', value: '1,240', icon: '👁️', color: '#27AE60' },
    { label: 'Demandes reçues', value: '18', icon: '📩', color: '#FF6B35' },
    { label: 'Revenus (FCFA)', value: '750K', icon: '💰', color: '#C9A84C' },
  ];

  return (
    <div className="screen-content" style={{ background: '#0d0d1a', padding: '20px 16px 0' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: 'white', lineHeight: 1.2 }}>
          Tableau de Bord<br />Propriétaire
        </h1>
        <button
          onClick={() => onNavigate('post-listing')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 16px',
            borderRadius: 50,
            background: '#FF6B35',
            border: 'none',
            color: 'white',
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          <Plus size={16} color="white" />
          Nouvelle annonce
        </button>
      </div>

      {/* Stats grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 12,
        marginBottom: 24,
      }}>
        {stats.map(stat => (
          <div key={stat.label} style={{
            background: '#16213e',
            borderRadius: 14,
            padding: '16px',
            border: '1px solid #1e2a3a',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ color: '#A0AEC0', fontSize: 12, marginBottom: 6 }}>{stat.label}</p>
                <p style={{ color: 'white', fontSize: 22, fontWeight: 800 }}>{stat.value}</p>
              </div>
              <span style={{ fontSize: 22 }}>{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* My listings */}
      <h2 style={{ color: 'white', fontSize: 18, fontWeight: 700, marginBottom: 14 }}>
        Mes Annonces
      </h2>

      {mockProperties.map(property => (
        <div key={property.id} style={{
          background: '#16213e',
          borderRadius: 14,
          overflow: 'hidden',
          marginBottom: 14,
          border: '1px solid #1e2a3a',
        }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <img
              src={property.images[0]}
              alt={property.title}
              style={{ width: 100, height: 90, objectFit: 'cover', flexShrink: 0 }}
            />
            <div style={{ flex: 1, padding: '12px 12px 12px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <p style={{ color: 'white', fontWeight: 700, fontSize: 14 }}>
                  {property.price.toLocaleString('fr-FR')} FCFA/mois
                </p>
                <span style={{
                  background: property.status === 'libre' ? '#1a3a1a' : '#3a1a1a',
                  color: property.status === 'libre' ? '#27AE60' : '#E74C3C',
                  fontSize: 11,
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: 20,
                }}>
                  {property.status === 'libre' ? 'Libre' : 'Occupé'}
                </span>
              </div>
              <p style={{ color: '#A0AEC0', fontSize: 12, marginTop: 2 }}>{property.location}</p>
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <span style={{ color: '#718096', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Eye size={12} color="#718096" />
                  {property.views}
                </span>
                <span style={{ color: '#718096', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <MessageCircle size={12} color="#718096" />
                  {property.requests} demandes
                </span>
              </div>
            </div>
          </div>
          {/* Actions */}
          <div style={{
            display: 'flex',
            borderTop: '1px solid #1e2a3a',
          }}>
            <button
              onClick={() => onNavigate('property-detail', property)}
              style={{
                flex: 1,
                padding: '10px',
                background: 'none',
                border: 'none',
                color: '#4A90E2',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
                borderRight: '1px solid #1e2a3a',
              }}
            >
              Modifier
            </button>
            <button
              onClick={() => onNavigate('messages')}
              style={{
                flex: 1,
                padding: '10px',
                background: 'none',
                border: 'none',
                color: '#A0AEC0',
                fontSize: 13,
                cursor: 'pointer',
                fontFamily: 'inherit',
                borderRight: '1px solid #1e2a3a',
              }}
            >
              Messages
            </button>
            <button style={{
              flex: 1,
              padding: '10px',
              background: 'none',
              border: 'none',
              color: '#A0AEC0',
              fontSize: 13,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}>
              Statistiques
            </button>
          </div>
        </div>
      ))}

      {/* Revenue chart placeholder */}
      <div style={{
        background: '#16213e',
        borderRadius: 14,
        padding: '16px',
        marginBottom: 16,
        border: '1px solid #1e2a3a',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ color: 'white', fontSize: 15, fontWeight: 700 }}>Revenus Mensuels</h3>
          <TrendingUp size={18} color="#27AE60" />
        </div>
        {/* Simple bar chart */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 60 }}>
          {[40, 60, 45, 80, 55, 90, 70].map((h, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{
                width: '100%',
                height: `${h}%`,
                background: i === 6 ? '#FF6B35' : '#2d3748',
                borderRadius: '4px 4px 0 0',
                minHeight: 4,
              }} />
              <span style={{ color: '#718096', fontSize: 9 }}>
                {['J', 'F', 'M', 'A', 'M', 'J', 'J'][i]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
