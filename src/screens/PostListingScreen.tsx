import React, { useState } from 'react';
import { ArrowLeft, Camera, Plus } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export default function PostListingScreen({ onBack }: Props) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    type: 'Appartement',
    title: '',
    price: '',
    location: '',
    bedrooms: '2',
    bathrooms: '1',
    area: '',
    description: '',
    amenities: [] as string[],
  });

  const amenityOptions = ['Wifi', 'Balcon', 'Parking', 'Climatisation', 'Piscine', 'Jardin', 'Ascenseur', 'Meublé'];

  const toggleAmenity = (a: string) => {
    setForm(prev => ({
      ...prev,
      amenities: prev.amenities.includes(a)
        ? prev.amenities.filter(x => x !== a)
        : [...prev.amenities, a],
    }));
  };

  const handleSubmit = () => {
    onBack();
  };

  return (
    <div style={{ background: '#0d0d1a', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '16px 20px',
        borderBottom: '1px solid #1e2a3a',
      }}>
        <button
          onClick={() => step > 1 ? setStep(step - 1) : onBack()}
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: '#1a1a2e',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ArrowLeft size={18} color="white" />
        </button>
        <h2 style={{ color: 'white', fontSize: 17, fontWeight: 700 }}>Publier une Annonce</h2>
        <span style={{ marginLeft: 'auto', color: '#718096', fontSize: 13 }}>Étape {step}/3</span>
      </div>

      {/* Progress bar */}
      <div style={{ height: 3, background: '#1e2a3a' }}>
        <div style={{ height: '100%', width: `${(step / 3) * 100}%`, background: '#FF6B35', transition: 'width 0.3s' }} />
      </div>

      <div className="screen-content" style={{ padding: '24px 20px', paddingBottom: 120 }}>
        {step === 1 && (
          <>
            <h3 style={{ color: 'white', fontSize: 18, fontWeight: 700, marginBottom: 20 }}>
              Informations de base
            </h3>

            {/* Type */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ color: '#A0AEC0', fontSize: 13, display: 'block', marginBottom: 8 }}>Type de bien</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {['Appartement', 'Villa', 'Studio', 'Maison'].map(t => (
                  <button
                    key={t}
                    onClick={() => setForm(prev => ({ ...prev, type: t }))}
                    style={{
                      flex: 1,
                      padding: '10px 4px',
                      borderRadius: 10,
                      background: form.type === t ? '#4A90E2' : '#1a1a2e',
                      border: `1px solid ${form.type === t ? '#4A90E2' : '#2d3748'}`,
                      color: 'white',
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ color: '#A0AEC0', fontSize: 13, display: 'block', marginBottom: 8 }}>Titre de l'annonce</label>
              <input
                type="text"
                placeholder="Ex: Appartement T3 lumineux à Cocody"
                value={form.title}
                onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  background: '#1a1a2e',
                  border: '1px solid #2d3748',
                  borderRadius: 12,
                  color: 'white',
                  fontSize: 14,
                  fontFamily: 'inherit',
                }}
              />
            </div>

            {/* Price */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ color: '#A0AEC0', fontSize: 13, display: 'block', marginBottom: 8 }}>Prix mensuel (FCFA)</label>
              <input
                type="number"
                placeholder="Ex: 250000"
                value={form.price}
                onChange={e => setForm(prev => ({ ...prev, price: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  background: '#1a1a2e',
                  border: '1px solid #2d3748',
                  borderRadius: 12,
                  color: 'white',
                  fontSize: 14,
                  fontFamily: 'inherit',
                }}
              />
            </div>

            {/* Location */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ color: '#A0AEC0', fontSize: 13, display: 'block', marginBottom: 8 }}>Localisation</label>
              <input
                type="text"
                placeholder="Quartier, Ville"
                value={form.location}
                onChange={e => setForm(prev => ({ ...prev, location: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  background: '#1a1a2e',
                  border: '1px solid #2d3748',
                  borderRadius: 12,
                  color: 'white',
                  fontSize: 14,
                  fontFamily: 'inherit',
                }}
              />
            </div>

            {/* Bedrooms & Bathrooms */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
              <div style={{ flex: 1 }}>
                <label style={{ color: '#A0AEC0', fontSize: 13, display: 'block', marginBottom: 8 }}>Chambres</label>
                <select
                  value={form.bedrooms}
                  onChange={e => setForm(prev => ({ ...prev, bedrooms: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    background: '#1a1a2e',
                    border: '1px solid #2d3748',
                    borderRadius: 12,
                    color: 'white',
                    fontSize: 14,
                    fontFamily: 'inherit',
                  }}
                >
                  {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ color: '#A0AEC0', fontSize: 13, display: 'block', marginBottom: 8 }}>Salles de bain</label>
                <select
                  value={form.bathrooms}
                  onChange={e => setForm(prev => ({ ...prev, bathrooms: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    background: '#1a1a2e',
                    border: '1px solid #2d3748',
                    borderRadius: 12,
                    color: 'white',
                    fontSize: 14,
                    fontFamily: 'inherit',
                  }}
                >
                  {[1, 2, 3].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h3 style={{ color: 'white', fontSize: 18, fontWeight: 700, marginBottom: 20 }}>
              Photos et description
            </h3>

            {/* Photo upload */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ color: '#A0AEC0', fontSize: 13, display: 'block', marginBottom: 8 }}>Photos</label>
              <div style={{
                border: '2px dashed #2d3748',
                borderRadius: 14,
                padding: '32px',
                textAlign: 'center',
                cursor: 'pointer',
              }}>
                <Camera size={32} color="#718096" style={{ margin: '0 auto 12px', display: 'block' }} />
                <p style={{ color: '#A0AEC0', fontSize: 14 }}>Ajouter des photos</p>
                <p style={{ color: '#718096', fontSize: 12, marginTop: 4 }}>JPG, PNG jusqu'à 10 MB</p>
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ color: '#A0AEC0', fontSize: 13, display: 'block', marginBottom: 8 }}>Description</label>
              <textarea
                placeholder="Décrivez votre bien en détail..."
                value={form.description}
                onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                rows={5}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  background: '#1a1a2e',
                  border: '1px solid #2d3748',
                  borderRadius: 12,
                  color: 'white',
                  fontSize: 14,
                  fontFamily: 'inherit',
                  resize: 'none',
                }}
              />
            </div>

            {/* Amenities */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ color: '#A0AEC0', fontSize: 13, display: 'block', marginBottom: 8 }}>Équipements</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {amenityOptions.map(a => {
                  const isSelected = form.amenities.includes(a);
                  return (
                    <button
                      key={a}
                      onClick={() => toggleAmenity(a)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: 50,
                        background: isSelected ? '#2a3a5c' : 'none',
                        border: `1px solid ${isSelected ? '#4A90E2' : '#2d3748'}`,
                        color: 'white',
                        fontSize: 13,
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                      }}
                    >
                      {a}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h3 style={{ color: 'white', fontSize: 18, fontWeight: 700, marginBottom: 20 }}>
              Vérification et publication
            </h3>

            {/* Summary */}
            <div style={{
              background: '#16213e',
              borderRadius: 14,
              padding: '16px',
              marginBottom: 20,
              border: '1px solid #2d3748',
            }}>
              <p style={{ color: 'white', fontWeight: 700, fontSize: 16, marginBottom: 8 }}>
                {form.title || 'Titre non renseigné'}
              </p>
              <p style={{ color: '#A0AEC0', fontSize: 14 }}>{form.location || 'Localisation non renseignée'}</p>
              <p style={{ color: '#FF6B35', fontWeight: 700, fontSize: 16, marginTop: 8 }}>
                {form.price ? `${Number(form.price).toLocaleString('fr-FR')} FCFA/mois` : 'Prix non renseigné'}
              </p>
            </div>

            {/* Legal notice */}
            <div style={{
              background: '#1a2a1a',
              border: '1px solid #27AE60',
              borderRadius: 12,
              padding: '14px 16px',
              marginBottom: 20,
            }}>
              <p style={{ color: '#27AE60', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                ✅ Conformité légale ivoirienne
              </p>
              <p style={{ color: '#A0AEC0', fontSize: 12, lineHeight: 1.6 }}>
                Votre annonce sera vérifiée sous 24h. Assurez-vous que les informations sont exactes et conformes à la loi ivoirienne sur la location immobilière.
              </p>
            </div>
          </>
        )}
      </div>

      {/* Navigation buttons */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 430,
        padding: '16px 20px 24px',
        background: '#0d0d1a',
        borderTop: '1px solid #1e2a3a',
      }}>
        {step < 3 ? (
          <button
            onClick={() => setStep(step + 1)}
            style={{
              width: '100%',
              padding: '18px',
              borderRadius: 50,
              background: '#FF6B35',
              border: 'none',
              color: 'white',
              fontSize: 16,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Continuer
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            style={{
              width: '100%',
              padding: '18px',
              borderRadius: 50,
              background: 'linear-gradient(135deg, #27AE60, #2ECC71)',
              border: 'none',
              color: 'white',
              fontSize: 16,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
              boxShadow: '0 8px 24px rgba(39,174,96,0.4)',
            }}
          >
            Publier l'annonce
          </button>
        )}
      </div>
    </div>
  );
}
