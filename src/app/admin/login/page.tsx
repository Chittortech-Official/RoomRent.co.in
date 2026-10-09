'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './login.module.css';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login
    await new Promise(r => setTimeout(r, 1200));
    setIsLoading(false);
    router.push('/admin');
  };

  return (
    <div className={styles.pageContainer}>
      {/* Left Panel (Dark) */}
      <div className={styles.leftPanel}>
        <div className={styles.leftHeader}>
          <div className={styles.logoGroup}>
            <div className={styles.logoIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </div>
            <div>
              <h2 className={styles.brandName}>ROOMRENT.CO.IN</h2>
              <p className={styles.brandSub}>OFFICIAL ADMIN PORTAL</p>
            </div>
          </div>
          <div className={styles.devBadge}>
            <div className={styles.devIcon}>CT</div>
            <div>
              <h3 className={styles.devName}>ChittorTech</h3>
              <p className={styles.devRole}>OFFICIAL DEVELOPER</p>
            </div>
          </div>
        </div>

        <div className={styles.leftContent}>
          <div className={styles.tagBadge}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            ENGINEERED BY CHITTORTECH
          </div>

          <h1 className={styles.heroTitle}>RoomRent.co.in Admin</h1>
          <p className={styles.heroSub}>
            Secure central portal for managing properties, verifying owners, resolving tenant disputes, and RoomRent.co.in platform operations.
          </p>

          <ul className={styles.featureList}>
            <li>
              <div className={styles.featureIcon}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                </svg>
              </div>
              Real-time Database Sync & Live Updates
            </li>
            <li>
              <div className={styles.featureIcon}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                </svg>
              </div>
              Bulk Property & User Management
            </li>
            <li>
              <div className={styles.featureIcon}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              Cloudflare Edge SSL Protection & Fast CDN
            </li>
            <li>
              <div className={styles.featureIcon}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94m-1 7.98v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              24/7 Dedicated ChittorTech Developer Support
            </li>
          </ul>
        </div>

        <div className={styles.leftFooter}>
          <div className={styles.statusWrap}>
            <span className={styles.statusDot}></span>
            System Status: Fully Operational
          </div>
          <div className={styles.securityText}>
            Cloudflare Edge SSL Protected
          </div>
        </div>
      </div>

      {/* Right Panel (Light) */}
      <div className={styles.rightPanel}>
        <div className={styles.loginCard}>
          <div className={styles.shieldIconWrap}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
          </div>
          
          <h2 className={styles.welcomeTitle}>Welcome Back</h2>
          <p className={styles.welcomeSub}>Please enter your credentials to access the dashboard.</p>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>ADMIN EMAIL ADDRESS</label>
              <div className={styles.inputWrapper}>
                <svg className={styles.inputIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <input 
                  type="email" 
                  className={styles.input} 
                  placeholder="admin@roomrent.co.in" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>PASSWORD</label>
              <div className={styles.inputWrapper}>
                <svg className={styles.inputIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  className={styles.input} 
                  placeholder="••••••••" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required 
                />
                <button type="button" className={styles.eyeBtn} onClick={() => setShowPassword(!showPassword)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </button>
              </div>
            </div>

            <div className={styles.forgotWrap}>
              <Link href="#" className={styles.forgotLink}>Forgot Password?</Link>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In to Dashboard'}
            </button>
          </form>

          {/* Support Box */}
          <div className={styles.supportBox}>
            <div className={styles.supportHeader}>
              <div className={styles.supportTitle}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
                NEED HELP? CHITTORTECH SUPPORT
              </div>
              <span className={styles.priorityBadge}>24/7 Priority</span>
            </div>
            
            <div className={styles.supportGrid}>
              <div className={styles.supportItem}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                +91 7597451057
              </div>
              <div className={styles.supportItem}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                WhatsApp
              </div>
              <div className={styles.supportItemFull}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                contact@chittortech.in
              </div>
              <div className={styles.supportItemFull}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                business@chittortech.in
              </div>
            </div>
          </div>

          <div className={styles.footerText}>
            © 2026 RoomRent.co.in. Developed & Managed by <strong>ChittorTech</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
