'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PropertyCard from '@/components/PropertyCard';
import { MOCK_PROPERTIES } from '@/lib/mockData';
import styles from './search.module.css';

const PROPERTY_TYPES = ['All', 'Room', 'PG', 'Hostel', '1 BHK', '2 BHK', '3 BHK', 'Flat', 'Apartment'];
const FURNISHING_OPTIONS = ['Any', 'Fully Furnished', 'Semi Furnished', 'Unfurnished'];
const GENDER_OPTIONS = ['Any', 'Male', 'Female'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'area-desc', label: 'Area: Largest First' },
];
const LOCALITIES = [
  'Gachibowli', 'Madhapur', 'Kondapur', 'Hitech City',
  'Ameerpet', 'Kukatpally', 'Banjara Hills', 'Jubilee Hills',
  'Secunderabad', 'Miyapur', 'Manikonda', 'Begumpet',
];

function SearchContent() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'All');
  const [furnishing, setFurnishing] = useState('Any');
  const [gender, setGender] = useState('Any');
  const [minRent, setMinRent] = useState('');
  const [maxRent, setMaxRent] = useState('');
  const [selectedLocalities, setSelectedLocalities] = useState<string[]>([]);
  const [noBrokerage, setNoBrokerage] = useState(searchParams.get('noBrokerage') === 'true');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const toggleLocality = (loc: string) => {
    setSelectedLocalities(prev =>
      prev.includes(loc) ? prev.filter(l => l !== loc) : [...prev, loc]
    );
  };

  const clearFilters = () => {
    setSelectedType('All');
    setFurnishing('Any');
    setGender('Any');
    setMinRent('');
    setMaxRent('');
    setSelectedLocalities([]);
    setNoBrokerage(false);
  };

  const hasActiveFilters = selectedType !== 'All' || furnishing !== 'Any' || gender !== 'Any' ||
    minRent || maxRent || selectedLocalities.length > 0 || noBrokerage;

  // Filter & sort properties
  const filteredProperties = MOCK_PROPERTIES.filter(p => {
    if (searchQuery && !p.locality.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !p.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !p.city.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (selectedType && selectedType !== 'All' && p.type !== selectedType) return false;
    if (furnishing !== 'Any' && p.furnishing !== furnishing) return false;
    if (gender !== 'Any' && p.genderPreference !== gender && p.genderPreference !== 'Any') return false;
    if (minRent && p.rent < parseInt(minRent)) return false;
    if (maxRent && p.rent > parseInt(maxRent)) return false;
    if (selectedLocalities.length > 0 && !selectedLocalities.includes(p.locality)) return false;
    if (noBrokerage && !p.noBrokerage) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.rent - b.rent;
    if (sortBy === 'price-desc') return b.rent - a.rent;
    return 0;
  });

  const FiltersContent = () => (
    <div className={styles.filtersContent}>
      {/* Type Filter */}
      <div className={styles.filterGroup}>
        <h3 className={styles.filterGroupTitle}>Property Type</h3>
        <div className={styles.typeButtons}>
          {PROPERTY_TYPES.map(type => (
            <button
              key={type}
              className={`${styles.typeBtn} ${selectedType === type ? styles.typeBtnActive : ''}`}
              onClick={() => setSelectedType(type)}
              aria-pressed={selectedType === type}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <hr className={styles.filterDivider} />

      {/* Budget */}
      <div className={styles.filterGroup}>
        <h3 className={styles.filterGroupTitle}>Budget (₹/month)</h3>
        <div className={styles.rangeInputs}>
          <input
            type="number"
            className={`form-input ${styles.rangeInput}`}
            placeholder="Min"
            value={minRent}
            onChange={e => setMinRent(e.target.value)}
            aria-label="Minimum rent"
          />
          <span className={styles.rangeSep}>–</span>
          <input
            type="number"
            className={`form-input ${styles.rangeInput}`}
            placeholder="Max"
            value={maxRent}
            onChange={e => setMaxRent(e.target.value)}
            aria-label="Maximum rent"
          />
        </div>
        <div className={styles.budgetPresets}>
          {[
            { label: 'Under ₹8K', min: '', max: '8000' },
            { label: '₹8K–15K', min: '8000', max: '15000' },
            { label: '₹15K–30K', min: '15000', max: '30000' },
            { label: 'Above ₹30K', min: '30000', max: '' },
          ].map(preset => (
            <button
              key={preset.label}
              className={`${styles.presetBtn} ${minRent === preset.min && maxRent === preset.max ? styles.presetBtnActive : ''}`}
              onClick={() => { setMinRent(preset.min); setMaxRent(preset.max); }}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <hr className={styles.filterDivider} />

      {/* Furnishing */}
      <div className={styles.filterGroup}>
        <h3 className={styles.filterGroupTitle}>Furnishing</h3>
        <div className={styles.radioGroup}>
          {FURNISHING_OPTIONS.map(opt => (
            <label key={opt} className={styles.radioLabel}>
              <input
                type="radio"
                name="furnishing"
                value={opt}
                checked={furnishing === opt}
                onChange={() => setFurnishing(opt)}
                className={styles.radioInput}
              />
              <span className={styles.radioCustom}/>
              {opt}
            </label>
          ))}
        </div>
      </div>

      <hr className={styles.filterDivider} />

      {/* Localities */}
      <div className={styles.filterGroup}>
        <h3 className={styles.filterGroupTitle}>Locality</h3>
        <div className={styles.localityCheckboxes}>
          {LOCALITIES.map(loc => (
            <label key={loc} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={selectedLocalities.includes(loc)}
                onChange={() => toggleLocality(loc)}
                className={styles.checkboxInput}
              />
              <span className={styles.checkboxCustom}/>
              {loc}
            </label>
          ))}
        </div>
      </div>

      <hr className={styles.filterDivider} />

      {/* Gender */}
      <div className={styles.filterGroup}>
        <h3 className={styles.filterGroupTitle}>Gender Preference</h3>
        <div className={styles.radioGroup}>
          {GENDER_OPTIONS.map(opt => (
            <label key={opt} className={styles.radioLabel}>
              <input
                type="radio"
                name="gender"
                value={opt}
                checked={gender === opt}
                onChange={() => setGender(opt)}
                className={styles.radioInput}
              />
              <span className={styles.radioCustom}/>
              {opt}
            </label>
          ))}
        </div>
      </div>

      <hr className={styles.filterDivider} />

      {/* Zero Brokerage */}
      <div className={styles.filterGroup}>
        <label className={styles.toggleLabel}>
          <input
            type="checkbox"
            checked={noBrokerage}
            onChange={() => setNoBrokerage(!noBrokerage)}
            className={styles.toggleInput}
            role="switch"
            aria-checked={noBrokerage}
          />
          <span className={`${styles.toggle} ${noBrokerage ? styles.toggleActive : ''}`}/>
          <span className={styles.toggleText}>
            <strong>Zero Brokerage Only</strong>
            <small>Direct owner listings</small>
          </span>
        </label>
      </div>

      {hasActiveFilters && (
        <button className={styles.clearFiltersBtn} onClick={clearFilters}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
          Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <div className={styles.page}>
      <Navbar />

      <div className={styles.wrapper}>
        {/* Search Header */}
        <div className={styles.searchHeader}>
          <div className="container">
            <div className={styles.searchBarRow}>
              <form className={styles.searchBar} onSubmit={(e) => e.preventDefault()} role="search">
                <div className={styles.searchInputWrapper}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="11" cy="11" r="8"/>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                  <input
                    id="search-page-input"
                    type="text"
                    className={styles.searchInput}
                    placeholder="Search by locality, area..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    aria-label="Search properties"
                  />
                </div>
              </form>

              <div className={styles.sortRow}>
                <select
                  className={`form-input form-select ${styles.sortSelect}`}
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  aria-label="Sort properties"
                >
                  {SORT_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>

                {/* Mobile Filters Button */}
                <button
                  className={styles.mobileFilterBtn}
                  onClick={() => setShowMobileFilters(true)}
                  aria-label="Open filters"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="4" y1="6" x2="20" y2="6"/>
                    <line x1="4" y1="12" x2="14" y2="12"/>
                    <line x1="4" y1="18" x2="8" y2="18"/>
                  </svg>
                  Filters
                  {hasActiveFilters && <span className={styles.filterBadge}/>}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className={styles.layout}>
            {/* Desktop Filters Sidebar */}
            <aside className={styles.sidebar} aria-label="Property filters">
              <div className={styles.sidebarHeader}>
                <h2 className={styles.sidebarTitle}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="4" y1="6" x2="20" y2="6"/>
                    <line x1="4" y1="12" x2="14" y2="12"/>
                    <line x1="4" y1="18" x2="8" y2="18"/>
                  </svg>
                  Filters
                </h2>
                {hasActiveFilters && (
                  <button className={styles.clearBtn} onClick={clearFilters} aria-label="Clear all filters">
                    Clear All
                  </button>
                )}
              </div>
              <FiltersContent />
            </aside>

            {/* Results */}
            <main className={styles.results}>
              {/* Results Header */}
              <div className={styles.resultsHeader}>
                <p className={styles.resultsCount}>
                  <strong>{filteredProperties.length}</strong> {filteredProperties.length === 1 ? 'property' : 'properties'} found
                  {searchQuery && <> for "<em>{searchQuery}</em>"</>}
                </p>
              </div>

              {/* Loading Skeletons */}
              {isLoading ? (
                <div className={styles.propertyGrid}>
                  {[1,2,3,4,5,6].map(i => (
                    <div key={i} className={styles.skeletonCard}>
                      <div className={`skeleton ${styles.skeletonImg}`}/>
                      <div className={styles.skeletonBody}>
                        <div className={`skeleton ${styles.skeletonLine}`} style={{width: '60%', height: '20px'}}/>
                        <div className={`skeleton ${styles.skeletonLine}`} style={{width: '90%', height: '14px'}}/>
                        <div className={`skeleton ${styles.skeletonLine}`} style={{width: '70%', height: '14px'}}/>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredProperties.length === 0 ? (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIcon} aria-hidden="true">🔍</div>
                  <h3 className={styles.emptyTitle}>No properties found</h3>
                  <p className={styles.emptyDesc}>Try adjusting your filters or search query to find more options.</p>
                  <button className="btn btn-primary" onClick={clearFilters}>Clear Filters</button>
                </div>
              ) : (
                <div className={styles.propertyGrid}>
                  {filteredProperties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              )}
            </main>
          </div>
        </div>
      </div>

      {/* Mobile Filters Bottom Sheet */}
      {showMobileFilters && (
        <>
          <div className={styles.mobileFilterBackdrop} onClick={() => setShowMobileFilters(false)} aria-hidden="true"/>
          <div className={styles.mobileFilterSheet} role="dialog" aria-label="Filters" aria-modal="true">
            <div className={styles.mobileFilterHandle}/>
            <div className={styles.mobileFilterHeader}>
              <h2 className={styles.mobileFilterTitle}>Filters</h2>
              <button className={styles.mobileFilterClose} onClick={() => setShowMobileFilters(false)} aria-label="Close filters">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div className={styles.mobileFilterBody}>
              <FiltersContent />
            </div>
            <div className={styles.mobileFilterFooter}>
              <button className="btn btn-secondary" onClick={clearFilters}>Clear All</button>
              <button className="btn btn-primary" onClick={() => setShowMobileFilters(false)} style={{flex: 1}}>
                Show {filteredProperties.length} Properties
              </button>
            </div>
          </div>
        </>
      )}

      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <React.Suspense fallback={<div className="container" style={{padding: '100px 0', textAlign: 'center'}}>Loading Search...</div>}>
      <SearchContent />
    </React.Suspense>
  );
}
