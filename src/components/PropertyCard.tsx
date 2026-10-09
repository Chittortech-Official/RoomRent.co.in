'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import styles from './PropertyCard.module.css';

export interface Property {
  id: string;
  title: string;
  type: string; // 'Room' | 'PG' | 'Hostel' | '1 BHK' | '2 BHK' | '3 BHK' | 'Flat'
  locality: string;
  city: string;
  rent: number;
  deposit: number;
  furnishing: string; // 'Fully Furnished' | 'Semi Furnished' | 'Unfurnished'
  bedrooms?: number;
  bathrooms?: number;
  area?: number; // sq ft
  amenities: string[];
  postedBy: string;
  postedByType: 'Owner' | 'Agent';
  postedAt: string;
  images: string[];
  isFavorited?: boolean;
  noBrokerage?: boolean;
  available?: boolean;
  genderPreference?: 'Male' | 'Female' | 'Any';
}

interface PropertyCardProps {
  property: Property;
  onFavoriteToggle?: (id: string) => void;
  className?: string;
}

const typeColorMap: Record<string, string> = {
  'Room': '#7C3AED',
  'PG': '#059669',
  'Hostel': '#0EA5E9',
  '1 BHK': '#D97706',
  '2 BHK': '#D97706',
  '3 BHK': '#D97706',
  'Flat': '#E11D48',
  'Apartment': '#E11D48',
};

function formatRent(rent: number): string {
  if (rent >= 100000) return `₹${(rent / 100000).toFixed(1)}L`;
  if (rent >= 1000) return `₹${(rent / 1000).toFixed(0)}K`;
  return `₹${rent.toLocaleString('en-IN')}`;
}

export default function PropertyCard({ property, onFavoriteToggle, className = '' }: PropertyCardProps) {
  const [imgIdx, setImgIdx] = useState(0);
  const [favorited, setFavorited] = useState(property.isFavorited || false);

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorited(!favorited);
    onFavoriteToggle?.(property.id);
  };

  const handleNextImg = (e: React.MouseEvent) => {
    e.preventDefault();
    setImgIdx((i) => (i + 1) % property.images.length);
  };

  const typeColor = typeColorMap[property.type] || '#6C35DE';

  return (
    <article className={`card ${styles.card} ${className}`}>
      <Link href={`/property/${property.id}`} className={styles.cardLink} tabIndex={-1} aria-hidden="true">
        {/* Image */}
        <div className={styles.imageWrapper}>
          <img
            src={property.images[imgIdx]}
            alt={`${property.title} - ${property.locality}`}
            className={styles.image}
            loading="lazy"
          />

          {/* Overlay gradient */}
          <div className={styles.imageOverlay}/>

          {/* Top badges */}
          <div className={styles.imageBadges}>
            <span className={styles.typeBadge} style={{ background: typeColor }}>
              {property.type}
            </span>
            {property.noBrokerage && (
              <span className={styles.noBrokerageBadge}>
                Zero Brokerage
              </span>
            )}
          </div>

          {/* Favorite button */}
          <button
            className={`${styles.favoriteBtn} ${favorited ? styles.favorited : ''}`}
            onClick={handleFavorite}
            aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
            title={favorited ? 'Remove from favorites' : 'Save property'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill={favorited ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>

          {/* Next image hint */}
          {property.images.length > 1 && (
            <button className={styles.nextImgBtn} onClick={handleNextImg} aria-label="Next image">
              <span className={styles.imageDots}>
                {property.images.map((_, i) => (
                  <span key={i} className={`${styles.dot} ${i === imgIdx ? styles.dotActive : ''}`}/>
                ))}
              </span>
            </button>
          )}

          {/* Gender preference */}
          {property.genderPreference && property.genderPreference !== 'Any' && (
            <span className={`${styles.genderBadge} ${property.genderPreference === 'Female' ? styles.genderFemale : styles.genderMale}`}>
              {property.genderPreference === 'Female' ? '👩' : '👨'} {property.genderPreference} Only
            </span>
          )}
        </div>

        {/* Card Body */}
        <div className={styles.body}>
          {/* Rent */}
          <div className={styles.rentRow}>
            <div className={styles.rent}>
              <span className={styles.rentAmount}>₹{property.rent.toLocaleString('en-IN')}</span>
              <span className={styles.rentPer}>/month</span>
            </div>
            {property.deposit > 0 && (
              <span className={styles.deposit}>₹{(property.deposit / 1000).toFixed(0)}K deposit</span>
            )}
          </div>

          {/* Title */}
          <h3 className={styles.title}>{property.title}</h3>

          {/* Location */}
          <p className={styles.location}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            {property.locality}, {property.city}
          </p>

          {/* Details Row */}
          <div className={styles.detailsRow}>
            {property.bedrooms != null && (
              <span className={styles.detail}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
                {property.bedrooms} Bed
              </span>
            )}
            {property.area && (
              <span className={styles.detail}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                </svg>
                {property.area} sq.ft
              </span>
            )}
            <span className={styles.detail}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              {property.furnishing}
            </span>
          </div>

          {/* Amenities */}
          {property.amenities.length > 0 && (
            <div className={styles.amenities}>
              {property.amenities.slice(0, 3).map((a) => (
                <span key={a} className={styles.amenity}>{a}</span>
              ))}
              {property.amenities.length > 3 && (
                <span className={styles.amenityMore}>+{property.amenities.length - 3}</span>
              )}
            </div>
          )}

          {/* Footer */}
          <div className={styles.cardFooter}>
            <div className={styles.postedBy}>
              <div className={styles.postedByAvatar}>
                {property.postedBy.charAt(0).toUpperCase()}
              </div>
              <div className={styles.postedByInfo}>
                <span className={styles.postedByName}>{property.postedBy}</span>
                <span className={`${styles.postedByType} ${property.postedByType === 'Owner' ? styles.owner : styles.agent}`}>
                  {property.postedByType}
                </span>
              </div>
            </div>
            <span className={styles.viewBtn}>View Details →</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
