"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useEffect } from 'react';

const accentGradient = "from-[#8B5CF6] via-[#D946EF] to-[#EC4899]";

export default function HeroSection() {
  useEffect(() => {
    // Check if user came from referral link
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    
    if (refCode) {
      // Auto-scroll to pricing section after a short delay
      setTimeout(() => {
        const pricingSection = document.getElementById('pricing');
        if (pricingSection) {
          pricingSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
    }
  }, []);

  return (
    <section className="relative max-w-6xl mx-auto min-h-[40vh] md:min-h-[50vh] px-6 md:px-8 py-16 md:py-32 overflow-hidden flex items-center justify-center pt-12 md:pt-24">
      {/* Animated Accent Lines */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Top Left */}
        <motion.div
          className="absolute top-8 left-8 w-32 md:w-48 h-32 md:h-48 border-t border-l border-purple-500 opacity-70"
          style={{
            maskImage: "linear-gradient(to bottom right, transparent, black 20%, black 80%, transparent)",
            WebkitMaskImage: "linear-gradient(to bottom right, transparent, black 20%, black 80%, transparent)",
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.7, 0.9, 0.7],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Top Right */}
        <motion.div
          className="absolute top-8 right-8 w-32 md:w-48 h-32 md:h-48 border-t border-r border-pink-500 opacity-70"
          style={{
            maskImage: "linear-gradient(to bottom left, transparent, black 20%, black 80%, transparent)",
            WebkitMaskImage: "linear-gradient(to bottom left, transparent, black 20%, black 80%, transparent)",
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.7, 0.9, 0.7],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Bottom Left */}
        <motion.div
          className="absolute bottom-8 left-8 w-32 md:w-48 h-32 md:h-48 border-b border-l border-orange-500 opacity-70"
          style={{
            maskImage: "linear-gradient(to top right, transparent, black 20%, black 80%, transparent)",
            WebkitMaskImage: "linear-gradient(to top right, transparent, black 20%, black 80%, transparent)",
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.7, 0.9, 0.7],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Bottom Right */}
        <motion.div
          className="absolute bottom-8 right-8 w-32 md:w-48 h-32 md:h-48 border-b border-r border-purple-400 opacity-70"
          style={{
            maskImage: "linear-gradient(to top left, transparent, black 20%, black 80%, transparent)",
            WebkitMaskImage: "linear-gradient(to top left, transparent, black 20%, black 80%, transparent)",
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.7, 0.9, 0.7],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center relative z-10 max-w-6xl mx-auto"
      >
        <h1 className="text-3xl md:text-4xl lg:text-6xl font-light tracking-tight text-[#18181B] mb-6 px-4">
          Bangun Bisnis Affiliate dengan Lebih Mudah
        </h1>
        <p className="text-base md:text-lg lg:text-xl font-light text-[#A1A1AA] max-w-3xl mx-auto leading-relaxed mb-8 md:mb-10 px-4">
          Pilih produk dari katalog lengkap, buat toko custom Anda sendiri, dan mulai menghasilkan dengan cara yang lebih profesional.
        </p>
        <div className="px-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/affstore"
            className={`inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r ${accentGradient} text-white rounded-full text-xs md:text-sm font-light tracking-wider hover:opacity-90 transition-all shadow-lg hover:shadow-xl`}
          >
            Jelajahi Produk
            <ArrowRight className="w-4 h-4" strokeWidth={2} />
          </Link>
          <Link
            href="/guide"
            className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 border-2 border-[#8B5CF6] text-[#8B5CF6] rounded-full text-xs md:text-sm font-light tracking-wider hover:bg-[#8B5CF6] hover:text-white transition-all"
          >
            Program Referral
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
