'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import styles from './login.module.css';
import Logo from '@/components/Logo';

export default function LoginPage() {
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [authError, setAuthError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError('');
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setAuthError(error.message);
      } else {
        // Redirect to home page
        router.push('/');
      }
    } catch (err: any) {
      setAuthError(err.message || 'An error occurred during login.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      {/* Left Panel - Image */}
      <div className={styles.imagePanel} aria-hidden="true">
        <img src="/hero-desktop.jpg" alt="" className={styles.bgImage} />
        <div className={styles.imageOverlay}/>
        <div className={styles.imageBrand}>
          <Logo dark />
          <div className={styles.imageTagline}>
            <h2 className={styles.imageHeading}>Find your perfect home in Hyderabad</h2>
            <p className={styles.imageSubtext}>Join thousands of tenants who found their space through RoomRent.co.in</p>
          </div>
          <div className={styles.imageTrustBadges}>
            {['5,000+ Listings', 'Zero Brokerage', 'Verified Owners'].map(b => (
              <span key={b} className={styles.trustBadge}>✓ {b}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className={styles.formPanel}>
        <div className={styles.formWrapper}>
          {/* Mobile Logo */}
          <div className={styles.mobileLogo}>
            <Logo />
          </div>

          <div className={styles.formHeader}>
            <h1 className={styles.formTitle}>Welcome back 👋</h1>
            <p className={styles.formSubtitle}>Login to continue to RoomRent.co.in</p>
          </div>

          {authError && (
            <div className={styles.errorAlert} role="alert">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span>{authError === 'Invalid login credentials' ? 'Incorrect email or password. Please try again.' : authError}</span>
            </div>
          )}

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="login-email" className="form-label">Email</label>
              <div className={styles.inputWrapper}>
                <svg className={styles.inputIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <input
                  id="login-email"
                  type="email"
                  className={`form-input ${styles.inputWithIcon}`}
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  aria-required="true"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="login-password" className="form-label">Password</label>
              <div className={styles.inputWrapper}>
                <svg className={styles.inputIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  className={`form-input ${styles.inputWithIcon} ${styles.inputWithIconRight}`}
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  aria-required="true"
                />
                <button
                  type="button"
                  className={styles.showPasswordBtn}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className={styles.formOptions} style={{ justifyContent: 'center' }}>
              <Link href="/forgot-password" className={styles.forgotLink}>Forgot Password?</Link>
            </div>

            <button
              type="submit"
              className={`btn btn-primary btn-lg ${styles.submitBtn}`}
              disabled={isLoading}
              id="login-submit-btn"
            >
              {isLoading ? (
                <span className={styles.loadingSpinner} aria-hidden="true"/>
              ) : null}
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>



          <p className={styles.signupPrompt}>
            Don't have an account?{' '}
            <Link href="/signup" className={styles.signupLink}>Sign Up Free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
