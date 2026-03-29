import { useState } from 'react';
import { ArrowLeft, MapPin, List, Filter, Navigation, X } from 'lucide-react';
import type { Property } from '../types';
import { mockProperties, neighborhoods } from '../data/mock';

interface Props { onBack: () => void; onPropertySelect: (p: Property) => void; }

export default function MapScreen({ onBack, onPropertySelect }: Props) {
  const [selected, setSelected] = useState<Property | null>(null);
  const [activeN, setActiveN] = useState('');
  const filtered = activeN ? mockProperties.filter(p => p.neighborhood === activeN) : mockProperties;
  const fmt = (p: number) => p >= 1000 ? `${Math.round(p/1000)}k` : `${p}`;
  const positions: Record<string, {x: number; y: number}> = {
    'Cocody': {x:68, y:28}, 'Plateau': {x:42, y:52}, 'Marcory': {x:55, y:72},
    'Yopougon': {x:22, y:38}, 'Treichville': {x:48, y:65}, 'Adjame': {x:35, y:35},
  };
  return (
    <div style={{ height: '100vh', background: 'var(--bg-app)', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, padding: '16px 16px 0' }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button className="btn-icon-round" onClick={onBack}><ArrowLeft size={18} color="white"/></button>
          <div style={{ flex: 1, background: 'rgba(13,17,23,0.9)', backdropFilter: 'blur(12px)', borderRadius: 'var(--radius-full)', padding: '10px 16px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <MapPin size={14} color="var(--orange)"/>
            <span style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 600 }}>Abidjan, Cote d'Ivoire</span>
          </div>
          <button className="btn-icon-round"><Filter size={18} color="white"/></button>
        </div>
        <div className="h-scroll" style={{ marginTop: 10, paddingBottom: 4 }}>
          <button className={`chip ${!activeN ? 'active' : ''}`} style={{ flexShrink: 0 }} onClick={() => setActiveN('')}>Tous ({mockProperties.length})</button>
          {neighborhoods.map(n => (
            <button key={n.name} className={`chip ${activeN === n.name ? 'active' : ''}`} style={{ flexShrink: 0 }} onClick={() => setActiveN(n.name)}>
              {n.icon} {n.name}
            </button>
          ))}
        </div>
      </div>
      <div className="map-bg" style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', bottom: '15%', left: '20%', right: '10%', height: '18%', background: 'rgba(59,130,246,0.15)', borderRadius: '50%', border: '1px solid rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 11, color: 'rgba(59,130,246,0.7)', fontWeight: 600 }}>Lagune Ebrié</span>
        </div>
        {filtered.map(p => {
          const pos = positions[p.neighborhood] || {x: 50, y: 50};
          const jx = (p.id.charCodeAt(1) % 10) - 5;
          const jy = (p.id.charCodeAt(2) % 10) - 5;
          const isSel = selected?.id === p.id;
          return (
            <button key={p.id} onClick={() => setSelected(isSel ? null : p)}
              style={{ position: 'absolute', left: `${pos.x + jx}%`, top: `${pos.y + jy}%`, transform: 'translate(-50%, -100%)', background: isSel ? 'var(--orange)' : p.featured ? 'var(--gold)' : 'var(--bg-card)', border: `2px solid ${isSel ? 'white' : 'var(--border)'}`, borderRadius: 'var(--radius-md)', padding: '5px 10px', cursor: 'pointer', transition: 'all 0.2s', boxShadow: 'var(--shadow-sm)', zIndex: isSel ? 10 : 1, whiteSpace: 'nowrap' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: isSel ? 'white' : 'var(--text-primary)' }}>{fmt(p.price)} FCFA</span>
            </button>
          );
        })}
        <div style={{ position: 'absolute', bottom: 100, right: 16, background: 'rgba(13,17,23,0.8)', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)' }}>
          <Navigation size={16} color="var(--orange)"/>
        </div>
        <div style={{ position: 'absolute', bottom: 100, left: 16, background: 'rgba(13,17,23,0.9)', borderRadius: 'var(--radius-full)', padding: '6px 12px', border: '1px solid var(--border)' }}>
          <span style={{ fontSize: 12, color: 'var(--text-primary)', fontWeight: 600 }}>{filtered.length} biens</span>
        </div>
      </div>
      {selected && (
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 16px 16px', zIndex: 20 }}>
          <div style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ display: 'flex', gap: 12, padding: 14 }}>
              <img src={selected.images[0]} alt="" style={{ width: 80, height: 80, borderRadius: 'var(--radius-md)', objectFit: 'cover', flexShrink: 0 }} loading="lazy"/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 3 }}>{selected.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>{selected.neighborhood}</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--orange)' }}>{new Intl.NumberFormat('fr-FR').format(selected.price)} <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--text-muted)' }}>FCFA/mois</span></div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', alignSelf: 'flex-start' }}><X size={18}/></button>
            </div>
            <div style={{ padding: '0 14px 14px', display: 'flex', gap: 8 }}>
              <button className="btn-secondary" style={{ flex: 1, fontSize: 13 }} onClick={() => setSelected(null)}>Fermer</button>
              <button className="btn-primary" style={{ flex: 2, fontSize: 13 }} onClick={() => { onPropertySelect(selected); setSelected(null); }}>Voir details</button>
            </div>
          </div>
        </div>
      )}
      <button className="btn-primary" style={{ position: 'absolute', bottom: selected ? 180 : 20, right: 16, borderRadius: 'var(--radius-full)', padding: '10px 16px', zIndex: 15 }} onClick={onBack}>
        <List size={16}/> Liste
      </button>
    </div>
  );
}
