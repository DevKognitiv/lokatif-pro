import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, MapPin, Bell, TrendingUp, TrendingDown, Minus, Heart, Star, Eye, Bed, Bath, Maximize2, Zap, CheckCircle } from 'lucide-react';
import type { Property, FilterState } from '../types';
import { mockProperties, neighborhoods } from '../data/mock';

interface Props {
  onPropertySelect: (p: Property) => void;
  onNavigate: (screen: string) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  filters: FilterState;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  unreadNotifications: number;
  userRole: 'locataire' | 'propriétaire';
}

function LazyImg({ src, alt, style }: { src: string; alt: string; style?: React.CSSProperties }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div style={{ position: 'relative', ...style }}>
      {!loaded && <div className="skeleton" style={{ position: 'absolute', inset: 0 }} />}
      <img src={src} alt={alt} loading="lazy" decoding="async" onLoad={() => setLoaded(true)}
        style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: loaded ? 1 : 0, transition: 'opacity 0.3s ease' }} />
    </div>
  );
}

function formatPrice(p: number) {
  return p >= 1000000 ? `${(p/1000000).toFixed(1)}M` : p >= 1000 ? `${Math.round(p/1000)}k` : `${p}`;
}

function PropertyCard({ property, isFavorite, onToggleFavorite, onClick }: { property: Property; isFavorite: boolean; onToggleFavorite: () => void; onClick: () => void }) {
  return (
    <div className="property-card fade-in-up" onClick={onClick} style={{ marginBottom: 16 }}>
      <div style={{ position: 'relative', height: 200 }}>
        <LazyImg src={property.images[0]} alt={property.title} style={{ height: 200 }} />
        <div className="gradient-bottom" style={{ position: 'absolute', inset: 0 }} />
        {/* Top badges */}
        <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6 }}>
          {property.featured && <span className="badge badge-orange">⭐ Featured</span>}
          {property.popular && <span className="badge badge-blue">🔥 Populaire</span>}
          {property.virtualTour && <span className="badge badge-gold">360°</span>}
        </div>
        {/* Favorite */}
        <button onClick={e => { e.stopPropagation(); onToggleFavorite(); }}
          style={{ position: 'absolute', top: 12, right: 12, width: 36, height: 36, borderRadius: '50%', background: 'rgba(0,0,0,0.5)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
          <Heart size={18} fill={isFavorite ? '#FF6B35' : 'none'} color={isFavorite ? '#FF6B35' : 'white'} />
        </button>
        {/* Status */}
        <div style={{ position: 'absolute', bottom: 12, left: 12 }}>
          <span className={`badge ${property.status === 'libre' ? 'badge-green' : property.status === 'réservé' ? 'badge-gold' : 'badge-red'}`}>
            {property.status === 'libre' ? '✓ Disponible' : property.status === 'réservé' ? '⏳ Réservé' : '✗ Occupé'}
          </span>
        </div>
        {/* Boost indicator */}
        {property.boostLevel && property.boostLevel > 0 && (
          <div style={{ position: 'absolute', bottom: 12, right: 12 }}>
            <span className="badge badge-orange"><Zap size={10}/> Boosté</span>
          </div>
        )}
      </div>
      <div style={{ padding: '14px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
          <div style={{ flex: 1, marginRight: 8 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3, marginBottom: 3 }} className="line-clamp-2">{property.title}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-secondary)', fontSize: 12 }}>
              <MapPin size={11} /><span>{property.location}</span>
            </div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--orange)' }}>{formatPrice(property.price)}</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>FCFA/mois</div>
          </div>
        </div>
        {/* Stats row */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
          {property.bedrooms > 0 && <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-secondary)' }}><Bed size={12}/>{property.bedrooms} ch.</div>}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-secondary)' }}><Bath size={12}/>{property.bathrooms} sdb</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-secondary)' }}><Maximize2 size={12}/>{property.area} m²</div>
          {property.rating && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 12, color: '#F59E0B', marginLeft: 'auto' }}>
              <Star size={11} fill="#F59E0B"/>{property.rating} ({property.reviewCount})
            </div>
          )}
        </div>
        {/* Amenities */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {property.amenities.slice(0, 3).map(a => (
            <span key={a} style={{ fontSize: 11, color: 'var(--text-muted)', background: 'var(--bg-elevated)', padding: '2px 8px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border)' }}>{a}</span>
          ))}
          {property.amenities.length > 3 && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>+{property.amenities.length - 3}</span>}
        </div>
        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <img src={property.landlord.avatar} alt="" style={{ width: 22, height: 22, borderRadius: '50%', objectFit: 'cover' }} />
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{property.landlord.name}</span>
            {property.landlord.verified && <CheckCircle size={12} color="var(--success)" />}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Eye size={11}/>{property.views}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomeScreen({ onPropertySelect, onNavigate, favorites, onToggleFavorite, filters, searchQuery, onSearchChange, unreadNotifications, userRole }: Props) {
  const [activeNeighborhood, setActiveNeighborhood] = useState('');
  const [activeType, setActiveType] = useState('all');

  const filtered = useMemo(() => {
    return mockProperties.filter(p => {
      if (searchQuery && !p.title.toLowerCase().includes(searchQuery.toLowerCase()) && !p.location.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (activeNeighborhood && p.neighborhood !== activeNeighborhood) return false;
      if (activeType !== 'all' && p.type !== activeType) return false;
      if (p.price < filters.minPrice || p.price > filters.maxPrice) return false;
      if (filters.type !== 'all' && p.type !== filters.type) return false;
      if (filters.verified && !p.verified) return false;
      return true;
    });
  }, [searchQuery, activeNeighborhood, activeType, filters]);

  const featuredProperties = filtered.filter(p => p.featured);
  const regularProperties = filtered.filter(p => !p.featured);

  return (
    <div className="screen-content">
      {/* Header */}
      <div style={{ padding: '20px 20px 0', background: 'var(--bg-app)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>
              Bonjour 👋
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
              {filtered.length} bien{filtered.length > 1 ? 's' : ''} disponible{filtered.length > 1 ? 's' : ''} à Abidjan
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-icon" onClick={() => onNavigate('map')} title="Carte">
              <MapPin size={18} color="var(--text-secondary)" />
            </button>
            <button className="btn-icon" onClick={() => onNavigate('notifications')} style={{ position: 'relative' }}>
              <Bell size={18} color="var(--text-secondary)" />
              {unreadNotifications > 0 && <span className="tab-badge">{unreadNotifications}</span>}
            </button>
          </div>
        </div>

        {/* Search bar */}
        <div className="search-bar" style={{ marginBottom: 12 }}>
          <Search size={16} color="var(--text-muted)" />
          <input placeholder="Quartier, type de bien..." value={searchQuery} onChange={e => onSearchChange(e.target.value)} />
          <button onClick={() => onNavigate('filters')} style={{ background: 'var(--grad-orange)', border: 'none', borderRadius: 'var(--radius-md)', padding: '6px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
            <SlidersHorizontal size={14} color="white" />
            <span style={{ fontSize: 12, color: 'white', fontWeight: 600 }}>Filtres</span>
          </button>
        </div>

        {/* Type chips */}
        <div className="h-scroll" style={{ marginBottom: 16 }}>
          {['all', 'Appartement', 'Villa', 'Studio', 'Maison', 'Duplex', 'Bureau'].map(type => (
            <button key={type} className={`chip ${activeType === type ? 'active' : ''}`} onClick={() => setActiveType(type)}>
              {type === 'all' ? '🏘️ Tous' : type}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 16px' }}>
        {/* Neighborhoods */}
        <div style={{ marginBottom: 20 }}>
          <div className="section-header">
            <span className="section-title">Quartiers populaires</span>
            <span className="section-link" onClick={() => onNavigate('map')}>Voir carte →</span>
          </div>
          <div className="h-scroll">
            {neighborhoods.map(n => (
              <button key={n.name} onClick={() => setActiveNeighborhood(activeNeighborhood === n.name ? '' : n.name)}
                style={{ flexShrink: 0, background: activeNeighborhood === n.name ? `${n.color}20` : 'var(--bg-elevated)', border: `1.5px solid ${activeNeighborhood === n.name ? n.color : 'var(--border)'}`, borderRadius: 'var(--radius-lg)', padding: '10px 14px', cursor: 'pointer', transition: 'var(--transition)', textAlign: 'left', minWidth: 110 }}>
                <div style={{ fontSize: 20, marginBottom: 4 }}>{n.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: activeNeighborhood === n.name ? n.color : 'var(--text-primary)' }}>{n.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{n.count} biens</div>
                {n.avgPrice && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 3 }}>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>moy. {formatPrice(n.avgPrice)}</span>
                    {n.trend === 'up' ? <TrendingUp size={9} color="var(--success)"/> : n.trend === 'down' ? <TrendingDown size={9} color="var(--error)"/> : <Minus size={9} color="var(--text-muted)"/>}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Featured */}
        {featuredProperties.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div className="section-header">
              <span className="section-title">⭐ À la une</span>
            </div>
            {featuredProperties.map(p => (
              <PropertyCard key={p.id} property={p} isFavorite={favorites.includes(p.id)} onToggleFavorite={() => onToggleFavorite(p.id)} onClick={() => onPropertySelect(p)} />
            ))}
          </div>
        )}

        {/* All properties */}
        <div style={{ marginBottom: 20 }}>
          <div className="section-header">
            <span className="section-title">{activeNeighborhood ? `${activeNeighborhood}` : 'Toutes les annonces'}</span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{filtered.length} résultat{filtered.length > 1 ? 's' : ''}</span>
          </div>
          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              <div className="empty-state-title">Aucun résultat</div>
              <div className="empty-state-body">Essayez d'autres critères de recherche ou modifiez vos filtres.</div>
              <button className="btn-secondary" style={{ marginTop: 8 }} onClick={() => { onSearchChange(''); setActiveNeighborhood(''); setActiveType('all'); }}>Réinitialiser</button>
            </div>
          ) : (
            regularProperties.map(p => (
              <PropertyCard key={p.id} property={p} isFavorite={favorites.includes(p.id)} onToggleFavorite={() => onToggleFavorite(p.id)} onClick={() => onPropertySelect(p)} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
