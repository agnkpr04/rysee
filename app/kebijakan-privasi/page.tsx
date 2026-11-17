"use client";
import React from "react";

// Pastikan file-file ini ada di folder /about/components/
import PrivacyPolicy from "./components/PrivacyPolicy";

export default function kebijakanprivasiPage() {
  return (
    <main className="relative min-h-screen bg-[#F1F1F1] overflow-hidden antialiased">
      {/* Injeksi Style untuk konsistensi ketipisan font */}
      <style dangerouslySetInnerHTML={{ __html: `
        * {
          font-weight: 300 !important;
        }
        h1, h2, h3, b, strong {
          font-weight: 500 !important; 
        }
      ` }} />

      <PrivacyPolicy />
     
    </main>
  );
}