import { useState } from 'react';
import { ArrowLeft, Heart, Share2, MapPin, Bed, Bath, Maximize2, Star, CheckCircle, Phone, MessageCircle, Calendar, Eye, ChevronLeft, ChevronRight, Shield, Wifi, Car, Wind, Waves, Dumbbell, Zap, Home, Building2 } from 'lucide-react';
import type { Property } from '../types';

interface Props {
  property: Property;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onBack: () => void;
  onNavigate: (screen: string) => void;
}

const amenityIcons: Record<string, React.ReactNode> = {
  'Wifi': <Wifi size={14}/>, 'Parking': <Car size={14}/>, 'Climatisation': <Wind size={14}/>,
  'Piscine': <Waves size={14}/>, 'Salle de sport': <Dumbbell size={14}/>, 'Sécurité 24h': <Shield size={14}/>,
  'Gardien': <Shield size={14}/>, 'Balcon': <Home size={14}/>, 'Ascenseur': <Building2 size={14}/>,
};

export default function PropertyDetailScreen({ property, isFavorite, onToggleFavorite, onBack, onNavigate }: Props) {
  const [imgIdx, setImgIdx] = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);

  const formatPrice = (p: number) => new Intl.NumberFormat('fr-FR').format(p);

  return (
    <div style={{ background: 'var(--bg-app)', minHeight: '100vh' }}>
      {/* Image Gallery */}
      <div style={{ position: 'relative', height: 280 }}>
        {!imgLoaded && <div className="skeleton" style={{ position: 'absolute', inset: 0 }} />}
        <img src={property.images[imgIdx]} alt={property.title} loading="lazy"
          onLoad={() => setImgLoaded(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: imgLoaded ? 1 : 0, transition: 'opacity 0.3s' }} />
        <div className="gradient-top" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 80 }} />
        <div className="gradient-bottom" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 100 }} />

        {/* Nav buttons */}
        <div style={{ position: 'absolute', top: 16, left: 16, right: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button className="btn-icon-round" onClick={onBack}><ArrowLeft size={18} color="white"/></button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-icon-round" onClick={onToggleFavorite}>
              <Heart size={18} fill={isFavorite ? '#FF6B35' : 'none'} color={isFavorite ? '#FF6B35' : 'white'} />
            </button>
            <button className="btn-icon-round"><Share2 size={18} color="white"/></button>
          </div>
        </div>

        {/* Image pagination */}
        {property.images.length > 1 && (
          <>
            <button onClick={() => setImgIdx(i => Math.max(0, i-1))} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ChevronLeft size={16} color="white"/>
            </button>
            <button onClick={() => setImgIdx(i => Math.min(property.images.length-1, i+1))} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ChevronRight size={16} color="white"/>
            </button>
            <div style={{ position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 5 }}>
              {property.images.map((_, i) => (
                <div key={i} onClick={() => setImgIdx(i)} style={{ width: i === imgIdx ? 16 : 6, height: 6, borderRadius: 3, background: i === imgIdx ? 'white' : 'rgba(255,255,255,0.4)', cursor: 'pointer', transition: 'all 0.2s' }} />
              ))}
            </div>
          </>
        )}

        {/* Badges on image */}
        <div style={{ position: 'absolute', bottom: 14, left: 14, display: 'flex', gap: 6 }}>
          {property.virtualTour && <span className="badge badge-gold">360° Visite virtuelle</span>}
          {property.verified && <span className="badge badge-green"><CheckCircle size={10}/> Vérifié</span>}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '20px 20px 100px' }}>
        {/* Title & Price */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <div style={{ flex: 1, marginRight: 12 }}>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.3, marginBottom: 6 }}>{property.title}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-secondary)', fontSize: 13 }}>
              <MapPin size={13}/><span>{property.location}</span>
            </div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--orange)' }}>{formatPrice(property.price)}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>FCFA/mois</div>
            {property.deposit && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Caution: {formatPrice(property.deposit)}</div>}
          </div>
        </div>

        {/* Status & Rating */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          <span className={`badge ${property.status === 'libre' ? 'badge-green' : 'badge-red'}`}>
            {property.status === 'libre' ? '✓ Disponible' : '✗ Occupé'}
          </span>
          {property.availableFrom && property.status === 'libre' && (
            <span className="badge badge-blue">Dispo le {property.availableFrom}</span>
          )}
          {property.rating && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: '#F59E0B' }}>
              <Star size={13} fill="#F59E0B"/><span style={{ fontWeight: 700 }}>{property.rating}</span>
              <span style={{ color: 'var(--text-muted)' }}>({property.reviewCount} avis)</span>
            </div>
          )}
        </div>

        {/* Key stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 20 }}>
          {[
            { icon: <Bed size={16}/>, val: property.bedrooms > 0 ? `${property.bedrooms}` : '0', label: 'Chambres' },
            { icon: <Bath size={16}/>, val: `${property.bathrooms}`, label: 'SDB' },
            { icon: <Maximize2 size={16}/>, val: `${property.area}`, label: 'm²' },
            { icon: <Eye size={16}/>, val: `${property.views}`, label: 'Vues' },
          ].map(s => (
            <div key={s.label} style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', padding: '10px 8px', textAlign: 'center', border: '1px solid var(--border)' }}>
              <div style={{ color: 'var(--orange)', marginBottom: 4, display: 'flex', justifyContent: 'center' }}>{s.icon}</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)' }}>{s.val}</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Description */}
        <div style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Description</h3>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            {showFullDesc ? property.description : property.description.slice(0, 120) + (property.description.length > 120 ? '...' : '')}
          </p>
          {property.description.length > 120 && (
            <button onClick={() => setShowFullDesc(!showFullDesc)} style={{ background: 'none', border: 'none', color: 'var(--orange)', fontSize: 13, fontWeight: 600, cursor: 'pointer', marginTop: 4 }}>
              {showFullDesc ? 'Voir moins' : 'Voir plus'}
            </button>
          )}
        </div>

        {/* Amenities */}
        <div style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>Équipements</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
            {property.amenities.map(a => (
              <div key={a} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-elevated)', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--orange)' }}>{amenityIcons[a] || <Zap size={14}/>}</span>
                <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>{a}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Landlord */}
        <div style={{ marginBottom: 20, background: 'var(--bg-elevated)', borderRadius: 'var(--radius-xl)', padding: 16, border: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>Propriétaire</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <img src={property.landlord.avatar} alt="" style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border)' }} />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{property.landlord.name}</span>
                {property.landlord.verified && <CheckCircle size={14} color="var(--success)"/>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-muted)' }}>
                <Star size={11} fill="#F59E0B" color="#F59E0B"/><span style={{ color: '#F59E0B', fontWeight: 600 }}>{property.landlord.rating}</span>
                <span>· {property.landlord.reviews} avis · Membre depuis {property.landlord.since}</span>
              </div>
            </div>
          </div>
          {property.landlord.responseRate && (
            <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
              <div style={{ flex: 1, background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', padding: '8px 10px', textAlign: 'center' }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--success)' }}>{property.landlord.responseRate}%</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Taux réponse</div>
              </div>
              <div style={{ flex: 1, background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', padding: '8px 10px', textAlign: 'center' }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--info)' }}>{property.landlord.responseTime}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Délai réponse</div>
              </div>
            </div>
          )}
        </div>

        {/* Map preview */}
        <div style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>Localisation</h3>
          <div className="map-bg" style={{ height: 120, borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative', overflow: 'hidden' }} onClick={() => onNavigate('map')}>
            <div style={{ textAlign: 'center' }}>
              <MapPin size={28} color="var(--orange)" style={{ marginBottom: 6 }}/>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{property.neighborhood}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Voir sur la carte →</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, background: 'rgba(13,17,23,0.97)', backdropFilter: 'blur(16px)', borderTop: '1px solid var(--border)', padding: '12px 20px 20px', display: 'flex', gap: 10, zIndex: 90 }}>
        <button className="btn-secondary" style={{ flex: 1 }} onClick={() => onNavigate('schedule-visit')}>
          <Calendar size={16}/> Visiter
        </button>
        <button className="btn-secondary" style={{ flex: 1 }} onClick={() => onNavigate('chat')}>
          <MessageCircle size={16}/> Message
        </button>
        <button className="btn-primary" style={{ flex: 2 }} onClick={() => onNavigate('chat')}>
          <Phone size={16}/> Contacter
        </button>
      </div>
    </div>
  );
}
