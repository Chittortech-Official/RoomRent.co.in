import React from 'react';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  dark?: boolean; // If true, text is white, else text is dark
}

export default function Logo({ className = '', dark = false }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
        {/* Map Pinpoint (Bright Blue) */}
        <path 
          d="M16 11C11.5817 11 8 14.5817 8 19C8 24.5 16 31 16 31C16 31 24 24.5 24 19C24 14.5817 20.4183 11 16 11ZM16 22C14.3431 22 13 20.6569 13 19C13 17.3431 14.3431 16 16 16C17.6569 16 19 17.3431 19 19C19 20.6569 17.6569 22 16 22Z" 
          fill="#0EA5E9"
        />
        {/* Roof (Emerald Green) */}
        <path 
          d="M3 14.5L16 3.5L29 14.5" 
          stroke="#10B981" 
          strokeWidth="4" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        {/* Chimney */}
        <path 
          d="M23 9.5V4H26V12" 
          stroke="#10B981" 
          strokeWidth="3" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <span style={{ 
          fontFamily: 'var(--font-heading, "Outfit", sans-serif)', 
          fontWeight: 800, 
          fontSize: '1.375rem',
          letterSpacing: '-0.02em',
          color: dark ? '#FFFFFF' : '#0F0D1E',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          Room<span style={{ color: '#10B981' }}>Rent</span>
        </span>
      </div>
    </Link>
  );
}
