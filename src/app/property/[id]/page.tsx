'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { MOCK_PROPERTIES } from '@/lib/mockData';
import styles from './property.module.css';

export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const property = MOCK_PROPERTIES.find(p => p.id === id) || MOCK_PROPERTIES[0];
  const [activeImg, setActiveImg] = useState(0);
  const [favorited, setFavorited] = useState(false);
  const [showContact, setShowContact] = useState(false);

  const similarProperties = MOCK_PROPERTIES.filter(p => p.id !== property.id && p.type === property.type).slice(0, 3);

  return (
    <div className={styles.page}>
      <Navbar />

      <div className={styles.wrapper}>
        <div className="container">
          {/* Breadcrumb */}
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">›</span>
            <Link href="/search">Search</Link>
            <span aria-hidden="true">›</span>
            <Link href={`/search?locality=${property.locality.toLowerCase()}`}>{property.locality}</Link>
            <span aria-hidden="true">›</span>
            <span aria-current="page">{property.title}</span>
          </nav>

          <div className={styles.layout}>
            {/* Main Content */}
            <main className={styles.main}>
              {/* Image Gallery */}
              <div className={styles.gallery}>
                <div className={styles.mainImgWrapper}>
                  <img
                    src={property.images[activeImg]}
                    alt={`${property.title} - Image ${activeImg + 1}`}
                    className={styles.mainImg}
                    fetchPriority="high"
                  />
                  {/* Badges */}
                  <div className={styles.galleryBadges}>
                    <span className={styles.typeBadge}>{property.type}</span>
                    {property.noBrokerage && <span className={styles.noBrokerageBadge}>Zero Brokerage</span>}
                  </div>
                  {/* Favorite */}
                  <button
                    className={`${styles.favBtn} ${favorited ? styles.favBtnActive : ''}`}
                    onClick={() => setFavorited(!favorited)}
                    aria-label={favorited ? 'Remove from favorites' : 'Save property'}
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill={favorited ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                  </button>
                  {/* Navigation */}
                  {property.images.length > 1 && (
                    <>
                      <button
                        className={`${styles.galleryNav} ${styles.galleryNavPrev}`}
                        onClick={() => setActiveImg(i => (i - 1 + property.images.length) % property.images.length)}
                        aria-label="Previous image"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                      </button>
                      <button
                        className={`${styles.galleryNav} ${styles.galleryNavNext}`}
                        onClick={() => setActiveImg(i => (i + 1) % property.images.length)}
                        aria-label="Next image"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                      </button>
                    </>
                  )}
                  <span className={styles.imgCounter}>{activeImg + 1}/{property.images.length}</span>
                </div>

                {/* Thumbnails */}
                {property.images.length > 1 && (
                  <div className={styles.thumbnails} role="list" aria-label="Image thumbnails">
                    {property.images.map((img, i) => (
                      <button
                        key={i}
                        className={`${styles.thumbnail} ${i === activeImg ? styles.thumbnailActive : ''}`}
                        onClick={() => setActiveImg(i)}
                        role="listitem"
                        aria-label={`View image ${i + 1}`}
                        aria-current={i === activeImg}
                      >
                        <img src={img} alt="" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Property Info */}
              <section className={styles.section}>
                <div className={styles.titleRow}>
                  <div>
                    <h1 className={styles.title}>{property.title}</h1>
                    <p className={styles.location}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                      {property.locality}, {property.city}
                    </p>
                  </div>
                  <div className={styles.rentBadge}>
                    <span className={styles.rentAmount}>₹{property.rent.toLocaleString('en-IN')}</span>
                    <span className={styles.rentPer}>/month</span>
                  </div>
                </div>

                {/* Key Details Grid */}
                <div className={styles.detailsGrid}>
                  {[
                    { icon: '💰', label: 'Monthly Rent', value: `₹${property.rent.toLocaleString('en-IN')}` },
                    { icon: '🔑', label: 'Security Deposit', value: `₹${property.deposit.toLocaleString('en-IN')}` },
                    { icon: '🏠', label: 'Property Type', value: property.type },
                    { icon: '🛋️', label: 'Furnishing', value: property.furnishing },
                    ...(property.bedrooms != null ? [{ icon: '🛏️', label: 'Bedrooms', value: `${property.bedrooms} BHK` }] : []),
                    ...(property.area ? [{ icon: '📐', label: 'Area', value: `${property.area} sq.ft` }] : []),
                    { icon: '✅', label: 'Available', value: 'Immediately' },
                    ...(property.genderPreference ? [{ icon: '👥', label: 'Gender Preference', value: property.genderPreference }] : []),
                  ].map(detail => (
                    <div key={detail.label} className={styles.detailItem}>
                      <span className={styles.detailIcon} aria-hidden="true">{detail.icon}</span>
                      <div>
                        <p className={styles.detailLabel}>{detail.label}</p>
                        <p className={styles.detailValue}>{detail.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Description */}
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>About This Property</h2>
                <p className={styles.description}>
                  This is a beautiful {property.type} located in the heart of {property.locality}, {property.city}. The property is {property.furnishing.toLowerCase()} and comes with {property.amenities.join(', ')}. Perfect for {property.genderPreference === 'Female' ? 'working women and female students' : property.genderPreference === 'Male' ? 'working professionals and students' : 'individuals, couples, and families'}. The area is well-connected with excellent public transport, restaurants, shops, and IT hubs nearby.
                </p>
              </section>

              {/* Amenities */}
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Amenities</h2>
                <div className={styles.amenitiesGrid}>
                  {[
                    ...property.amenities.map(a => ({ label: a, available: true })),
                    { label: 'Swimming Pool', available: false },
                    { label: 'Gym', available: false },
                    { label: 'Garden', available: false },
                  ].map(amenity => (
                    <div key={amenity.label} className={`${styles.amenityItem} ${!amenity.available ? styles.amenityUnavailable : ''}`}>
                      <span className={styles.amenityCheck} aria-hidden="true">
                        {amenity.available ? '✓' : '✗'}
                      </span>
                      {amenity.label}
                    </div>
                  ))}
                </div>
              </section>

              {/* Location */}
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Location</h2>
                <div className={styles.mapPlaceholder} aria-label={`Map showing ${property.locality}, ${property.city}`}>
                  <div className={styles.mapContent}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                    <p>{property.locality}, {property.city}</p>
                    <a href={`https://maps.google.com/?q=${property.locality}+${property.city}`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
                      Open in Google Maps
                    </a>
                  </div>
                </div>
              </section>
            </main>

            {/* Sidebar - Owner Contact */}
            <aside className={styles.sidebar}>
              <div className={styles.contactCard}>
                <div className={styles.ownerInfo}>
                  <div className={styles.ownerAvatar}>
                    {property.postedBy.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className={styles.ownerName}>{property.postedBy}</p>
                    <p className={styles.ownerType}>
                      <span className={`${styles.ownerTypeBadge} ${property.postedByType === 'Owner' ? styles.ownerBadge : ''}`}>
                        {property.postedByType}
                      </span>
                      · Posted {property.postedAt}
                    </p>
                  </div>
                </div>

                <div className={styles.rentSummary}>
                  <div className={styles.rentRow}>
                    <span className={styles.rentLabel}>Monthly Rent</span>
                    <span className={styles.rentValue}>₹{property.rent.toLocaleString('en-IN')}</span>
                  </div>
                  <div className={styles.rentRow}>
                    <span className={styles.rentLabel}>Security Deposit</span>
                    <span className={styles.rentValue}>₹{property.deposit.toLocaleString('en-IN')}</span>
                  </div>
                  {property.noBrokerage && (
                    <div className={styles.noBrokerageTag}>
                      <span>🎉</span> Zero Brokerage
                    </div>
                  )}
                </div>

                <div className={styles.contactActions}>
                  <button
                    className="btn btn-primary btn-lg"
                    style={{width: '100%', justifyContent: 'center'}}
                    onClick={() => setShowContact(true)}
                    id="contact-owner-btn"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                    Contact Owner
                  </button>

                  <div className={styles.callWhatsApp}>
                    <a
                      href={showContact ? 'tel:+919876543210' : '#'}
                      className={`btn btn-secondary ${styles.callBtn}`}
                      onClick={(e) => { if (!showContact) { e.preventDefault(); setShowContact(true); } }}
                      aria-label="Call owner"
                    >
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.18 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.5a16 16 0 0 0 6 6l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                      {showContact ? '+91 98765 43210' : 'Call'}
                    </a>
                    <a
                      href={showContact ? 'https://wa.me/919876543210' : '#'}
                      className={`btn ${styles.whatsappBtn}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => { if (!showContact) { e.preventDefault(); setShowContact(true); } }}
                      aria-label="WhatsApp owner"
                    >
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      WhatsApp
                    </a>
                  </div>

                  <button
                    className={`btn btn-outline ${styles.saveBtn}`}
                    onClick={() => setFavorited(!favorited)}
                    aria-pressed={favorited}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill={favorited ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{color: '#F43F5E'}}>
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                    {favorited ? 'Saved' : 'Save Property'}
                  </button>
                </div>

                {!showContact && (
                  <p className={styles.contactNote}>
                    Login to view owner's contact details.{' '}
                    <Link href="/login" className={styles.loginLink}>Login Now</Link>
                  </p>
                )}
              </div>

              {/* Safety Tips */}
              <div className={styles.safetyCard}>
                <h3 className={styles.safetyTitle}>Safety Tips</h3>
                <ul className={styles.safetyList}>
                  {[
                    'Visit the property before making any payment',
                    'Never pay in advance without verification',
                    'Verify owner identity with valid ID proof',
                    'Read the agreement carefully before signing',
                  ].map(tip => (
                    <li key={tip} className={styles.safetyItem}>
                      <span className={styles.safetyCheck} aria-hidden="true">⚠️</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>

          {/* Similar Properties */}
          {similarProperties.length > 0 && (
            <section className={styles.similarSection}>
              <h2 className={styles.similarTitle}>Similar Properties in {property.locality}</h2>
              <div className={styles.similarGrid}>
                {similarProperties.map(p => (
                  <Link key={p.id} href={`/property/${p.id}`} className={styles.similarCard}>
                    <img src={p.images[0]} alt={p.title} className={styles.similarImg} loading="lazy" />
                    <div className={styles.similarInfo}>
                      <p className={styles.similarRent}>₹{p.rent.toLocaleString('en-IN')}/mo</p>
                      <p className={styles.similarTitle2}>{p.title}</p>
                      <p className={styles.similarLoc}>{p.locality}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
