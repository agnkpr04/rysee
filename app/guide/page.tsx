"use client";

import React from 'react';
import GlobalNavbar from '@/components/GlobalNavbar';
import BioGuideSection from '@/components/bio/BioGuideSection';

export default function GuidePage() {
  return (
    <main className="min-h-screen bg-white">
      <GlobalNavbar isSticky={true} />
     
      <div className="max-w-4xl mx-auto px-4 py-12">
        <BioGuideSection accentColor="#3E47A8" />
      </div>
    </main>
  );
}