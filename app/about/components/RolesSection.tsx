"use client";

import { motion } from 'framer-motion';
import { Shield, User, ShoppingBag } from 'lucide-react';

export default function RolesSection() {
  const roles = [
    {
      icon: User,
      title: "Affiliator (User)",
      access: "Dashboard User",
      capabilities: [
        "Pilih produk dari katalog master",
        "Buat & kustomisasi toko affiliate",
        "Kelola produk di toko",
        "Download konten aset (keuntungan membership)"
      ]
    },
    {
      icon: ShoppingBag,
      title: "Customer/Pengunjung",
      access: "Store Viewer",
      capabilities: [
        "Browse produk di toko affiliate",
        "Klik link affiliate untuk belanja",
        "Redirect ke Shopee/TikTok",
        "Lihat leaderboard top affiliator"
      ]
    }
  ];

  return (
    <section className="max-w-5xl mx-auto px-6 md:px-8 py-12 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-xl md:text-2xl lg:text-3xl font-light tracking-tight text-[#18181B] mb-3">
          Peran Pengguna
        </h2>
        <div className="w-12 h-0.5 mx-auto bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899]"></div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {roles.map((role, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="bg-white border border-gray-50 rounded-2xl p-4 md:p-6 shadow-sm"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] flex items-center justify-center mb-4">
              <role.icon className="w-6 h-6 text-white" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-medium text-[#18181B] mb-2">{role.title}</h3>
            <p className="text-xs font-light text-[#A1A1AA] mb-4">{role.access}</p>
            <div className="border-t border-gray-50 pt-4">
              <p className="text-xs font-medium text-[#18181B] mb-3">Kemampuan:</p>
              <ul className="space-y-2">
                {role.capabilities.map((capability, capIndex) => (
                  <li key={capIndex} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] mt-1.5 flex-shrink-0"></span>
                    <span className="text-xs font-light text-[#A1A1AA]">{capability}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
