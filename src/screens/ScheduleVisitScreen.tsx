import { useState } from 'react';
import { ArrowLeft, Calendar, Clock, Check, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';

interface Props { onBack: () => void; propertyTitle?: string; }

const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const SLOTS = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
const UNAVAILABLE = ['10:00', '14:00'];

export default function ScheduleVisitScreen({ onBack, propertyTitle }: Props) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [step, setStep] = useState<'calendar' | 'confirm' | 'success'>('calendar');
  const [weekOffset, setWeekOffset] = useState(0);

  const today = new Date();
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i + weekOffset * 7);
    return d;
  });

  if (step === 'success') return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-app)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
      <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(34,197,94,0.15)', border: '2px solid var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
        <Check size={36} color="var(--success)"/>
      </div>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>Visite confirmee !</h2>
      <p style={{ fontSize: 14, color: 'var(--text-secondary)', textAlign: 'center', marginBottom: 4 }}>
        {selectedDay !== null && weekDays[selectedDay]?.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })} a {selectedSlot}
      </p>
      <p style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', marginBottom: 32 }}>Un rappel vous sera envoye 1h avant la visite.</p>
      <button className="btn-primary" style={{ width: '100%', maxWidth: 280 }} onClick={onBack}>Retour aux annonces</button>
    </div>
  );

  return (
    <div style={{ background: 'var(--bg-app)', minHeight: '100vh', paddingBottom: 100 }}>
      <div className="screen-header">
        <button className="btn-icon" onClick={onBack}><ArrowLeft size={18} color="var(--text-secondary)"/></button>
        <span className="screen-header-title">Planifier une visite</span>
      </div>
      <div style={{ padding: '0 16px' }}>
        {propertyTitle && (
          <div style={{ padding: '12px 14px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <MapPin size={14} color="var(--orange)"/>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>{propertyTitle}</span>
          </div>
        )}
        {step === 'calendar' ? (
          <>
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>Choisir une date</span>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button className="btn-icon" onClick={() => setWeekOffset(w => Math.max(0, w - 1))} style={{ opacity: weekOffset === 0 ? 0.3 : 1 }}><ChevronLeft size={16} color="var(--text-secondary)"/></button>
                  <button className="btn-icon" onClick={() => setWeekOffset(w => w + 1)}><ChevronRight size={16} color="var(--text-secondary)"/></button>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
                {weekDays.map((d, i) => {
                  const isPast = d < today && d.toDateString() !== today.toDateString();
                  const isSelected = selectedDay === i;
                  return (
                    <button key={i} onClick={() => !isPast && setSelectedDay(i)} disabled={isPast}
                      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 4px', borderRadius: 'var(--radius-md)', border: `1.5px solid ${isSelected ? 'var(--orange)' : 'var(--border)'}`, background: isSelected ? 'rgba(255,107,53,0.1)' : 'var(--bg-elevated)', cursor: isPast ? 'not-allowed' : 'pointer', opacity: isPast ? 0.3 : 1, transition: 'var(--transition)' }}>
                      <span style={{ fontSize: 10, color: isSelected ? 'var(--orange)' : 'var(--text-muted)', fontWeight: 600, marginBottom: 4 }}>{DAYS[d.getDay() === 0 ? 6 : d.getDay() - 1]}</span>
                      <span style={{ fontSize: 15, fontWeight: 700, color: isSelected ? 'var(--orange)' : 'var(--text-primary)' }}>{d.getDate()}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            {selectedDay !== null && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>Creneaux disponibles</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                  {SLOTS.map(slot => {
                    const unavail = UNAVAILABLE.includes(slot);
                    const isSel = selectedSlot === slot;
                    return (
                      <button key={slot} onClick={() => !unavail && setSelectedSlot(slot)} disabled={unavail}
                        style={{ padding: '10px 4px', borderRadius: 'var(--radius-md)', border: `1.5px solid ${isSel ? 'var(--orange)' : 'var(--border)'}`, background: isSel ? 'rgba(255,107,53,0.1)' : unavail ? 'var(--bg-surface)' : 'var(--bg-elevated)', cursor: unavail ? 'not-allowed' : 'pointer', opacity: unavail ? 0.4 : 1, fontSize: 13, fontWeight: isSel ? 700 : 500, color: isSel ? 'var(--orange)' : unavail ? 'var(--text-muted)' : 'var(--text-primary)', transition: 'var(--transition)' }}>
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        ) : (
          <div style={{ marginBottom: 24 }}>
            <div style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--radius-xl)', padding: 20, border: '1px solid var(--border)', marginBottom: 16 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 14 }}>Confirmation de visite</div>
              {[
                ['Bien', propertyTitle || 'Appartement Abidjan'],
                ['Date', selectedDay !== null ? weekDays[selectedDay]?.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }) : '-'],
                ['Heure', selectedSlot || '-'],
                ['Duree estimee', '30-45 minutes'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{k}</span>
                  <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 600 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, padding: '12px 20px 20px', background: 'rgba(13,17,23,0.97)', backdropFilter: 'blur(16px)', borderTop: '1px solid var(--border)', zIndex: 90 }}>
        {step === 'calendar' ? (
          <button className="btn-primary" style={{ width: '100%', opacity: selectedDay !== null && selectedSlot ? 1 : 0.5, pointerEvents: selectedDay !== null && selectedSlot ? 'auto' : 'none' }} onClick={() => setStep('confirm')}>
            Confirmer le creneau
          </button>
        ) : (
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setStep('calendar')}>Modifier</button>
            <button className="btn-primary" style={{ flex: 2 }} onClick={() => setStep('success')}>Confirmer la visite</button>
          </div>
        )}
      </div>
    </div>
  );
}
