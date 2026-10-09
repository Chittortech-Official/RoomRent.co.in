'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';
import Logo from '@/components/Logo';

const navLinks = [
  { href: '/search?type=rooms', label: 'Rooms' },
  { href: '/search?type=pg', label: 'PG & Hostel' },
  { href: '/search?type=flat', label: 'Flats' },
  { href: '/search', label: 'Search' },
  { href: '/favorites', label: 'Favorites' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const navClass = [
    styles.navbar,
    isHome && !scrolled ? styles.transparent : styles.solid,
    scrolled ? styles.scrolled : '',
  ].join(' ');

  const handleChangeIntent = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.removeItem('roomrent_user_intent');
    window.location.href = '/';
  };

  return (
    <>
      <nav className={navClass} role="navigation" aria-label="Main navigation">
        <div className={styles.inner}>
          {/* Logo */}
          <Logo dark={isHome && !scrolled} />

          {/* Desktop Nav Links */}
          <ul className={styles.navLinks} role="list">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`${styles.navLink} ${pathname === link.href ? styles.active : ''}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop Actions */}
          <div className={styles.actions}>
            <Link href="/search" className={styles.iconBtn} aria-label="Search" title="Advanced Search">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </Link>
            <Link href="/dashboard?tab=profile" className={styles.iconBtn} aria-label="Profile" title="My Profile">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </Link>
            <Link href="/post-property" className={`btn btn-primary btn-sm ${styles.postBtn}`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Post Property Free
            </Link>
          </div>

          <div className={styles.mobileIcons}>
            <Link href="/search" className={styles.iconBtn} aria-label="Search">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </Link>
            <Link href="/dashboard?tab=profile" className={styles.iconBtn} aria-label="Profile">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </Link>
          </div>

          {/* Hamburger */}
          <button
            className={styles.hamburger}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-controls="mobile-menu"
          >
            <span className={`${styles.hamburgerLine} ${menuOpen ? styles.open1 : ''}`}/>
            <span className={`${styles.hamburgerLine} ${menuOpen ? styles.open2 : ''}`}/>
            <span className={`${styles.hamburgerLine} ${menuOpen ? styles.open3 : ''}`}/>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Backdrop */}
      {menuOpen && (
        <div
          className={styles.backdrop}
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Drawer */}
      <div
        id="mobile-menu"
        className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ''}`}
        aria-hidden={!menuOpen}
      >
        <div className={styles.mobileMenuHeader}>
          <div onClick={() => setMenuOpen(false)}>
            <Logo />
          </div>
          <button
            className={styles.closeBtn}
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <nav className={styles.mobileNav}>
          <ul role="list">
            {[
              { href: '/', label: 'Home', icon: '🏠' },
              { href: '/search', label: 'Search Properties', icon: '🔍' },
              { href: '/search?type=rooms', label: 'Rooms', icon: '🛏️' },
              { href: '/search?type=pg', label: 'PG & Hostel', icon: '🏢' },
              { href: '/search?type=flat', label: 'Flats & Apartments', icon: '🏗️' },
              { href: '/favorites', label: 'Favorites', icon: '❤️' },
              { href: '/dashboard', label: 'My Dashboard', icon: '📊' },
              { href: '/dashboard?tab=profile', label: 'My Profile', icon: '👤' },
              { href: '/login', label: 'Login / Sign Up', icon: '🔑' },
            ].map((link, i) => (
              <li key={link.label + i}>
                <Link
                  href={link.href}
                  className={styles.mobileNavLink}
                  onClick={() => setMenuOpen(false)}
                >
                  <span className={styles.mobileNavIcon}>{link.icon}</span>
                  {link.label}
                  <svg className={styles.mobileNavArrow} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.mobileActions}>
          <Link href="/post-property" className="btn btn-primary btn-lg" onClick={() => setMenuOpen(false)} style={{width: '100%', justifyContent: 'center'}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Post Property Free
          </Link>
          <p className={styles.mobileActionsNote}>List your property in minutes. 100% free.</p>
        </div>
      </div>
    </>
  );
}
