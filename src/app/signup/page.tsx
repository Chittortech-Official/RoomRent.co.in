'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import styles from '../login/login.module.css'; // Reusing login styles
import Logo from '@/components/Logo';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            requested_role: 'user'
          }
        }
      });

      if (error) {
        alert(error.message);
      } else {
        alert('Signup successful! Please login to continue.');
        window.location.href = '/login';
      }
    } catch (err) {
      alert('An error occurred during signup.');
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
            <h2 className={styles.imageHeading}>Join the fastest growing rental platform</h2>
            <p className={styles.imageSubtext}>
              Find your perfect home with zero brokerage and direct owner contact.
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className={styles.formPanel}>
        <div className={styles.formWrapper}>
          <div className={styles.mobileLogo}>
            <Logo />
          </div>

          <div className={styles.formHeader}>
            <h1 className={styles.formTitle}>Create an account</h1>
            <p className={styles.formSubtitle}>Join RoomRent.co.in today</p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Enter your full name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input 
                type="email" 
                className="form-input" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className={styles.inputWrapper}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  style={{paddingRight: '2.75rem'}}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className={styles.showPasswordBtn}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button type="submit" className={`btn btn-primary btn-lg ${styles.submitBtn}`} disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          <p className={styles.signupPrompt} style={{marginTop: '1.5rem'}}>
            Already have an account?{' '}
            <Link href="/login" className={styles.signupLink}>Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
