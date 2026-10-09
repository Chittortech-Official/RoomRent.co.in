'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PropertyCard from '@/components/PropertyCard';
import { MOCK_PROPERTIES, LOCALITIES, PROPERTY_TYPES } from '@/lib/mockData';
import styles from './page.module.css';

const STATS = [
  { value: '5,000+', label: 'Active Listings', icon: '🏠' },
  { value: '12K+', label: 'Happy Tenants', icon: '😊' },
  { value: '100%', label: 'Owner Listed', icon: '✅' },
  { value: '0', label: 'Brokerage', icon: '🎉' },
];

const WHY_CHOOSE = [
  {
    icon: '🏠',
    title: 'Direct Owner Listings',
    desc: 'Connect directly with property owners. No middlemen, no extra commissions.',
  },
  {
    icon: '💰',
    title: 'Zero Brokerage Options',
    desc: 'Thousands of properties with zero brokerage. Save thousands every year.',
  },
  {
    icon: '✅',
    title: 'Verified Properties',
    desc: 'Our team verifies listings to ensure you get accurate, trustworthy info.',
  },
  {
    icon: '🔍',
    title: 'Smart Search & Filter',
    desc: 'Search by locality, budget, type, furnishing, amenities and more.',
  },
  {
    icon: '📱',
    title: 'Easy Mobile Experience',
    desc: 'Find your next home from anywhere with our mobile-optimized platform.',
  },
  {
    icon: '🛡️',
    title: 'Secure & Trustworthy',
    desc: 'Your data is safe. Our platform is built with security at its core.',
  },
];

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedType) params.set('type', selectedType);
    router.push(`/search?${params.toString()}`);
  };

  const featuredProperties = MOCK_PROPERTIES.slice(0, 6);
  const recentProperties = MOCK_PROPERTIES.slice(2, 8);

  return (
    <div className={styles.page}>
      <Navbar />

      {/* ============================
          HERO SECTION
          ============================ */}
      <section className={styles.hero} aria-label="Search properties in Hyderabad">
        {/* Top Image Area */}
        <div className={styles.heroImageContainer}>
          <picture>
            <source media="(max-width: 768px)" srcSet="/hero-mobile.jpg" />
            <source media="(min-width: 769px)" srcSet="/hero-desktop.jpg" />
            <img
              src="/hero-desktop.jpg"
              alt="Modern apartment interior"
              className={styles.heroBg}
              fetchPriority="high"
            />
          </picture>
          <div className={styles.heroOverlay} aria-hidden="true"/>
        </div>

        {/* Content Area Below Image */}
        <div className={styles.heroContentWrapper}>
          <div className={`container ${styles.heroContent} ${isVisible ? 'animate-fade-up' : ''}`}>
            {/* Badge */}
            <div className={styles.heroBadge}>
              <span className={styles.heroBadgeDot}/>
              Hyderabad's #1 Rental Marketplace
            </div>

            <h1 className={styles.heroTitle}>
              Find Your Perfect
              <br />
              <span className={styles.heroTitleAccent}>Space in Hyderabad</span>
            </h1>

            <p className={styles.heroSubtitle}>
              Discover rooms, flats, PGs and hostels directly from owners.
              <br className={styles.heroBreak} />
              No brokerage. No middlemen. Just great homes.
            </p>

            {/* Property Type Tabs */}
            <div className={styles.typeTabs} role="group" aria-label="Property type filter">
              {PROPERTY_TYPES.map((t) => (
                <button
                  key={t.id}
                  className={`${styles.typeTab} ${selectedType === t.id ? styles.typeTabActive : ''}`}
                  onClick={() => setSelectedType(selectedType === t.id ? '' : t.id)}
                  aria-pressed={selectedType === t.id}
                >
                  <span aria-hidden="true">{t.emoji}</span>
                  {t.label}
                </button>
              ))}
            </div>

            {/* Search Bar */}
            <form className={styles.searchBar} onSubmit={handleSearch} role="search">
              <div className={styles.searchInputWrapper}>
                <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input
                  id="hero-search-input"
                  type="text"
                  className={styles.searchInput}
                  placeholder="Search localities like Gachibowli, Madhapur, Ameerpet..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search by locality or area"
                  autoComplete="off"
                />
                {searchQuery && (
                  <button
                    type="button"
                    className={styles.clearBtn}
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                )}
              </div>
              <button type="submit" className={`btn btn-primary btn-lg ${styles.searchBtn}`} id="hero-search-btn">
                Search Properties
              </button>
            </form>

            {/* Quick Filters */}
            <div className={styles.quickFilters} role="list" aria-label="Quick filters">
              {[
                { label: '🏠 Available Now', href: '/search?available=true' },
                { label: '💰 Zero Brokerage', href: '/search?noBrokerage=true' },
                { label: '🆕 Recently Added', href: '/search?sort=newest' },
                { label: '👩 Girls PG', href: '/search?type=pg&gender=female' },
                { label: '🏢 IT Hub Areas', href: '/search?locality=gachibowli' },
              ].map((f) => (
                <Link key={f.href} href={f.href} className={styles.quickFilter} role="listitem">
                  {f.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className={styles.statsBar}>
          <div className="container">
            <div className={styles.statsGrid}>
              {STATS.map((stat, i) => (
                <div key={i} className={styles.statItem}>
                  <span className={styles.statEmoji} aria-hidden="true">{stat.icon}</span>
                  <span className={styles.statValue}>{stat.value}</span>
                  <span className={styles.statLabel}>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================
          PROPERTY TYPE CATEGORIES
          ============================ */}
      <section className={`section ${styles.categorySection}`} aria-labelledby="categories-heading">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Browse By Type</span>
            <h2 className="section-title" id="categories-heading">What Are You Looking For?</h2>
            <p className="section-subtitle">From single rooms to luxury apartments, find exactly what you need.</p>
          </div>

          <div className={styles.categoryGrid}>
            {[
              { id: 'rooms', label: 'Rooms', icon: '🛏️', count: '1,240+', desc: 'Single & shared rooms', color: '#6C35DE', bg: '#f5f3ff' },
              { id: 'pg', label: 'PG Accommodations', icon: '🏢', count: '890+', desc: 'With meals & services', color: '#059669', bg: '#ECFDF5' },
              { id: 'hostel', label: 'Hostels', icon: '🏨', count: '340+', desc: 'Budget-friendly stays', color: '#0EA5E9', bg: '#F0F9FF' },
              { id: '1bhk', label: '1 BHK Flats', icon: '🏠', count: '560+', desc: 'Perfect for bachelors', color: '#D97706', bg: '#FFFBEB' },
              { id: '2bhk', label: '2 BHK Flats', icon: '🏘️', count: '780+', desc: 'Great for small families', color: '#E11D48', bg: '#FFF1F2' },
              { id: '3bhk', label: '3 BHK & Above', icon: '🏗️', count: '420+', desc: 'Spacious living', color: '#7C3AED', bg: '#F5F3FF' },
            ].map((cat) => (
              <Link
                key={cat.id}
                href={`/search?type=${cat.id}`}
                className={styles.categoryCard}
                style={{ '--cat-color': cat.color, '--cat-bg': cat.bg } as React.CSSProperties}
                aria-label={`Search ${cat.label}`}
              >
                <div className={styles.categoryIcon} aria-hidden="true">{cat.icon}</div>
                <div className={styles.categoryInfo}>
                  <h3 className={styles.categoryLabel}>{cat.label}</h3>
                  <p className={styles.categoryDesc}>{cat.desc}</p>
                </div>
                <span className={styles.categoryCount}>{cat.count}</span>
                <svg className={styles.categoryArrow} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============================
          FEATURED PROPERTIES
          ============================ */}
      <section className={`section ${styles.propertiesSection}`} aria-labelledby="featured-heading">
        <div className="container">
          <div className={styles.sectionHeaderRow}>
            <div>
              <span className="section-label">Handpicked For You</span>
              <h2 className="section-title" id="featured-heading" style={{marginBottom: 0}}>Featured Properties</h2>
            </div>
            <Link href="/search" className="btn btn-secondary" aria-label="View all featured properties">
              View All
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </Link>
          </div>

          <div className={styles.propertiesGrid}>
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      {/* ============================
          POPULAR LOCALITIES
          ============================ */}
      <section className={`section ${styles.localitiesSection}`} aria-labelledby="localities-heading">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Explore Hyderabad</span>
            <h2 className="section-title" id="localities-heading">Popular Localities</h2>
            <p className="section-subtitle">Find properties in the most sought-after areas of Hyderabad.</p>
          </div>

          <div className={styles.localitiesGrid}>
            {LOCALITIES.map((loc) => (
              <Link
                key={loc.name}
                href={`/search?locality=${loc.name.toLowerCase().replace(/ /g, '-')}`}
                className={styles.localityCard}
                aria-label={`${loc.count} properties in ${loc.name}`}
              >
                <div className={styles.localityIcon} aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <div className={styles.localityInfo}>
                  <span className={styles.localityName}>{loc.name}</span>
                  <span className={styles.localityCount}>{loc.count} properties</span>
                </div>
                <svg className={styles.localityArrow} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============================
          WHY CHOOSE ROOMRENT
          ============================ */}
      <section className={`section ${styles.whySection}`} aria-labelledby="why-heading">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Why RoomRent.co.in</span>
            <h2 className="section-title" id="why-heading">The Smarter Way to Rent</h2>
            <p className="section-subtitle">Built specifically for Hyderabad's rental market. Here's why thousands trust us.</p>
          </div>

          <div className={styles.whyGrid}>
            {WHY_CHOOSE.map((item, i) => (
              <div key={i} className={styles.whyCard}>
                <div className={styles.whyIcon} aria-hidden="true">{item.icon}</div>
                <h3 className={styles.whyTitle}>{item.title}</h3>
                <p className={styles.whyDesc}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================
          RECENT PROPERTIES
          ============================ */}
      <section className={`section ${styles.propertiesSection}`} aria-labelledby="recent-heading">
        <div className="container">
          <div className={styles.sectionHeaderRow}>
            <div>
              <span className="section-label">Fresh Listings</span>
              <h2 className="section-title" id="recent-heading" style={{marginBottom: 0}}>Recently Added</h2>
            </div>
            <Link href="/search?sort=newest" className="btn btn-secondary" aria-label="View all recent properties">
              View All
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </Link>
          </div>

          <div className={styles.propertiesGrid}>
            {recentProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      {/* ============================
          POST PROPERTY CTA
          ============================ */}
      <section className={styles.ctaSection} aria-labelledby="cta-heading">
        <div className="container">
          <div className={styles.ctaCard}>
            <div className={styles.ctaContent}>
              <span className={styles.ctaLabel}>For Property Owners</span>
              <h2 className={styles.ctaTitle} id="cta-heading">
                List Your Property for <span className={styles.ctaFree}>FREE</span>
              </h2>
              <p className={styles.ctaDesc}>
                Reach thousands of verified tenants in Hyderabad. Post your room, flat, PG or hostel in under 5 minutes. Completely free, always.
              </p>
              <div className={styles.ctaFeatures}>
                {['Free listing forever', 'Direct tenant contact', 'Easy property management', 'Verified tenant leads'].map(f => (
                  <span key={f} className={styles.ctaFeature}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    {f}
                  </span>
                ))}
              </div>
              <div className={styles.ctaActions}>
                <Link href="/post-property" className="btn btn-primary btn-xl" id="cta-post-property-btn">
                  Post Property Free
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </Link>
                <Link href="/signup?type=owner" className="btn btn-outline" style={{color: 'white', borderColor: 'rgba(255,255,255,0.4)'}}>
                  Create Owner Account
                </Link>
              </div>
            </div>
            <div className={styles.ctaDecor} aria-hidden="true">
              <div className={styles.ctaDecorCircle1}/>
              <div className={styles.ctaDecorCircle2}/>
              <div className={styles.ctaIllustration}>🏠</div>
              <div className={styles.ctaStats}>
                <div className={styles.ctaStat}>
                  <span className={styles.ctaStatValue}>5,000+</span>
                  <span className={styles.ctaStatLabel}>Active Listings</span>
                </div>
                <div className={styles.ctaStat}>
                  <span className={styles.ctaStatValue}>3 min</span>
                  <span className={styles.ctaStatLabel}>Avg. Post Time</span>
                </div>
                <div className={styles.ctaStat}>
                  <span className={styles.ctaStatValue}>₹0</span>
                  <span className={styles.ctaStatLabel}>Listing Cost</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================
          TESTIMONIALS / TRUST
          ============================ */}
      <section className={`section ${styles.testimonialsSection}`} aria-labelledby="testimonials-heading">
        <div className="container">
          <div className="section-header">
            <span className="section-label">What People Say</span>
            <h2 className="section-title" id="testimonials-heading">Trusted by Thousands in Hyderabad</h2>
          </div>

          <div className={styles.testimonialGrid}>
            {[
              {
                name: 'Priya S.',
                role: 'Software Engineer, Gachibowli',
                rating: 5,
                text: 'Found my perfect PG in Madhapur within 2 days. Direct contact with the owner, zero brokerage. RoomRent.co.in is amazing!',
                avatar: 'P',
              },
              {
                name: 'Rahul M.',
                role: 'IT Professional, Hitech City',
                rating: 5,
                text: 'The search filters are so detailed. I could filter by WiFi, parking, and gender preference. Got a great 1 BHK at a fair price.',
                avatar: 'R',
              },
              {
                name: 'Ananya K.',
                role: 'College Student, Ameerpet',
                rating: 5,
                text: 'As a girl looking for safe accommodation, the gender filter and verified listings gave me confidence. Found a great girls hostel!',
                avatar: 'A',
              },
            ].map((t, i) => (
              <div key={i} className={styles.testimonialCard}>
                <div className={styles.testimonialRating} aria-label={`Rating: ${t.rating} out of 5`}>
                  {'★'.repeat(t.rating)}
                </div>
                <p className={styles.testimonialText}>"{t.text}"</p>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.testimonialAvatar}>{t.avatar}</div>
                  <div>
                    <p className={styles.testimonialName}>{t.name}</p>
                    <p className={styles.testimonialRole}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
