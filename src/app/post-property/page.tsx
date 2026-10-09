'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Modal from '@/components/Modal';
import { supabase } from '@/lib/supabase';
import styles from './post.module.css';

const STEPS = ['Basic Info', 'Location', 'Details', 'Photos'];

export default function PostPropertyPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [session, setSession] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    propertyType: 'Room',
    listedBy: 'owner',
    city: 'Hyderabad',
    locality: '',
    buildingName: '',
    rent: '',
    deposit: '',
    furnishing: 'Fully Furnished',
    amenities: [] as string[],
  });

  const [files, setFiles] = useState<File[]>([]);
  const [modalState, setModalState] = useState({ isOpen: false, type: 'success' as any, title: '', desc: '' });

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.push('/login');
      } else {
        setSession(data.session);
      }
    });

    // Restore from localStorage
    const savedData = localStorage.getItem('postPropertyData');
    if (savedData) {
      try {
        const { formData: savedFormData, currentStep: savedStep } = JSON.parse(savedData);
        if (savedFormData) setFormData(savedFormData);
        if (savedStep !== undefined) setCurrentStep(savedStep);
      } catch (e) {
        // ignore JSON parse errors
      }
    }
  }, [router]);

  useEffect(() => {
    // Save to localStorage
    localStorage.setItem('postPropertyData', JSON.stringify({ formData, currentStep }));
  }, [formData, currentStep]);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) setCurrentStep(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => {
      if (prev.amenities.includes(amenity)) {
        return { ...prev, amenities: prev.amenities.filter(a => a !== amenity) };
      } else {
        return { ...prev, amenities: [...prev.amenities, amenity] };
      }
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;
    setIsSubmitting(true);

    try {
      // 1. Insert Property
      const { data: propData, error: propError } = await supabase
        .from('properties')
        .insert({
          owner_id: session.user.id,
          title: formData.title || `${formData.propertyType} for Rent in ${formData.locality}`,
          property_type: formData.propertyType.toLowerCase().replace(' ', '_'),
          rent: parseInt(formData.rent) || 0,
          deposit: parseInt(formData.deposit) || 0,
          city: formData.city,
          locality: formData.locality,
          landmark: formData.buildingName,
          furnishing: formData.furnishing,
          amenities: formData.amenities,
          approval_status: 'pending',
          availability_status: 'available'
        })
        .select()
        .single();

      if (propError) throw propError;

      // 2. Upload Images
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${propData.id}/${Date.now()}-${i}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('property-images')
          .upload(fileName, file);

        if (!uploadError) {
          const { data: publicUrlData } = supabase.storage
            .from('property-images')
            .getPublicUrl(fileName);

          await supabase.from('property_images').insert({
            property_id: propData.id,
            image_url: publicUrlData.publicUrl,
            storage_path: fileName,
            display_order: i
          });
        }
      }

      setModalState({
        isOpen: true,
        type: 'success',
        title: 'Property Submitted!',
        desc: 'Your property has been submitted for review. It will be live once approved.'
      });
      localStorage.removeItem('postPropertyData');
    } catch (err: any) {
      setModalState({
        isOpen: true,
        type: 'error',
        title: 'Submission Failed',
        desc: err.message || 'Something went wrong.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <Navbar />

      <div className={styles.wrapper}>
        <div className="container">
          <div className={styles.header}>
            <h1 className={styles.title}>Post Your Property</h1>
            <p className={styles.subtitle}>Reach thousands of tenants in Hyderabad. It's completely free.</p>
          </div>

          <div className={styles.stepperContainer}>
            <div className={styles.stepperHeader}>
              {STEPS.map((step, index) => (
                <div key={step} className={`${styles.stepItem} ${index <= currentStep ? styles.stepActive : ''}`}>
                  <div className={styles.stepCircle}>
                    {index < currentStep ? '✓' : index + 1}
                  </div>
                  <span className={styles.stepLabel}>{step}</span>
                  {index < STEPS.length - 1 && <div className={styles.stepLine} />}
                </div>
              ))}
            </div>

            <div className={styles.stepperContent}>
              <form onSubmit={e => e.preventDefault()} className={styles.form}>
                
                {currentStep === 0 && (
                  <div className={styles.stepPane}>
                    <h2 className={styles.paneTitle}>Basic Information</h2>
                    <div className={styles.propertyTypes}>
                      {['Room', 'PG', 'Hostel', '1 BHK', '2 BHK', '3 BHK'].map(type => (
                        <button
                          key={type}
                          type="button"
                          className={`${styles.typeCard} ${formData.propertyType === type ? styles.typeActive : ''}`}
                          onClick={() => setFormData(prev => ({ ...prev, propertyType: type }))}
                        >
                          <span className={styles.typeCheck}>✓</span>
                          {type}
                        </button>
                      ))}
                    </div>

                    <div className="form-group" style={{marginTop: '1.5rem'}}>
                      <label className="form-label">Property Title</label>
                      <input name="title" value={formData.title} onChange={handleChange} type="text" className="form-input" placeholder={`e.g. Spacious ${formData.propertyType} for Rent`} />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Are you a broker or owner?</label>
                      <div className={styles.radioGroup}>
                        <label className={styles.radioLabel}>
                          <input type="radio" name="listedBy" value="owner" checked={formData.listedBy === 'owner'} onChange={handleChange} /> Owner
                        </label>
                        <label className={styles.radioLabel}>
                          <input type="radio" name="listedBy" value="broker" checked={formData.listedBy === 'broker'} onChange={handleChange} /> Broker / Agent
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 1 && (
                  <div className={styles.stepPane}>
                    <h2 className={styles.paneTitle}>Location Details</h2>
                    <div className="form-group">
                      <label className="form-label">City</label>
                      <input type="text" name="city" value={formData.city} className="form-input" disabled />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Locality / Area</label>
                      <input type="text" name="locality" value={formData.locality} onChange={handleChange} className="form-input" placeholder="e.g. Gachibowli, Madhapur" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Building / Society Name (Optional)</label>
                      <input type="text" name="buildingName" value={formData.buildingName} onChange={handleChange} className="form-input" placeholder="e.g. My Home Avatar" />
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className={styles.stepPane}>
                    <h2 className={styles.paneTitle}>Rent & Amenities</h2>
                    <div className={styles.formRow}>
                      <div className="form-group">
                        <label className="form-label">Expected Rent (₹/month)</label>
                        <input type="number" name="rent" value={formData.rent} onChange={handleChange} className="form-input" placeholder="e.g. 15000" required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Security Deposit (₹)</label>
                        <input type="number" name="deposit" value={formData.deposit} onChange={handleChange} className="form-input" placeholder="e.g. 30000" />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Furnishing Status</label>
                      <select name="furnishing" value={formData.furnishing} onChange={handleChange} className="form-input form-select">
                        <option value="Fully Furnished">Fully Furnished</option>
                        <option value="Semi Furnished">Semi Furnished</option>
                        <option value="Unfurnished">Unfurnished</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Available Amenities</label>
                      <div className={styles.amenitiesCheckboxes}>
                        {['WiFi', 'AC', 'Power Backup', 'Parking', 'Gym', 'Swimming Pool'].map(amenity => (
                          <label key={amenity} className={styles.checkboxLabel}>
                            <input type="checkbox" checked={formData.amenities.includes(amenity)} onChange={() => handleAmenityToggle(amenity)} /> {amenity}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className={styles.stepPane}>
                    <h2 className={styles.paneTitle}>Upload Photos</h2>
                    <p className={styles.paneSubtitle}>Properties with photos get 5x more views.</p>
                    
                    <div className={styles.uploadArea}>
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{color: 'var(--primary)', marginBottom: '1rem'}}>
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21 15 16 10 5 21"/>
                      </svg>
                      <p className={styles.uploadText}>Select photos to upload</p>
                      <input type="file" multiple accept="image/*" onChange={handleFileChange} style={{ marginTop: '1rem' }} />
                      {files.length > 0 && <p style={{marginTop: '1rem', fontWeight: 600}}>{files.length} files selected</p>}
                    </div>
                  </div>
                )}
              </form>
            </div>

            <div className={styles.stepperFooter}>
              <button type="button" className="btn btn-outline" onClick={handlePrev} disabled={currentStep === 0 || isSubmitting}>
                Back
              </button>

              {currentStep < STEPS.length - 1 ? (
                <button type="button" className="btn btn-primary" onClick={handleNext}>
                  Save & Continue
                </button>
              ) : (
                <button type="button" className="btn btn-primary" onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? 'Posting...' : 'Post Property Now'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <Modal 
        isOpen={modalState.isOpen}
        type={modalState.type}
        title={modalState.title}
        description={modalState.desc}
        confirmText={modalState.type === 'success' ? 'Go to Dashboard' : 'OK'}
        onConfirm={() => {
          setModalState(prev => ({...prev, isOpen: false}));
          if (modalState.type === 'success') router.push('/dashboard');
        }}
      />
    </div>
  );
}
