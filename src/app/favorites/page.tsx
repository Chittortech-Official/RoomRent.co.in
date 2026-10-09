'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PropertyCard from '@/components/PropertyCard';
import { MOCK_PROPERTIES } from '@/lib/mockData';
import styles from '../search/search.module.css';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState(MOCK_PROPERTIES.slice(0, 4));

  return (
    <div className={styles.page}>
      <Navbar />

      <div className={styles.wrapper} style={{paddingTop: 'calc(var(--navbar-height) + var(--space-8))'}}>
        <div className="container">
          <div style={{marginBottom: 'var(--space-8)'}}>
            <h1 style={{fontSize: '2rem', fontWeight: 800, marginBottom: 'var(--space-2)'}}>Saved Properties</h1>
            <p style={{color: 'var(--text-secondary)'}}>You have {favorites.length} properties saved to your favorites.</p>
          </div>

          {favorites.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon} aria-hidden="true">❤️</div>
              <h3 className={styles.emptyTitle}>No saved properties yet</h3>
              <p className={styles.emptyDesc}>When you find a property you like, click the heart icon to save it here.</p>
              <Link href="/search" className="btn btn-primary">Browse Properties</Link>
            </div>
          ) : (
            <div className={styles.propertyGrid}>
              {favorites.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
