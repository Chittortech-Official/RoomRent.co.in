'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './dashboard.module.css';
import ProfileSettings from './ProfileSettings';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('properties');
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab');
      if (tab) {
        setActiveTab(tab);
      }
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const fetchDashboardData = async (sessionUser: any) => {
      setUser(sessionUser);

      // 2. Fetch Profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', sessionUser.id)
        .single();
      
      if (mounted) setProfile(profileData);

      // 3. Fetch Properties (RLS ensures we only get this owner's properties)
      const { data: propertiesData } = await supabase
        .from('properties')
        .select('*, property_images(image_url)')
        .order('created_at', { ascending: false });

      if (mounted && propertiesData) {
        setProperties(propertiesData);
      }
      
      if (mounted) setIsLoading(false);
    };

    // First check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        fetchDashboardData(session.user);
      } else {
        if (mounted) {
          router.push('/login');
        }
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        if (mounted) router.push('/login');
      } else if (event === 'SIGNED_IN' && session) {
        fetchDashboardData(session.user);
      }
    });

    // Subscribe to realtime changes for properties
    const propertiesSubscription = supabase.channel('dashboard_properties_changes')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'properties' },
        (payload) => {
          if (mounted) {
            setProperties(prev => prev.map(p => 
              p.id === payload.new.id ? { ...p, ...payload.new } : p
            ));
          }
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      subscription.unsubscribe();
      supabase.removeChannel(propertiesSubscription);
    };
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid #f3f3f3', borderTop: '3px solid #3b82f6', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Link href="/" className={styles.logo}>
            <span>Room</span>Rent.co.in
          </Link>
        </div>
        
        <nav className={styles.sidebarNav}>
          <button 
            className={`${styles.navItem} ${activeTab === 'properties' ? styles.active : ''}`}
            onClick={() => setActiveTab('properties')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            My Properties
          </button>
          
          <button 
            className={`${styles.navItem} ${activeTab === 'saved' ? styles.active : ''}`}
            onClick={() => setActiveTab('saved')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            Saved Rooms
          </button>
          
          <button 
            className={`${styles.navItem} ${activeTab === 'leads' ? styles.active : ''}`}
            onClick={() => setActiveTab('leads')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            Leads & Enquiries
          </button>
          
          <button 
            className={`${styles.navItem} ${activeTab === 'profile' ? styles.active : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
            Settings
          </button>
        </nav>
        
        <div className={styles.sidebarFooter}>
          <button className={styles.navItem} onClick={handleSignOut} style={{ width: '100%', color: '#ef4444' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={styles.mainContent}>
        {/* Topbar */}
        {activeTab === 'profile' ? (
          <div className={styles.profileHeaderGradient}>
            <button className={styles.backBtnGradient} onClick={() => router.push('/')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Back to Home
            </button>
            
            <div className={styles.profileSummaryArea}>
              <div className={styles.profileAvatarLarge}>
                {(profile?.full_name || user?.email || 'O').charAt(0).toUpperCase()}
              </div>
              
              <div className={styles.profileDetailsMain}>
                <h2 className={styles.profileNameLarge}>{profile?.full_name || 'Owner Name'}</h2>
                <p className={styles.profileEmailLarge}>{user?.email}</p>
                
                <div className={styles.verifiedBadge}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  Verified Owner
                </div>
              </div>
            </div>
            
            <button className={styles.logoutBtnGradient} onClick={handleSignOut}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Logout
            </button>
          </div>
        ) : (
          <header className={styles.topbar}>
              <div className={styles.titleArea}>
                <button className={styles.backBtnDashboard} onClick={() => router.push('/')} aria-label="Back to Home" title="Back to Home">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                  </svg>
                </button>
                <h2 className={styles.pageTitle}>
                  {activeTab === 'properties' && 'My Properties'}
                  {activeTab === 'saved' && 'My Favorites'}
                  {activeTab === 'leads' && 'Leads & Enquiries'}
                </h2>
              </div>
            
            <div className={styles.userInfo}>
              <div className={styles.userAvatar} style={{ background: '#e0e7ff', color: '#4f46e5', fontWeight: 700 }}>
                {(profile?.full_name || user?.email || 'U').charAt(0).toUpperCase()}
              </div>
            </div>
          </header>
        )}

        {/* Dynamic Content */}
        <div className={styles.contentArea}>
          {activeTab === 'properties' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <p style={{ color: '#64748b' }}>Manage your property listings and availability.</p>
                <Link href="/post-property" className={styles.primaryBtn}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Post New Property
                </Link>
              </div>

              {properties.length === 0 ? (
                <div className={styles.emptyState}>
                  <svg className={styles.emptyIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  </svg>
                  <div>
                    <h3 className={styles.emptyTitle}>No properties yet</h3>
                    <p className={styles.emptyDesc}>You haven't listed any properties. Post your first room or apartment to start receiving leads.</p>
                  </div>
                  <Link href="/post-property" className={styles.primaryBtn}>
                    Post Your First Property
                  </Link>
                </div>
              ) : (
                <div className={styles.propertiesGrid}>
                  {properties.map(property => (
                    <div key={property.id} className={styles.propertyCard}>
                      <div className={styles.propertyImage}>
                        {property.property_images && property.property_images.length > 0 ? (
                          <img src={property.property_images[0].image_url} alt={property.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                            No Image
                          </div>
                        )}
                      </div>
                      <div className={styles.propertyInfo}>
                        <div className={styles.propertyHeader}>
                          <div>
                            <h3 className={styles.propertyTitle}>{property.title}</h3>
                            <span className={styles.propertyLocation}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                              </svg>
                              {property.locality}, {property.city}
                            </span>
                          </div>
                          <span className={`${styles.statusBadge} ${
                            property.approval_status === 'approved' ? styles.statusApproved : 
                            property.approval_status === 'rejected' ? styles.statusRejected : 
                            styles.statusPending
                          }`}>
                            {property.approval_status}
                          </span>
                        </div>
                        
                        <div className={styles.propertyFooter}>
                          <div className={styles.propertyRent}>₹{property.rent}<span style={{fontSize: '0.875rem', color: '#64748b', fontWeight: 'normal'}}>/mo</span></div>
                          <button className={styles.actionBtn}>Manage</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'saved' && (
            <div className={styles.emptyState}>
              <svg className={styles.emptyIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              <div>
                <h3 className={styles.emptyTitle}>No saved rooms</h3>
                <p className={styles.emptyDesc}>You haven't saved any properties yet. Start browsing to find your perfect home.</p>
              </div>
              <Link href="/" className={styles.primaryBtn}>
                Browse Properties
              </Link>
            </div>
          )}

          {activeTab === 'leads' && (
             <div className={styles.emptyState}>
              <svg className={styles.emptyIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
              </svg>
              <div>
                <h3 className={styles.emptyTitle}>No leads yet</h3>
                <p className={styles.emptyDesc}>Once your property is approved and goes live, tenant enquiries will appear here.</p>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <ProfileSettings user={user} profile={profile} onProfileUpdate={setProfile} />
          )}
        </div>
      </main>
    </div>
  );
}
