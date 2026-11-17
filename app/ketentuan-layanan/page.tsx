"use client";
import React from "react";
import TermsOfService from "./components/TermsOfService";

export default function TermsOfServicePage() {
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
      
      {/* Bagian pembuka halaman portfolio */}
      <TermsOfService />
      
    </main>
  );
}