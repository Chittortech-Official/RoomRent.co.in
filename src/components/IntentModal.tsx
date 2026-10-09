'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import styles from './IntentModal.module.css';

export default function IntentModal() {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Do not show the modal on specific routes where intent is either implied or irrelevant
    const disabledPaths = ['/admin', '/login', '/signup', '/forgot-password', '/reset-password', '/partner', '/dashboard'];
    if (disabledPaths.some(p => pathname?.startsWith(p))) {
      return;
    }

    const intent = localStorage.getItem('roomrent_user_intent');
    if (!intent) {
      // Small delay to ensure smooth rendering after page load
      const timer = setTimeout(() => setShowModal(true), 500);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  const handleSelection = (intent: 'tenant' | 'owner') => {
    localStorage.setItem('roomrent_user_intent', intent);
    setShowModal(false);
    
    // Redirect everyone to signup first based on their intent
    router.push(`/signup?type=${intent}`);
  };

  if (!showModal) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>Welcome to RoomRent! 👋</h2>
        <p className={styles.subtitle}>To give you the best experience, please tell us what you're looking for.</p>
        
        <div className={styles.cardsContainer}>
          <button 
            className={styles.card} 
            onClick={() => handleSelection('tenant')}
            aria-label="I want to rent a room"
          >
            <div className={styles.iconWrapper}>🔍</div>
            <h3 className={styles.cardTitle}>I want to rent a room</h3>
            <p className={styles.cardDesc}>Browse thousands of verified rooms, PGs, and flats with zero brokerage.</p>
          </button>
          
          <button 
            className={styles.card} 
            onClick={() => handleSelection('owner')}
            aria-label="I want to list my room"
          >
            <div className={styles.iconWrapper}>🏠</div>
            <h3 className={styles.cardTitle}>I want to list my room</h3>
            <p className={styles.cardDesc}>Post your property for free and connect directly with verified tenants.</p>
          </button>
        </div>
      </div>
    </div>
  );
}
