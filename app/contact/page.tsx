// app/portfolio/page.tsx
import React from "react";




import Contact from "./components/Contact";

// Metadata untuk SEO (Sangat disarankan di Next.js)
export const metadata = {
  title: "Rysee — Affiliate Ecosystem",
  description: "Ekosistem afiliasi otomatis dan kurasi produk pilihan oleh Rysee. Temukan inspirasi outfit terbaik dan peluang kolaborasi dalam satu jaringan digital.",
  keywords: ["Rysee", "Affiliate Ecosystem", "Kurasi Produk", "Rysee", "Bisnis Digital"],
  openGraph: {
    title: "Rysee — Affiliate Ecosystem",
    description: "Jelajahi ekosistem kurasi produk premium dan peluang kemitraan afiliasi.",
    url: "https://rysee.link", // Contoh domain untuk ekosistem
    siteName: "Rysee Ecosystem",
    images: [
      {
        url: "/og-ecosystem.jpg", 
        width: 1200,
        height: 630,
        alt: "Rysee Affiliate Ecosystem",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
};

export default function JoinPage() {
  return (
    <main className="bg-[#0A0A0A] min-h-screen">
      
      {/* Panggil Komponen Hero Aura Coffee. 
          Karena ini di dalam folder portfolio, kamu bisa menumpuk 
          section project klien lainnya di bawahnya nanti.
      */}
      <Contact />
  

      {/* Section Project Berikutnya (Contoh) 
          Nanti kamu tinggal buat komponen baru dan panggil di sini
      */}
      {/* <ProjectPadelNow /> */}
      {/* <ProjectTournamentFF /> */}

    </main>
  );
}