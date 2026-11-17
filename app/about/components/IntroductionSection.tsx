"use client";

import { motion } from 'framer-motion';

const accentGradient = "from-[#8B5CF6] via-[#D946EF] to-[#EC4899]";

export default function IntroductionSection() {
  return (
    <section className="max-w-5xl mx-auto px-6 md:px-8 py-12 md:py-16 lg:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-light tracking-tight text-[#18181B] mb-4">
          Apa itu Rysee?
        </h2>
        <div className="w-16 h-0.5 mx-auto mb-6 bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899]"></div>
        <p className="text-sm md:text-base lg:text-lg font-light text-[#A1A1AA] max-w-3xl mx-auto leading-relaxed px-4 md:px-0">
          Rysee menghubungkan affiliator dengan produk berkualitas, menyediakan tools untuk kustomisasi toko, dan membantu Anda membangun bisnis affiliate yang sustainable.
        </p>
      </motion.div>
    </section>
  );
}
