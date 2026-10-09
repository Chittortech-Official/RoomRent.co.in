'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { MOCK_PROPERTIES } from '@/lib/mockData';
import Modal from '@/components/Modal';
import styles from './admin.module.css';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeTableTab, setActiveTableTab] = useState('active');
  const [activeAppTab, setActiveAppTab] = useState('approvedTenants');
  const [customers, setCustomers] = useState<any[]>([]);
  const [adminProperties, setAdminProperties] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  
  // Modal and Action states
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: 'warning' | 'success' | 'error';
    title: string;
    description: string;
  }>({
    isOpen: false,
    type: 'warning',
    title: '',
    description: ''
  });
  const [pendingAction, setPendingAction] = useState<{ propertyId: string, action: string } | null>(null);

  const openModal = (type: 'warning' | 'success' | 'error', title: string, description: string) => {
    setModalState({ isOpen: true, type, title, description });
  };
  
  const closeModal = () => {
    setModalState(prev => ({ ...prev, isOpen: false }));
    setPendingAction(null);
  };

  const handleActionSelect = (propertyId: string, action: string) => {
    if (action === 'approved') {
      setPendingAction({ propertyId, action });
      openModal('warning', 'Approve Property', 'Are you sure you want to approve this property? It will go live immediately.');
    } else if (action === 'rejected') {
      setPendingAction({ propertyId, action });
      openModal('warning', 'Reject Property', 'Are you sure you want to reject this property? The owner will need to resubmit it.');
    }
  };

  const confirmAction = async () => {
    if (!pendingAction) {
      closeModal();
      return;
    }

    try {
      const { data, error } = await supabase
        .from('properties')
        .update({ approval_status: pendingAction.action })
        .eq('id', pendingAction.propertyId)
        .select();

      if (error) throw error;
      
      if (!data || data.length === 0) {
        throw new Error("Update failed. You might not be logged in, or you lack Admin permissions (RLS blocked the update).");
      }

      setAdminProperties(prev => prev.map(p => 
        p.id === pendingAction.propertyId ? { ...p, approval_status: pendingAction.action } : p
      ));
      
      openModal(
        'success', 
        `Property ${pendingAction.action === 'approved' ? 'Approved' : 'Rejected'}`, 
        `The property status has been successfully updated.`
      );
      setPendingAction(null);
    } catch (err: any) {
      openModal('error', 'Update Failed', err.message || 'Something went wrong while updating the status.');
      setPendingAction(null);
    }
  };

  useEffect(() => {
    if (activeTab === 'tenantsProfile') {
      const fetchCustomers = async () => {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });
        if (data) setCustomers(data);
      };
      fetchCustomers();
    } else if (activeTab === 'dashboard' || activeTab === 'properties') {
      const fetchProperties = async () => {
        const { data } = await supabase
          .from('properties')
          .select('*, profiles!inner(full_name, phone)')
          .order('created_at', { ascending: false });
        if (data) setAdminProperties(data);
      };
      fetchProperties();
    }
  }, [activeTab]);

  return (
    <div className={styles.adminLayout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Link href="/" className={styles.logo}>
            <div className={styles.logoIcon}>R</div>
            <div className={styles.logoText}>
              Room Rent
              <span className={styles.logoSubtext}>ADMIN PORTAL</span>
            </div>
          </Link>
        </div>

        <nav className={styles.navMenu}>
          <div className={styles.sectionTitle}>MAIN</div>
          <button 
            className={`${styles.navItem} ${activeTab === 'dashboard' ? styles.activeNav : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <div className={styles.navItemLeft}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
              Dashboard
            </div>
          </button>

          <div className={styles.sectionTitle}>MANAGEMENT</div>
          <button 
            className={`${styles.navItem} ${activeTab === 'properties' ? styles.activeNav : ''}`}
            onClick={() => setActiveTab('properties')}
          >
            <div className={styles.navItemLeft}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
              Properties
            </div>
            <div className={styles.badge}>3</div>
          </button>
          
          <button 
            className={`${styles.navItem} ${activeTab === 'tenantsProfile' ? styles.activeNav : ''}`}
            onClick={() => setActiveTab('tenantsProfile')}
          >
            <div className={styles.navItemLeft}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              Tenants Profile
            </div>
          </button>


          <button 
            className={`${styles.navItem} ${activeTab === 'settings' ? styles.activeNav : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <div className={styles.navItemLeft}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
              Settings
            </div>
          </button>
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.adminProfileCard}>
            <div className={styles.avatarSmall}>A</div>
            <div className={styles.adminProfileText}>
              <span className={styles.adminProfileName}>Admin</span>
              <span className={styles.adminProfileRole}>Administrator</span>
            </div>
          </div>
          
          <Link href="/admin/login" className={styles.logoutBtn}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            Sign Out
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <h1 className={styles.pageTitle}>Dashboard</h1>
          
          <div className={styles.headerRight}>
            <div className={styles.searchBar}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input type="text" placeholder="Search..." className={styles.searchInput} />
            </div>
            
            <div className={styles.headerActions}>
              <svg className={styles.headerIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>
              <svg className={styles.headerIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            </div>
            
            <div className={styles.adminProfileHeader}>
              <div className={styles.avatarSmall}>A</div>
              <div className={styles.adminProfileText}>
                <span className={styles.adminProfileName} style={{color: '#111827'}}>Admin</span>
                <span className={styles.adminProfileRole}>Administrator</span>
              </div>
            </div>
          </div>
        </header>

        <div className={styles.contentArea}>
          {activeTab === 'dashboard' && (
            <>
              <div className={styles.welcomeSection}>
                <div>
                  <h2 className={styles.welcomeTitle}>Good afternoon, Admin 👋</h2>
                  <p className={styles.welcomeSubtitle}>Here's what's happening across Room Rent today.</p>
                </div>
                <div className={styles.liveBadge}>
                  <div className={styles.liveDot}></div>
                  Live
                </div>
              </div>

              {/* Stats Grid */}
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <div className={styles.statIconWrapper} style={{background: '#EFF6FF', color: '#3B82F6'}}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                  </div>
                  <h3 className={styles.statValue}>1,250</h3>
                  <p className={styles.statLabel}>Total Customers</p>
                </div>
                
                <div className={styles.statCard}>
                  <div className={styles.statIconWrapper} style={{background: '#EEF2FF', color: '#4F46E5'}}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                  </div>
                  <h3 className={styles.statValue}>543</h3>
                  <p className={styles.statLabel}>Total Properties</p>
                </div>
                
                <div className={styles.statCard}>
                  <div className={styles.statIconWrapper} style={{background: '#FFFBEB', color: '#D97706'}}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  </div>
                  <h3 className={styles.statValue}>12</h3>
                  <p className={styles.statLabel}>Pending Verification</p>
                </div>
                
                <div className={styles.statCard}>
                  <div className={styles.statIconWrapper} style={{background: '#ECFDF5', color: '#059669'}}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  </div>
                  <h3 className={styles.statValue}>489</h3>
                  <p className={styles.statLabel}>Active Properties</p>
                </div>

              </div>

              {/* Quick Actions */}
              <div className={styles.quickActions}>
                <button 
                  className={styles.actionBtnOutline}
                  onClick={() => openModal('warning', 'Delete Property?', 'Are you sure you want to delete this property? This action cannot be undone.')}
                  style={{ borderColor: '#F97316', color: '#F97316' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                  Test Warning
                </button>
                <button 
                  className={styles.actionBtnOutline}
                  onClick={() => openModal('success', 'Profile Saved!', 'Your changes have been saved successfully.')}
                  style={{ borderColor: '#22C55E', color: '#22C55E' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Test Success
                </button>
                <button 
                  className={styles.actionBtnOutline}
                  onClick={() => openModal('error', 'Update Failed', 'There was an error saving your changes. Please try again.')}
                  style={{ borderColor: '#EF4444', color: '#EF4444' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                  Test Error
                </button>
                <button className={styles.actionBtnOutline}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                  View Customers
                </button>
                <button className={styles.actionBtnOutline}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                  Manage Users
                </button>
                <button className={styles.actionBtnOutline}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>
                  Refresh Data
                </button>
              </div>

              {/* Main Grid: Table & Real-time panel */}
              <div className={styles.mainGrid}>
                {/* Properties Table */}
                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <div>
                      <h3 className={styles.cardTitle}>Recent Properties</h3>
                      <p className={styles.cardSubtitle}>Manage all customer property listings.</p>
                    </div>
                    <Link href="#" className={styles.viewAll}>View All →</Link>
                  </div>

                  <div className={styles.tabsContainer}>
                    <div 
                      className={`${styles.tab} ${activeTableTab === 'active' ? styles.tabActive : ''}`}
                      onClick={() => setActiveTableTab('active')}
                    >
                      Active Properties (Pending/Accepted)
                    </div>
                    <div 
                      className={`${styles.tab} ${activeTableTab === 'past' ? styles.tabActive : ''}`}
                      onClick={() => setActiveTableTab('past')}
                    >
                      Past Properties
                    </div>
                    <div 
                      className={`${styles.tab} ${activeTableTab === 'all' ? styles.tabActive : ''}`}
                      onClick={() => setActiveTableTab('all')}
                    >
                      All Properties
                    </div>
                  </div>

                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Property ID</th>
                        <th>Owner</th>
                        <th>Type / Location</th>
                        <th>Rent</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminProperties.length > 0 ? adminProperties.slice(0, 10).map((prop) => (
                        <tr key={prop.id}>
                          <td>
                            <strong>#{prop.id.substring(0, 8)}</strong>
                            <span className={styles.tdSubtext}>{new Date(prop.created_at).toLocaleDateString()}</span>
                          </td>
                          <td>
                            <div style={{fontWeight: 600}}>{prop.profiles?.full_name || prop.listed_by}</div>
                            <span className={styles.tdSubtext}>{prop.profiles?.phone || 'N/A'}</span>
                          </td>
                          <td>
                            <div style={{fontWeight: 600}}>{prop.property_type}</div>
                            <span className={styles.tdSubtext}>{prop.locality}</span>
                          </td>
                          <td>
                            <div style={{fontWeight: 600}}>₹{prop.rent}</div>
                            <span className={styles.tdSubtext}>/ month</span>
                          </td>
                          <td>
                            <span className={prop.approval_status === 'approved' ? styles.statusActive : styles.statusPending}>
                              {prop.approval_status || 'pending'}
                            </span>
                          </td>
                          <td>
                            <select 
                              className={styles.selectAction}
                              value={prop.approval_status || 'pending'}
                              onChange={(e) => handleActionSelect(prop.id, e.target.value)}
                            >
                              <option value="pending">Pending</option>
                              <option value="approved">Approve</option>
                              <option value="rejected">Reject</option>
                            </select>
                          </td>
                        </tr>
                      )) : (
                        <tr><td colSpan={6} style={{textAlign:'center', padding: '32px'}}>No properties found</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Live Activity Panel */}
                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <h3 className={styles.cardTitle}>Live Activity</h3>
                    <div className={styles.liveBadge} style={{padding: '4px 8px'}}>
                      <div className={styles.liveDot}></div>
                      Live
                    </div>
                  </div>
                  <p className={styles.cardSubtitle} style={{marginBottom: '32px'}}>Real-time events</p>
                  
                  <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                    </div>
                    <h4 style={{marginBottom: '8px', color: '#374151', fontSize: '0.875rem'}}>Listening for real-time events...</h4>
                    <p className={styles.emptyText}>Activity from customers will appear here automatically.</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'properties' && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <h3 className={styles.cardTitle}>All Properties</h3>
                  <p className={styles.cardSubtitle}>Manage all customer property listings across the platform.</p>
                </div>
              </div>

              <div className={styles.tabsContainer}>
                <div 
                  className={`${styles.tab} ${activeTableTab === 'active' ? styles.tabActive : ''}`}
                  onClick={() => setActiveTableTab('active')}
                >
                  Active Properties (Pending/Accepted)
                </div>
                <div 
                  className={`${styles.tab} ${activeTableTab === 'past' ? styles.tabActive : ''}`}
                  onClick={() => setActiveTableTab('past')}
                >
                  Past Properties
                </div>
                <div 
                  className={`${styles.tab} ${activeTableTab === 'all' ? styles.tabActive : ''}`}
                  onClick={() => setActiveTableTab('all')}
                >
                  All Properties
                </div>
              </div>

              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Property ID</th>
                    <th>Owner</th>
                    <th>Type / Location</th>
                    <th>Rent</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {adminProperties.length > 0 ? adminProperties.map((prop) => (
                    <tr key={prop.id}>
                      <td>
                        <strong>#{prop.id.substring(0, 8)}</strong>
                        <span className={styles.tdSubtext}>{new Date(prop.created_at).toLocaleDateString()}</span>
                      </td>
                      <td>
                        <div style={{fontWeight: 600}}>{prop.profiles?.full_name || prop.listed_by}</div>
                        <span className={styles.tdSubtext}>{prop.profiles?.phone || 'N/A'}</span>
                      </td>
                      <td>
                        <div style={{fontWeight: 600}}>{prop.property_type}</div>
                        <span className={styles.tdSubtext}>{prop.locality}</span>
                      </td>
                      <td>
                        <div style={{fontWeight: 600}}>₹{prop.rent}</div>
                        <span className={styles.tdSubtext}>/ month</span>
                      </td>
                      <td>
                        <span className={prop.approval_status === 'approved' ? styles.statusActive : styles.statusPending}>
                          {prop.approval_status || 'pending'}
                        </span>
                      </td>
                      <td>
                        <select 
                          className={styles.selectAction}
                          value={prop.approval_status || 'pending'}
                          onChange={(e) => handleActionSelect(prop.id, e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="approved">Approve</option>
                          <option value="rejected">Reject</option>
                        </select>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan={6} style={{textAlign:'center', padding: '32px'}}>No properties found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'tenantsProfile' && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <h3 className={styles.cardTitle}>Tenant Applications</h3>
                  <p className={styles.cardSubtitle}>Review and manage tenant and partner onboarding requests.</p>
                </div>
              </div>
              
              <div className={styles.tabsContainer} style={{marginBottom: '1rem', borderBottom: '1px solid #e5e7eb'}}>
                <div 
                  className={`${styles.tab} ${activeAppTab === 'pending' ? styles.tabActive : ''}`}
                  onClick={() => setActiveAppTab('pending')}
                  style={activeAppTab === 'pending' ? {borderBottom: '2px solid #ef4444', color: '#ef4444'} : {}}
                >
                  Pending / Rejected
                </div>
                <div 
                  className={`${styles.tab} ${activeAppTab === 'approvedPartners' ? styles.tabActive : ''}`}
                  onClick={() => setActiveAppTab('approvedPartners')}
                  style={activeAppTab === 'approvedPartners' ? {borderBottom: '2px solid #ef4444', color: '#ef4444'} : {}}
                >
                  Approved Partners
                </div>
                <div 
                  className={`${styles.tab} ${activeAppTab === 'approvedTenants' ? styles.tabActive : ''}`}
                  onClick={() => setActiveAppTab('approvedTenants')}
                  style={activeAppTab === 'approvedTenants' ? {borderBottom: '2px solid #ef4444', color: '#ef4444'} : {}}
                >
                  Approved Tenants
                </div>
              </div>

              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Phone</th>
                    <th>Joined At</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr 
                      key={customer.id} 
                      onClick={() => setSelectedCustomer(customer)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td>
                        <strong>#{customer.id.substring(0, 8)}</strong>
                      </td>
                      <td>
                        <div style={{fontWeight: 600}}>{customer.full_name || 'Not provided'}</div>
                      </td>
                      <td>{customer.email}</td>
                      <td>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          backgroundColor: customer.role === 'owner' ? '#fef3c7' : '#e0e7ff',
                          color: customer.role === 'owner' ? '#d97706' : '#4f46e5'
                        }}>
                          {customer.role || 'user'}
                        </span>
                      </td>
                      <td>{customer.phone || 'N/A'}</td>
                      <td className={styles.tdSubtext}>
                        {new Date(customer.created_at).toLocaleDateString()}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" style={{ cursor: 'pointer' }}>
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      </td>
                    </tr>
                  ))}
                  {customers.length === 0 && (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '32px' }}>
                        No customers found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab !== 'dashboard' && activeTab !== 'tenantsProfile' && activeTab !== 'properties' && (
            <div className={styles.placeholderState}>
              <div style={{fontSize: '3rem', marginBottom: '16px'}}>🚧</div>
              <h2 style={{fontSize: '1.25rem', color: '#111827', marginBottom: '8px'}}>
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Module
              </h2>
              <p>This section is currently under development for the demo.</p>
            </div>
          )}
        </div>
      </main>

      <Modal 
        isOpen={modalState.isOpen}
        type={modalState.type}
        title={modalState.title}
        description={modalState.description}
        confirmText={pendingAction ? 'Yes, Continue' : (modalState.type === 'error' ? 'Try Again' : 'Awesome')}
        cancelText={modalState.type === 'success' || modalState.type === 'error' && !pendingAction ? undefined : 'Cancel'}
        onConfirm={pendingAction ? confirmAction : closeModal}
        onCancel={closeModal}
      />

      {/* Slide-out Profile Panel */}
      <div className={`${styles.profilePanel} ${selectedCustomer ? styles.profilePanelOpen : ''}`}>
        <div className={styles.profilePanelHeader}>
          <h2 className={styles.profilePanelTitle}>Customer Profile</h2>
          <button className={styles.closeBtn} onClick={() => setSelectedCustomer(null)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        
        {selectedCustomer && (
          <div className={styles.profilePanelContent}>
            <div className={styles.profileUserHero}>
              <div className={styles.profileUserAvatar}>
                {selectedCustomer.full_name ? selectedCustomer.full_name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className={styles.profileUserDetails}>
                <div className={styles.profileUserName}>{selectedCustomer.full_name || 'Not provided'}</div>
                <div className={styles.profileUserMeta}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  {selectedCustomer.phone || 'N/A'}
                </div>
                <div className={styles.profileUserMeta}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  {selectedCustomer.email}
                </div>
                <div className={styles.profileUserMeta}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  Joined {new Date(selectedCustomer.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              </div>
            </div>

            <div className={styles.profileTabs}>
              <div className={`${styles.profileTab} ${styles.profileTabActive}`}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                Overview
              </div>
            </div>

            <div className={styles.profileDataGrid}>
              <div>
                <div className={styles.profileDataLabel}>Full Name</div>
                <div className={styles.profileDataValue}>{selectedCustomer.full_name || 'Not set'}</div>
              </div>
              <div>
                <div className={styles.profileDataLabel}>Email</div>
                <div className={styles.profileDataValue}>{selectedCustomer.email}</div>
              </div>
              <div>
                <div className={styles.profileDataLabel}>Phone</div>
                <div className={styles.profileDataValue}>{selectedCustomer.phone || 'Not set'}</div>
              </div>
              <div>
                <div className={styles.profileDataLabel}>Customer ID</div>
                <div className={styles.profileDataValue}>{selectedCustomer.id.substring(0, 13)}...</div>
              </div>
              <div>
                <div className={styles.profileDataLabel}>Member Since</div>
                <div className={styles.profileDataValue}>
                  {new Date(selectedCustomer.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              </div>
              <div>
                <div className={styles.profileDataLabel}>Total Properties Posted</div>
                <div className={styles.profileDataValue}>
                  {adminProperties.filter(p => p.owner_id === selectedCustomer.id).length}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
