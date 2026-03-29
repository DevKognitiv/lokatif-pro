import { useState } from 'react';
import { ArrowLeft, Check, SlidersHorizontal } from 'lucide-react';
import type { FilterState, PropertyType } from '../types';
import { defaultFilters } from '../data/mock';

interface Props { filters: FilterState; onApply: (f: FilterState) => void; onBack: () => void; }
const TYPES: (PropertyType | 'all')[] = ['all', 'Appartement', 'Villa', 'Studio', 'Maison', 'Duplex', 'Bureau'];
const AMENITIES = ['Wifi', 'Piscine', 'Parking', 'Climatisation', 'Balcon', 'Jardin', 'Securite 24h', 'Ascenseur', 'Gardien', 'Salle de sport'];
const NEIGHBORHOODS = ['', 'Cocody', 'Plateau', 'Marcory', 'Yopougon', 'Treichville', 'Adjame'];
const SORTS = [
  { val: 'recent', label: 'Plus recents' }, { val: 'price-asc', label: 'Prix croissant' },
  { val: 'price-desc', label: 'Prix decroissant' }, { val: 'popular', label: 'Populaires' }, { val: 'rating', label: 'Mieux notes' },
];

export default function FiltersScreen({ filters, onApply, onBack }: Props) {
  const [f, setF] = useState<FilterState>(filters);
  const fmt = (v: number) => v >= 1000000 ? `${(v/1000000).toFixed(1)}M` : v >= 1000 ? `${Math.round(v/1000)}k` : `${v}`;
  const toggleAmenity = (a: string) => setF(prev => ({ ...prev, amenities: prev.amenities.includes(a) ? prev.amenities.filter(x => x !== a) : [...prev.amenities, a] }));
  return (
    <div style={{ background: 'var(--bg-app)', minHeight: '100vh', paddingBottom: 100 }}>
      <div className="screen-header">
        <button className="btn-icon" onClick={onBack}><ArrowLeft size={18} color="var(--text-secondary)"/></button>
        <span className="screen-header-title">Filtres avances</span>
        <button onClick={() => setF(defaultFilters)} style={{ background: 'none', border: 'none', color: 'var(--orange)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Reinitialiser</button>
      </div>
      <div style={{ padding: '20px 20px 0' }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>Type de bien</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {TYPES.map(t => <button key={t} className={`chip ${f.type === t ? 'active' : ''}`} onClick={() => setF(prev => ({ ...prev, type: t }))}>{t === 'all' ? 'Tous' : t}</button>)}
          </div>
        </div>
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>Budget mensuel</span>
            <span style={{ fontSize: 13, color: 'var(--orange)', fontWeight: 600 }}>{fmt(f.minPrice)} - {fmt(f.maxPrice)} FCFA</span>
          </div>
          <input type="range" min={0} max={600000} step={10000} value={f.minPrice} onChange={e => setF(prev => ({ ...prev, minPrice: Math.min(+e.target.value, prev.maxPrice - 10000) }))} style={{ accentColor: 'var(--orange)', width: '100%', marginBottom: 8 }}/>
          <input type="range" min={0} max={600000} step={10000} value={f.maxPrice} onChange={e => setF(prev => ({ ...prev, maxPrice: Math.max(+e.target.value, prev.minPrice + 10000) }))} style={{ accentColor: 'var(--orange)', width: '100%' }}/>
        </div>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>Chambres</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['any', 1, 2, 3, 4] as const).map(b => (
              <button key={b} onClick={() => setF(prev => ({ ...prev, bedrooms: b }))} style={{ flex: 1, padding: '10px 4px', borderRadius: 'var(--radius-md)', border: `1.5px solid ${f.bedrooms === b ? 'var(--orange)' : 'var(--border)'}`, background: f.bedrooms === b ? 'rgba(255,107,53,0.1)' : 'var(--bg-elevated)', color: f.bedrooms === b ? 'var(--orange)' : 'var(--text-secondary)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                {b === 'any' ? 'Tous' : b === 4 ? '4+' : b}
              </button>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>Quartier</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {NEIGHBORHOODS.map(n => <button key={n} className={`chip ${f.neighborhood === n ? 'active' : ''}`} onClick={() => setF(prev => ({ ...prev, neighborhood: n }))}>{n || 'Tous'}</button>)}
          </div>
        </div>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>Equipements</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
            {AMENITIES.map(a => (
              <button key={a} onClick={() => toggleAmenity(a)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 'var(--radius-md)', border: `1.5px solid ${f.amenities.includes(a) ? 'var(--orange)' : 'var(--border)'}`, background: f.amenities.includes(a) ? 'rgba(255,107,53,0.1)' : 'var(--bg-elevated)', cursor: 'pointer' }}>
                <div style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${f.amenities.includes(a) ? 'var(--orange)' : 'var(--border)'}`, background: f.amenities.includes(a) ? 'var(--orange)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {f.amenities.includes(a) && <Check size={11} color="white"/>}
                </div>
                <span style={{ fontSize: 12, color: f.amenities.includes(a) ? 'var(--orange-light)' : 'var(--text-secondary)', fontWeight: f.amenities.includes(a) ? 600 : 400 }}>{a}</span>
              </button>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>Trier par</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {SORTS.map(s => (
              <button key={s.val} onClick={() => setF(prev => ({ ...prev, sortBy: s.val as FilterState['sortBy'] }))} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: `1.5px solid ${f.sortBy === s.val ? 'var(--orange)' : 'var(--border)'}`, background: f.sortBy === s.val ? 'rgba(255,107,53,0.1)' : 'var(--bg-elevated)', cursor: 'pointer' }}>
                <span style={{ fontSize: 14, color: f.sortBy === s.val ? 'var(--orange-light)' : 'var(--text-primary)', fontWeight: f.sortBy === s.val ? 600 : 400 }}>{s.label}</span>
                {f.sortBy === s.val && <Check size={16} color="var(--orange)"/>}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, padding: '12px 20px 20px', background: 'rgba(13,17,23,0.97)', backdropFilter: 'blur(16px)', borderTop: '1px solid var(--border)', zIndex: 90 }}>
        <button className="btn-primary" style={{ width: '100%' }} onClick={() => { onApply(f); onBack(); }}>Appliquer les filtres</button>
      </div>
    </div>
  );
}
