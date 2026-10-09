'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import styles from './dashboard.module.css';
import profileStyles from './ProfileSettings.module.css';

interface ProfileSettingsProps {
  user: any;
  profile: any;
  onProfileUpdate: (newProfile: any) => void;
}

export default function ProfileSettings({ user, profile, onProfileUpdate }: ProfileSettingsProps) {
  const [name, setName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState({ text: '', type: '' });
  const [passwordMessage, setPasswordMessage] = useState({ text: '', type: '' });
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleUpdateProfileDetails = async (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    setIsProfileLoading(true);
    setProfileMessage({ text: '', type: '' });

    try {
      // 1. Update Profile (Name & Phone) in profiles table
      if (name !== profile?.full_name || phone !== profile?.phone) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ full_name: name, phone: phone })
          .eq('id', user.id);

        if (profileError) throw profileError;
        
        // Update local state in parent
        onProfileUpdate({ ...profile, full_name: name, phone: phone });
      }

      setProfileMessage({ text: 'Profile updated successfully!', type: 'success' });
    } catch (err: any) {
      setProfileMessage({ text: err.message || 'An error occurred.', type: 'error' });
    } finally {
      setIsProfileLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPasswordLoading(true);
    setPasswordMessage({ text: '', type: '' });

    try {
      if (!currentPassword) {
        setPasswordMessage({ text: 'Please enter your current password.', type: 'error' });
        setIsPasswordLoading(false);
        return;
      }
      if (newPassword !== confirmPassword) {
        setPasswordMessage({ text: 'Passwords do not match.', type: 'error' });
        setIsPasswordLoading(false);
        return;
      }
      if (newPassword.length < 6) {
        setPasswordMessage({ text: 'Password must be at least 6 characters.', type: 'error' });
        setIsPasswordLoading(false);
        return;
      }

      // Verify current password first
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword
      });

      if (signInError) {
        throw new Error('Incorrect current password.');
      }

      const { error: authError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (authError) throw authError;
      
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      setPasswordMessage({ text: 'Password updated successfully!', type: 'success' });
    } catch (err: any) {
      setPasswordMessage({ text: err.message || 'An error occurred.', type: 'error' });
    } finally {
      setIsPasswordLoading(false);
    }
  };

  return (
    <div className={profileStyles.container}>
      {profileMessage.text && (
        <div className={`${profileStyles.message} ${profileMessage.type === 'success' ? profileStyles.messageSuccess : profileStyles.messageError}`}>
          {profileMessage.text}
        </div>
      )}

      {/* Personal Details Card (Similar Style) */}
      <div className={profileStyles.profileCard}>
        <div className={profileStyles.cardHeader}>
          <div className={profileStyles.cardIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <h3 className={profileStyles.cardTitle}>PERSONAL DETAILS</h3>
        </div>
        
        <div className={profileStyles.inputGroup}>
          <label className={profileStyles.label}>NAME</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            required
            className={profileStyles.input}
            placeholder="Not provided"
          />
        </div>

        <div className={profileStyles.inputGroup}>
          <label className={profileStyles.label}>EMAIL</label>
          <input 
            type="email" 
            disabled 
            value={user?.email || ''} 
            className={profileStyles.input}
            title="Email cannot be changed"
          />
        </div>

        <div className={profileStyles.inputGroup}>
          <label className={profileStyles.label}>PHONE NUMBER</label>
          <input 
            type="tel" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)}
            className={profileStyles.input}
            placeholder="Add phone number"
          />
        </div>

        {(name !== profile?.full_name || phone !== profile?.phone) && (
          <button 
            type="button"
            onClick={handleUpdateProfileDetails}
            disabled={isProfileLoading}
            className={profileStyles.updateBtn}
            style={{ marginTop: '16px', width: '100%' }}
          >
            {isProfileLoading ? 'SAVING...' : 'SAVE DETAILS'}
          </button>
        )}
      </div>

      {/* Security & Password Card (Exact Match) */}
      <div className={profileStyles.profileCard}>
        <div className={profileStyles.cardHeader}>
          <div className={profileStyles.cardIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <h3 className={profileStyles.cardTitle}>SECURITY & PASSWORD</h3>
        </div>
        
        <form onSubmit={handleUpdatePassword}>
          {passwordMessage.text && (
            <div className={`${profileStyles.message} ${passwordMessage.type === 'success' ? profileStyles.messageSuccess : profileStyles.messageError}`} style={{ marginBottom: '16px' }}>
              {passwordMessage.text}
            </div>
          )}

          <div className={profileStyles.inputGroup}>
            <label className={profileStyles.label}>CURRENT PASSWORD</label>
            <div className={profileStyles.inputWrapper}>
              <input 
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={`${profileStyles.input} ${profileStyles.passwordInput}`}
                placeholder="Enter current password"
              />
              <button
                type="button"
                className={profileStyles.showPasswordBtn}
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                aria-label={showCurrentPassword ? 'Hide password' : 'Show password'}
              >
                {showCurrentPassword ? (
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

          <div className={profileStyles.inputGroup}>
            <label className={profileStyles.label}>NEW PASSWORD</label>
            <div className={profileStyles.inputWrapper}>
              <input 
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)}
                className={`${profileStyles.input} ${profileStyles.passwordInput}`}
                placeholder="At least 6 characters"
              />
              <button
                type="button"
                className={profileStyles.showPasswordBtn}
                onClick={() => setShowNewPassword(!showNewPassword)}
                aria-label={showNewPassword ? 'Hide password' : 'Show password'}
              >
                {showNewPassword ? (
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

          <div className={profileStyles.inputGroup}>
            <label className={profileStyles.label}>CONFIRM NEW PASSWORD</label>
            <div className={profileStyles.inputWrapper}>
              <input 
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`${profileStyles.input} ${profileStyles.passwordInput}`}
                placeholder="Re-enter new password"
              />
              <button
                type="button"
                className={profileStyles.showPasswordBtn}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? (
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

          <div className={profileStyles.buttonRow}>
            <button 
              type="submit" 
              disabled={isPasswordLoading || !newPassword}
              className={profileStyles.updateBtn}
            >
              {isPasswordLoading ? 'UPDATING...' : 'UPDATE PASSWORD'}
            </button>
            <button 
              type="button"
              className={profileStyles.cancelBtn}
              onClick={() => {
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
              }}
            >
              CANCEL
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
