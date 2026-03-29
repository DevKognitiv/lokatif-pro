import React from 'react';
import { Download, PenLine, QrCode, Upload, FileText } from 'lucide-react';
import { mockDocuments } from '../data/mock';

interface Props { onBack: () => void; }
export default function DocumentsScreen({ onBack }: Props) {
  return (
    <div className="screen-content" style={{ background: '#0d0d1a', padding: '20px 20px 0' }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: 'white', marginBottom: 8, lineHeight: 1.2 }}>
        Gestion des<br />Documents et Baux
      </h1>

      <div style={{ marginTop: 24 }}>
        {mockDocuments.map(doc => (
          <div key={doc.id} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            paddingBottom: 16,
            marginBottom: 16,
            borderBottom: '1px solid #1e2a3a',
          }}>
            {/* File icon */}
            <div style={{
              width: 44,
              height: 52,
              background: '#2d3748',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              position: 'relative',
            }}>
              <FileText size={22} color="#A0AEC0" />
              <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: 12,
                height: 12,
                background: '#1a1a2e',
                borderRadius: '0 4px 0 4px',
              }} />
            </div>

            {/* Info */}
            <div style={{ flex: 1 }}>
              <p style={{ color: 'white', fontWeight: 600, fontSize: 14 }}>{doc.name}</p>
              <p style={{ color: '#718096', fontSize: 12, marginTop: 2 }}>{doc.date}</p>
            </div>

            {/* Action button */}
            {doc.action === 'download' ? (
              <button style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 16px',
                borderRadius: 50,
                background: '#4A90E2',
                border: 'none',
                color: 'white',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}>
                <Download size={14} color="white" />
                Télécharger
              </button>
            ) : (
              <button style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 16px',
                borderRadius: 50,
                background: '#27AE60',
                border: 'none',
                color: 'white',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}>
                <PenLine size={14} color="white" />
                Signer
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Add document */}
      <div style={{
        background: '#16213e',
        borderRadius: 16,
        padding: '20px',
        marginTop: 8,
        textAlign: 'center',
        border: '1px solid #2d3748',
      }}>
        <p style={{ color: 'white', fontWeight: 700, fontSize: 16, marginBottom: 12 }}>
          Ajouter un document
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24 }}>
          <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'none',
            border: 'none',
            color: '#A0AEC0',
            fontSize: 14,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}>
            <QrCode size={18} color="#A0AEC0" />
            Scanner
          </button>
          <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'none',
            border: 'none',
            color: '#A0AEC0',
            fontSize: 14,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}>
            <Upload size={18} color="#A0AEC0" />
            Importer PDF
          </button>
        </div>
      </div>
    </div>
  );
}
