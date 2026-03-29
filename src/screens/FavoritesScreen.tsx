import { useState } from 'react';
import { Heart, GitCompare, Trash2, MapPin, Bed, Bath, Maximize2, Star, X } from 'lucide-react';
import { mockProperties } from '../data/mock';
import type { Property } from '../types';

interface Props {
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onPropertySelect: (p: Property) => void;
  compareList: string[];
  onToggleCompare: (id: string) => void;
  onNavigate: (screen: string) => void;
}

function LazyImg({ src, alt, style }: { src: string; alt: string; style?: React.CSSProperties }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div style={{ position: 'relative', ...style }}>
      {!loaded && <div className="skeleton" style={{ position: 'absolute', inset: 0, borderRadius: 'inherit' }} />}
      <img src={src} alt={alt} loading="lazy" decoding="async" onLoad={() => setLoaded(true)}
        style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: loaded ? 1 : 0, transition: 'opacity 0.3s', borderRadius: 'inherit' }} />
    </div>
  );
}

export default function FavoritesScreen({ favorites, onToggleFavorite, onPropertySelect, compareList, onToggleCompare, onNavigate }: Props) {
  const [showCompare, setShowCompare] = useState(false);
  const favProps = mockProperties.filter(p => favorites.includes(p.id));
  const compareProps = mockProperties.filter(p => compareList.includes(p.id));

  if (showCompare && compareProps.length >= 2) {
    return (
      <div style={{ background: 'var(--bg-app)', minHeight: '100vh', paddingBottom: 90 }}>
        <div className="screen-header">
          <button className="btn-icon" onClick={() => setShowCompare(false)}><X size={18} color="var(--text-secondary)"/></button>
          <span className="screen-header-title">Comparer {compareProps.length} biens</span>
        </div>
        <div style={{ overflowX: 'auto', padding: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${compareProps.length}, minmax(160px,1fr))`, gap: 12, minWidth: compareProps.length * 172 }}>
            {compareProps.map(p => (
              <div key={p.id} style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                <LazyImg src={p.images[0]} alt={p.title} style={{ height: 120, borderRadius: 0 }} />
                <div style={{ padding: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4, lineHeight: 1.3 }}>{p.title}</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--orange)', marginBottom: 8 }}>{p.price.toLocaleString('fr-FR')} FCFA</div>
                  {[
                    ['Quartier', p.neighborhood],
                    ['Chambres', `${p.bedrooms} ch.`],
                    ['SDB', `${p.bathrooms} sdb`],
                    ['Surface', `${p.area} m²`],
                    ['Note', `⭐ ${p.rating} (${p.reviewCount})`],
                    ['Statut', p.status === 'libre' ? '✓ Disponible' : '✗ Occupé'],
                  ].map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', flexDirection: 'column', padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                      <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>{k}</span>
                      <span style={{ fontSize: 12, color: 'var(--text-primary)', fontWeight: 600, marginTop: 2 }}>{v}</span>
                    </div>
                  ))}
                  <button className="btn-primary" style={{ width: '100%', marginTop: 10, padding: '10px 12px', fontSize: 12 }} onClick={() => { setShowCompare(false); onPropertySelect(p); }}>
                    Voir l'annonce
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--bg-app)', minHeight: '100vh', paddingBottom: 90 }}>
      <div className="screen-header">
        <Heart size={20} color="var(--orange)" fill="var(--orange)" />
        <span className="screen-header-title">Mes Favoris</span>
        {compareList.length >= 2 && (
          <button className="btn-icon" style={{ background: 'rgba(255,107,53,0.1)', borderColor: 'var(--border-active)' }} onClick={() => setShowCompare(true)}>
            <GitCompare size={16} color="var(--orange)" />
          </button>
        )}
      </div>

      {favProps.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 32px', textAlign: 'center' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
            <Heart size={32} color="var(--text-muted)" />
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Aucun favori</div>
          <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24 }}>Ajoutez des biens à vos favoris pour les retrouver ici</div>
          <button className="btn-primary" style={{ padding: '12px 28px' }} onClick={() => onNavigate('home')}>Explorer les annonces</button>
        </div>
      ) : (
        <div style={{ padding: '12px 16px' }}>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>
            {favProps.length} bien{favProps.length > 1 ? 's' : ''} sauvegardé{favProps.length > 1 ? 's' : ''}
            {compareList.length > 0 && <span style={{ color: 'var(--orange)', marginLeft: 8 }}>· {compareList.length} à comparer</span>}
          </div>
          {favProps.map(p => (
            <div key={p.id} className="card-hover" style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', marginBottom: 16, border: `1px solid ${compareList.includes(p.id) ? 'var(--border-active)' : 'var(--border)'}`, cursor: 'pointer' }} onClick={() => onPropertySelect(p)}>
              <div style={{ position: 'relative', height: 180 }}>
                <LazyImg src={p.images[0]} alt={p.title} style={{ height: 180, borderRadius: 0 }} />
                <div style={{ position: 'absolute', inset: 0, background: 'var(--grad-hero)' }} />
                <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: 6 }}>
                  <button onClick={e => { e.stopPropagation(); onToggleCompare(p.id); }}
                    style={{ width: 32, height: 32, borderRadius: '50%', background: compareList.includes(p.id) ? 'var(--orange)' : 'rgba(0,0,0,0.5)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <GitCompare size={14} color="white" />
                  </button>
                  <button onClick={e => { e.stopPropagation(); onToggleFavorite(p.id); }}
                    style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(239,68,68,0.8)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Trash2 size={14} color="white" />
                  </button>
                </div>
                <div style={{ position: 'absolute', bottom: 10, left: 12 }}>
                  <span style={{ fontSize: 18, fontWeight: 800, color: 'white' }}>{p.price.toLocaleString('fr-FR')} <span style={{ fontSize: 12, fontWeight: 500 }}>FCFA/mois</span></span>
                </div>
              </div>
              <div style={{ padding: '12px 14px' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{p.title}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
                  <MapPin size={12} color="var(--text-muted)" />
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{p.neighborhood}, Abidjan</span>
                  <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Star size={11} color="#F59E0B" fill="#F59E0B" />
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>{p.rating}</span>
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  {[
                    [<Bed size={12}/>, `${p.bedrooms} ch.`],
                    [<Bath size={12}/>, `${p.bathrooms} sdb`],
                    [<Maximize2 size={12}/>, `${p.area} m²`],
                  ].map(([icon, label], i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-secondary)', fontSize: 12 }}>
                      <span style={{ color: 'var(--text-muted)' }}>{icon as React.ReactNode}</span>
                      {label as string}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
