import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { benefitsAPI, loyaltyAPI, pointsAPI, customerAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const C = {
  bg: '#100B06',
  bgCard: '#1F1209',
  border: 'rgba(196,154,46,0.18)',
  gold: '#C49A2E',
  goldLight: '#EDD080',
  textPrim: '#F0E6D0',
  textSec: '#B09070',
  textMut: 'rgba(176,144,112,0.55)',
};

const TIER_META = {
  SILVER: { accent: '#8E9BAA', label: 'SILVER', next: 'GOLD', required: 1000 },
  GOLD: { accent: C.gold, label: 'GOLD', next: 'PLATINUM', required: 5000 },
  PLATINUM: { accent: '#9F94D8', label: 'PLATINUM', next: null, required: null },
};

const BENEFITS = {
  SILVER: [
    'Wi-Fi Premium gratuit dans tout l\'établissement',
    'Check-out tardif garanti jusqu\'à 13h00',
    'Accès à la salle de fitness',
  ],
  GOLD: [
    'Wi-Fi Premium gratuit dans tout l\'établissement',
    'Check-out tardif garanti jusqu\'à 14h00',
    'Accueil VIP avec boisson de bienvenue',
    '-10% sur les soins au Spa de l\'hôtel',
  ],
  PLATINUM: [
    'Wi-Fi Premium gratuit dans tout l\'établissement',
    'Check-out tardif garanti jusqu\'à 16h00',
    'Accueil VIP avec boisson de bienvenue et fruits frais',
    '-15% sur les soins au Spa de l\'hôtel',
    'Upgrade de chambre gratuit (selon disponibilité)',
    'Accès au salon VIP',
  ],
};

export default function CustomerDashboard() {
  const { customerId } = useParams();
  const { user } = useAuth();
  const [customer, setCustomer] = useState(null);
  const [card, setCard] = useState(null);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [customerRes, cardRes, balanceRes] = await Promise.all([
        customerAPI.getById(customerId),
        loyaltyAPI.getCardByCustomer(customerId),
        pointsAPI.getBalance(customerId),
      ]);
      setCustomer(customerRes.data);
      setCard(cardRes.data);
      setBalance(balanceRes.data);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (customerId) load(); }, [customerId]);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: C.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: C.textSec,
        fontFamily: 'Jost, sans-serif',
      }}>
        Chargement en cours...
      </div>
    );
  }

  const tier = card?.cardType || 'SILVER';
  const meta = TIER_META[tier];
  const currentPoints = balance?.currentBalance || 0;

  let progressPercent = 0;
  let remainingPoints = 0;
  if (meta.next && meta.required) {
    const base = tier === 'GOLD' ? 1000 : tier === 'PLATINUM' ? 5000 : 0;
    const progress = Math.max(0, currentPoints - base);
    const totalNeeded = meta.required - base;
    progressPercent = Math.min(100, Math.round((progress / totalNeeded) * 100));
    remainingPoints = Math.max(0, meta.required - currentPoints);
  }

  const benefits = BENEFITS[tier] || BENEFITS.SILVER;

  return (
    <div style={{
      minHeight: '100vh',
      background: C.bg,
      color: C.textPrim,
      fontFamily: 'Jost, sans-serif',
      padding: '2.5rem',
    }}>
      {/* 1. En-tête de Profil */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '3rem',
        paddingBottom: '1.5rem',
        borderBottom: `1px solid ${C.border}`,
      }}>
        <div>
          <h1 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '2.5rem',
            margin: 0,
            marginBottom: '0.5rem',
            color: '#FFFFFF',
          }}>
            {customer ? `${customer.firstName} ${customer.lastName}` : 'Client'}
          </h1>
          <p style={{
            margin: 0,
            marginBottom: '0.3rem',
            color: C.textSec,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontSize: '0.85rem',
          }}>
            Type de compte : Client Privilège
          </p>
          <p style={{
            margin: 0,
            color: C.textMut,
            fontSize: '0.9rem',
          }}>
            ID Client : #UX-{customerId?.slice(-6).toUpperCase() || '98235'}
          </p>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '4px',
            background: `${C.gold}20`,
            border: `1px solid ${C.gold}40`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: C.goldLight,
          }}>
            {customer ? `${customer.firstName[0]}${customer.lastName[0]}` : 'CE'}
          </div>
        </div>
      </div>

      {/* 2. Les 3 Cartes de Fidélité */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '3rem',
      }}>
        {/* Carte 1 : Mon Solde Actuel */}
        <div style={{
          background: C.bgCard,
          border: `1px solid ${C.border}`,
          borderRadius: '4px',
          padding: '1.75rem',
          borderTop: `3px solid ${C.gold}`,
        }}>
          <p style={{
            margin: 0,
            marginBottom: '0.75rem',
            color: C.textSec,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontSize: '0.8rem',
          }}>
            Mon Solde Actuel
          </p>
          <p style={{
            margin: 0,
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '2.5rem',
            color: '#FFFFFF',
            lineHeight: '1',
          }}>
            {currentPoints.toLocaleString('fr-FR')} Points
          </p>
        </div>

        {/* Carte 2 : Mon Statut */}
        <div style={{
          background: C.bgCard,
          border: `1px solid ${C.border}`,
          borderRadius: '4px',
          padding: '1.75rem',
          borderTop: `3px solid ${meta.accent}`,
        }}>
          <p style={{
            margin: 0,
            marginBottom: '0.75rem',
            color: C.textSec,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontSize: '0.8rem',
          }}>
            Mon Statut
          </p>
          <p style={{
            margin: 0,
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '2.5rem',
            color: meta.accent,
            lineHeight: '1',
          }}>
            Membre {meta.label}
          </p>
        </div>

        {/* Carte 3 : Prochain Objectif */}
        <div style={{
          background: C.bgCard,
          border: `1px solid ${C.border}`,
          borderRadius: '4px',
          padding: '1.75rem',
          borderTop: `3px solid ${TIER_META[meta.next]?.accent || C.gold}`,
        }}>
          <p style={{
            margin: 0,
            marginBottom: '0.75rem',
            color: C.textSec,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontSize: '0.8rem',
          }}>
            Prochain Objectif
          </p>
          {meta.next ? (
            <>
              <p style={{
                margin: 0,
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '1.5rem',
                color: C.textPrim,
                lineHeight: '1',
                marginBottom: '1rem',
              }}>
                Plus que {remainingPoints.toLocaleString('fr-FR')} pts avant le statut {meta.next}
              </p>
              <div style={{
                height: '4px',
                background: `${C.gold}20`,
                borderRadius: '2px',
                overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%',
                  background: `linear-gradient(to right, ${C.gold}, ${C.goldLight})`,
                  width: `${progressPercent}%`,
                  borderRadius: '2px',
                  transition: 'width 0.5s ease',
                }} />
              </div>
            </>
          ) : (
            <p style={{
              margin: 0,
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '1.5rem',
              color: C.textPrim,
              lineHeight: '1',
            }}>
              Vous avez atteint le statut maximum !
            </p>
          )}
        </div>
      </div>

      {/* 3. Le Bloc "Mes Avantages Inclus" */}
      <div style={{
        background: C.bgCard,
        border: `1px solid ${C.border}`,
        borderRadius: '4px',
        padding: '1.75rem',
      }}>
        <h2 style={{
          margin: 0,
          marginBottom: '1.5rem',
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '1.5rem',
          color: '#FFFFFF',
        }}>
          Mes Avantages Inclus
        </h2>
        <ul style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
        }}>
          {benefits.map((benefit, index) => (
            <li key={index} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
              marginBottom: '0.75rem',
              paddingBottom: index < benefits.length - 1 ? '0.75rem' : 0,
              borderBottom: index < benefits.length - 1 ? `1px solid ${C.border}` : 'none',
            }}>
              <span style={{
                color: C.goldLight,
                fontSize: '1.1rem',
                flexShrink: 0,
                marginTop: '0.1rem',
              }}>
                ✓
              </span>
              <span style={{
                color: C.textPrim,
                fontSize: '1rem',
                lineHeight: '1.5',
              }}>
                {benefit}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
