"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export default function Contact() {
  return (
    <section 
      id="contact" 
      className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden cursor-default antialiased bg-[#1C1C1B] pt-32 md:pt-48 pb-10 px-[6%] md:px-[12%]"
    >
      {/* BACKGROUND DECORATION (Subtle Luxury Glow) */}
      <div className="absolute top-[20%] right-[10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-[#6A5D52]/10 rounded-full blur-[100px] md:blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] left-[-5%] w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-[#6A5D52]/5 rounded-full blur-[80px] md:blur-[100px] pointer-events-none"></div>

      <style dangerouslySetInnerHTML={{ __html: `
        .text-stucco { color: #E2E2DE; }
        .text-walnut { color: #6A5D52; }
        
        /* Glassmorphism Button Style */
        .glass-cta {
          background: rgba(226, 226, 222, 0.03);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(226, 226, 222, 0.1);
          color: #E2E2DE;
          transition: all 0.8s cubic-bezier(0.19, 1, 0.22, 1);
        }
        
        .glass-cta:hover {
          background: rgba(106, 93, 82, 0.15);
          border-color: rgba(106, 93, 82, 0.5);
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }

        @media (min-width: 768px) {
          .cta-big-text {
            line-height: 0.95;
            letter-spacing: -2px;
          }
        }

        .cta-big-text {
          line-height: 1;
          letter-spacing: -1px;
          text-transform: uppercase;
        }
      `}} />

      <div className="relative z-20 w-full max-w-[1800px] flex flex-col h-full flex-grow mx-auto md:mx-0">
        
        {/* HEADER SECTION - REVISED ROLES (INDONESIA) */}
        <div className="flex flex-col items-start mb-16 md:mb-32">
          <div className="flex items-center gap-3 mb-6 md:mb-8">
            <div className="w-8 md:w-10 h-[1px] bg-[#6A5D52]/40"></div>
            <span className="text-[10px] md:text-[12px] font-medium tracking-[3px] md:tracking-[4px] text-[#6A5D52] uppercase">
              Hubungi Kami
            </span>
          </div>
          
          <h2 
            className="text-[clamp(1.5rem,4vw,2.8rem)] text-[#E2E2DE] font-light leading-[1.3] tracking-tight max-w-2xl md:max-w-3xl"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            Siap membangun <span className="text-walnut italic font-normal" style={{ fontFamily: "'Playfair Display', serif" }}>Digital Ecosystem</span> yang mewah atau bergabung sebagai partner resmi? Mari ciptakan standar baru.
          </h2>
        </div>

        {/* BIG CTA TEXT & BUTTON */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 md:gap-16 flex-grow pb-20 md:pb-32">
          
          {/* MAIN HEADING (ENGLISH) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true }}
            className="flex flex-col items-start"
          >
            <h1 className="cta-big-text text-[clamp(2.2rem,9vw,7.5rem)] font-black text-[#E2E2DE]">
              Let’s <span className="text-walnut">Work</span> <br /> Together.
            </h1>
            <div className="mt-6 md:mt-12 flex items-center gap-3">
              <span className="w-6 md:w-8 h-[2px] bg-[#6A5D52]"></span>
              <span className="text-[9px] md:text-[11px] font-bold uppercase tracking-[2px] md:tracking-[3px] text-[#6A5D52]">
                Rysee / Berbasis di Indonesia
              </span>
            </div>
          </motion.div>
          
          {/* BUTTON CTA (Bening/Glass Style) */}
          <div className="flex flex-col items-start md:items-end w-full md:w-auto">
            <motion.a 
              href="https://wa.me/6282218455821"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="glass-cta w-full md:w-auto px-10 py-8 md:px-14 md:py-12 rounded-[30px] md:rounded-[40px] flex flex-col gap-4 group"
            >
              <div className="flex justify-between items-center w-full gap-10">
                <span className="text-[10px] md:text-[12px] font-bold uppercase tracking-[4px] text-[#6A5D52]">
                  Mulai Kolaborasi
                </span>
                <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6 text-[#E2E2DE] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-500" />
              </div>
              <span className="text-[20px] md:text-[32px] font-light text-[#E2E2DE] tracking-tight">
                WhatsApp Admin
              </span>
            </motion.a>
          </div>

        </div>

        {/* MINIMALIST FOOTER */}
        <div className="w-full pt-8 md:pt-10 border-t border-[#6A5D52]/10 mt-auto">
          <div className="flex justify-center md:justify-end items-center text-[#E2E2DE]/30 text-[10px] md:text-[12px] font-light tracking-[2px] uppercase antialiased">
            <p>© 2026 Rysee. All rights reserved.</p>
          </div>
        </div>

      </div>
    </section>
  );
}