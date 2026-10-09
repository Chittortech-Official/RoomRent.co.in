'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import styles from '../login/login.module.css';
import Logo from '@/components/Logo'; // Reusing login styles

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: '', type: '' });
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setMessage({ text: error.message, type: 'error' });
      } else {
        setMessage({ text: 'Check your email for the password reset link.', type: 'success' });
        setEmail('');
      }
    } catch (err: any) {
      setMessage({ text: err.message || 'An error occurred.', type: 'error' });
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
            <h1 className={styles.formTitle}>Forgot Password?</h1>
            <p className={styles.formSubtitle}>No worries, we'll send you reset instructions.</p>
          </div>

          {message.text && (
            <div className={styles.errorAlert} role="alert" style={{ backgroundColor: message.type === 'success' ? '#ecfdf5' : '#fef2f2', color: message.type === 'success' ? '#059669' : '#dc2626', borderColor: message.type === 'success' ? '#a7f3d0' : '#fecaca' }}>
              <span>{message.text}</span>
            </div>
          )}

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="reset-email" className="form-label">Email</label>
              <div className={styles.inputWrapper}>
                <svg className={styles.inputIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <input
                  id="reset-email"
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

            <button
              type="submit"
              className={`btn btn-primary btn-lg ${styles.submitBtn}`}
              disabled={isLoading || !email}
            >
              {isLoading ? (
                <span className={styles.loadingSpinner} aria-hidden="true"/>
              ) : null}
              {isLoading ? 'Sending...' : 'Reset Password'}
            </button>
          </form>

          <p className={styles.signupPrompt} style={{ marginTop: '24px' }}>
            Remembered your password?{' '}
            <Link href="/login" className={styles.signupLink}>Back to Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
