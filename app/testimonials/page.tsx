"use client";

import React, { useState } from 'react';
import GlobalNavbar from '@/components/GlobalNavbar';
import HeroSection from './components/hero';
import StatsSection from './components/stats';
import HowItWorks from './components/how';
import ProofGallery from './components/proof';
import FinalCTA from './components/cta';
import FeaturesSection from './components/features';

/**
 * Rysee Testimonials Page
 * Struktur: Luxury Minimalist & Editorial Style
 */
export default function TestimonialsPage() {
  const [activeContext, setActiveContext] = useState<'affiliate' | 'referral'>('affiliate');

  return (
    <main className="min-h-screen bg-[#18181B]">
      <GlobalNavbar isSticky={true} />
      {/* Section 1: Hero */}
      <HeroSection activeContext={activeContext} setActiveContext={setActiveContext} />
      <StatsSection activeContext={activeContext} />
      <HowItWorks activeContext={activeContext} />
      <FeaturesSection activeContext={activeContext} />
      <ProofGallery activeContext={activeContext} setActiveContext={setActiveContext} />
      <FinalCTA activeContext={activeContext} />

      {/* Section selanjutnya (Stats, Grid Testimonial, dll) akan di-summon di sini */}
      
      {/* TIPS: Nanti setiap section baru kita buat filenya di folder components, 
        lalu tinggal tumpuk di bawah <HeroSection /> ini.
      */}
    </main>
  );
}