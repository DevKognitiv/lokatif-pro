import React from 'react';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { mockPayments } from '../data/mock';

interface Props {
  onBack: () => void;
}

export default function PaymentScreen({ onBack }: Props) {
  const currentAmount = 250000;
  const dueDate = '05 Mars';

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
          onClick={() => onBack()}
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <ArrowLeft size={22} color="white" />
        </button>
        <h2 style={{ color: 'white', fontSize: 17, fontWeight: 700 }}>
          Paiement et Historique Loyer
        </h2>
      </div>

      <div className="screen-content" style={{ padding: '40px 24px', paddingBottom: 100 }}>
        {/* Current amount */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: 'white', marginBottom: 8 }}>
            Loyer à payer: {currentAmount.toLocaleString('fr-FR')} FCFA
          </h1>
          <p style={{ color: '#A0AEC0', fontSize: 15 }}>Payable avant le: {dueDate}</p>
        </div>

        {/* Pay button */}
        <button
          style={{
            width: '100%',
            padding: '20px',
            borderRadius: 16,
            background: 'linear-gradient(135deg, #FF6B35, #FF8C5A)',
            border: 'none',
            cursor: 'pointer',
            marginBottom: 32,
            boxShadow: '0 8px 24px rgba(255, 107, 53, 0.4)',
          }}
        >
          <p style={{ color: 'white', fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
            Payer maintenant
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, alignItems: 'center' }}>
            {/* Orange Money */}
            <div style={{
              background: 'white',
              borderRadius: 6,
              padding: '4px 10px',
              fontSize: 12,
              fontWeight: 700,
              color: '#FF6B35',
            }}>
              Orange Money
            </div>
            {/* MTN */}
            <div style={{
              background: '#FFD700',
              borderRadius: 6,
              padding: '4px 10px',
              fontSize: 12,
              fontWeight: 700,
              color: '#333',
            }}>
              MTN MoMo
            </div>
            {/* Moov */}
            <div style={{
              background: '#0066CC',
              borderRadius: 6,
              padding: '4px 10px',
              fontSize: 12,
              fontWeight: 700,
              color: 'white',
            }}>
              Moov
            </div>
          </div>
        </button>

        {/* Payment history */}
        <h3 style={{ color: 'white', fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
          Historique des paiements
        </h3>

        {mockPayments.map((payment, index) => (
          <div key={payment.id}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingBottom: 16,
              paddingTop: index > 0 ? 16 : 0,
            }}>
              <span style={{ color: 'white', fontSize: 16 }}>{payment.month}</span>
              <span style={{ color: 'white', fontSize: 16 }}>
                {payment.amount.toLocaleString('fr-FR')} FCFA
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {index === 0 && <CheckCircle size={16} color="#27AE60" fill="#27AE60" />}
                <span style={{ color: index === 0 ? '#27AE60' : '#A0AEC0', fontSize: 15 }}>
                  Payé
                </span>
              </div>
            </div>
            {index < mockPayments.length - 1 && (
              <div style={{ height: 1, background: '#1e2a3a' }} />
            )}
          </div>
        ))}

        {/* Ivorian law notice */}
        <div style={{
          background: '#1a2a1a',
          border: '1px solid #27AE60',
          borderRadius: 12,
          padding: '14px 16px',
          marginTop: 24,
        }}>
          <p style={{ color: '#27AE60', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
            📋 Rappel légal — Loi ivoirienne
          </p>
          <p style={{ color: '#A0AEC0', fontSize: 12, lineHeight: 1.6 }}>
            Le dépôt de garantie est de <strong style={{ color: 'white' }}>2 mois</strong> de loyer.
            Le premier paiement inclut 2 mois d'avance + 2 mois de caution =
            <strong style={{ color: 'white' }}> 4 mois au total</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
