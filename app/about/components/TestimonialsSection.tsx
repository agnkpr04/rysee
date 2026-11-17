"use client";

import React from 'react';
import { Star, Quote } from 'lucide-react';

const accentGradient = "from-[#8B5CF6] via-[#D946EF] to-[#EC4899]";

const testimonials = [
  {
    name: 'Budi Santoso',
    role: 'Digital Marketer',
    avatar: 'BS',
    rating: 5,
    content: 'Rysee membantu saya memulai bisnis affiliate dengan mudah. Platformnya sangat user-friendly dan supportnya responsif. Sangat recommended untuk pemula!'
  },
  {
    name: 'Siti Rahayu',
    role: 'Content Creator',
    avatar: 'SR',
    rating: 5,
    content: 'Saya sudah coba beberapa platform affiliate, tapi Rysee yang paling lengkap. Katalog produknya berkualitas dan fitur premiumnya sangat membantu meningkatkan penghasilan.'
  },
  {
    name: 'Ahmad Fauzi',
    role: 'Freelancer',
    avatar: 'AF',
    rating: 5,
    content: 'Upgrade ke Pro membership sangat worth it! Marketing assets yang disediakan sangat membantu untuk promosi. Komisinya juga lumayan besar.'
  }
];

export default function TestimonialsSection() {
  return (
    <section className="px-6 md:px-8 py-16 md:py-20 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F9F9FB] rounded-full mb-6">
            <Quote className="w-4 h-4 text-[#8B5CF6]" />
            <span className="text-xs font-medium tracking-wider text-[#8B5CF6]">TESTIMONIALS</span>
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-light tracking-tight text-[#18181B] mb-3">
            Apa Kata Mereka?
          </h2>
          <div className="w-16 h-0.5 mx-auto bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899]"></div>
          <p className="text-sm text-[#A1A1AA] mt-4 max-w-2xl mx-auto">
            Cerita dari affiliate yang sudah merasakan manfaat Rysee
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-[#F9F9FB] rounded-2xl p-4 md:p-6 border border-gray-50 hover:shadow-lg transition-shadow">
              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#8B5CF6] text-[#8B5CF6]" />
                ))}
              </div>

              {/* Content */}
              <p className="text-sm text-[#18181B] leading-relaxed mb-6">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] flex items-center justify-center text-white text-xs font-medium">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="text-xs font-medium text-[#18181B]">{testimonial.name}</p>
                  <p className="text-[10px] text-[#A1A1AA]">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-sm text-[#A1A1AA] mb-4">
            Ingin menjadi bagian dari mereka?
          </p>
          <a
            href="/affstore"
            className="inline-block px-8 py-3 bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white rounded-full text-sm font-medium tracking-wider hover:opacity-90 transition"
          >
            Mulai Sekarang
          </a>
        </div>
      </div>
    </section>
  );
}
