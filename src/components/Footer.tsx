import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';
import Logo from '@/components/Logo';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.topSection}>
        <div className="container">
          <div className={styles.grid}>
            {/* Brand Column */}
            <div className={styles.brandCol}>
              <div style={{ marginBottom: '1.25rem' }}>
                <Logo dark />
              </div>
              <p className={styles.tagline}>
                Hyderabad's most trusted rental marketplace. Find rooms, PGs, hostels and flats directly from owners — no brokerage.
              </p>
              <div className={styles.stats}>
                <div className={styles.stat}>
                  <span className={styles.statValue}>5,000+</span>
                  <span className={styles.statLabel}>Listings</span>
                </div>
                <div className={styles.statDivider}/>
                <div className={styles.stat}>
                  <span className={styles.statValue}>12,000+</span>
                  <span className={styles.statLabel}>Happy Tenants</span>
                </div>
                <div className={styles.statDivider}/>
                <div className={styles.stat}>
                  <span className={styles.statValue}>100%</span>
                  <span className={styles.statLabel}>Free Posting</span>
                </div>
              </div>
            </div>

            {/* Property Categories */}
            <div className={styles.linkCol}>
              <h3 className={styles.colTitle}>Property Types</h3>
              <ul className={styles.linkList}>
                {[
                  { href: '/search?type=rooms', label: 'Rooms for Rent' },
                  { href: '/search?type=pg', label: 'PG Accommodations' },
                  { href: '/search?type=hostel', label: 'Hostels' },
                  { href: '/search?type=1bhk', label: '1 BHK Flats' },
                  { href: '/search?type=2bhk', label: '2 BHK Flats' },
                  { href: '/search?type=3bhk', label: '3 BHK Flats' },
                  { href: '/search?type=apartment', label: 'Apartments' },
                ].map(link => (
                  <li key={link.href}>
                    <Link href={link.href} className={styles.footerLink}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Popular Locations */}
            <div className={styles.linkCol}>
              <h3 className={styles.colTitle}>Popular Localities</h3>
              <ul className={styles.linkList}>
                {[
                  'Gachibowli',
                  'Madhapur',
                  'Kondapur',
                  'Hitech City',
                  'Ameerpet',
                  'Kukatpally',
                  'Banjara Hills',
                  'Jubilee Hills',
                  'Secunderabad',
                  'Miyapur',
                ].map(locality => (
                  <li key={locality}>
                    <Link href={`/search?locality=${locality.toLowerCase().replace(/ /g, '-')}`} className={styles.footerLink}>
                      {locality}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div className={styles.linkCol}>
              <h3 className={styles.colTitle}>Company</h3>
              <ul className={styles.linkList}>
                {[
                  { href: '/about', label: 'About Us' },
                  { href: '/contact', label: 'Contact Us' },
                  { href: '/post-property', label: 'Post Property Free' },
                  { href: '/help', label: 'Help Center' },
                ].map(link => (
                  <li key={link.href}>
                    <Link href={link.href} className={styles.footerLink}>{link.label}</Link>
                  </li>
                ))}
              </ul>

              <h3 className={styles.colTitle} style={{marginTop: 'var(--space-6)'}}>Legal</h3>
              <ul className={styles.linkList}>
                {[
                  { href: '/terms', label: 'Terms & Conditions' },
                  { href: '/privacy', label: 'Privacy Policy' },
                  { href: '/refund', label: 'Refund Policy' },
                ].map(link => (
                  <li key={link.href}>
                    <Link href={link.href} className={styles.footerLink}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.bottomSection}>
        <div className="container">
          <div className={styles.bottom}>
            <p className={styles.copyright}>
              © {currentYear} RoomRent.co.in · All rights reserved · Made with ❤️ for Hyderabad
            </p>
            <div className={styles.bottomLinks}>
              <Link href="/sitemap" className={styles.bottomLink}>Sitemap</Link>
              <span className={styles.dot}>·</span>
              <Link href="/terms" className={styles.bottomLink}>Terms</Link>
              <span className={styles.dot}>·</span>
              <Link href="/privacy" className={styles.bottomLink}>Privacy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
