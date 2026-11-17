"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { BookOpen, ArrowLeft, ChevronRight, Menu, X } from 'lucide-react';
import Link from 'next/link';
import GlobalNavbar from '@/components/GlobalNavbar';

const accentGradient = "from-[#8B5CF6] via-[#D946EF] to-[#EC4899]";

interface Topic {
  id: string;
  title: string;
  content: string;
}

const topics: Topic[] = [
  {
    id: 'pengenalan',
    title: 'Pengenalan Platform Rysee',
    content: `## Apa itu Rysee?

Rysee adalah platform affiliate digital yang menghubungkan Anda dengan ratusan produk digital berkualitas. Platform ini memungkinkan Anda untuk:

- Menjual produk digital tanpa perlu stok
- Mendapatkan komisi hingga 80% per penjualan
- Mengakses mentahan konten untuk promosi
- Bergabung dengan komunitas untuk bimbingan

### Keunggulan Rysee

**Tanpa Modal Stok**
- Produk digital siap jual kapan saja
- Tidak perlu investasi dalam inventory
- Risiko kerugian minimal

**Komisi Tinggi**
- Hingga 80% komisi untuk produk digital
- 35% komisi untuk jasa website
- Transparansi dalam pembagian komisi

**Dukungan Penuh**
- Mentahan konten siap pakai
- Bimbingan dari komunitas
- Update materi berkala`
  },
  {
    id: 'memahami-produk',
    title: 'Memahami Produk Digital',
    content: `## Jenis Produk Digital di Rysee

**Produk Digital**
- E-book dan panduan
- Template dan desain
- Software dan tools
- Kursus online
- Audio dan video

**Jasa Website**
- Website development
- Landing page
- E-commerce
- Custom web apps

### Mengapa Produk Digital?

**Keuntungan Bisnis Produk Digital:**
- Tidak perlu stok fisik
- Bisa dijual berulang kali
- Margin keuntungan tinggi
- Bisa dijual secara global
- Tidak ada biaya pengiriman

**Tantangan Umum:**
- Persaingan yang tinggi
- Perlu marketing yang efektif
- Perlu membangun kepercayaan
- Perlu update konten berkala`
  },
  {
    id: 'memulai-bisnis',
    title: 'Memulai Bisnis Digital',
    content: `## Langkah 1: Daftar dan Setup

1. **Buat Akun Rysee**
   - Daftar di platform Rysee
   - Lengkapi profil Anda
   - Verifikasi email dan nomor telepon

2. **Pahami Dashboard**
   - Eksplorasi fitur-fitur yang tersedia
   - Pelajari cara menambahkan produk ke toko
   - Pahami sistem komisi dan penarikan

3. **Pilih Tier Membership**
   - Free: Mulai tanpa biaya
   - Premium: Akses penuh ke semua fitur dan mentahan

### Langkah 2: Tentukan Niche

**Pertimbangan dalam Memilih Niche:**
- Minat dan pengetahuan Anda
- Permintaan pasar
- Tingkat persaingan
- Potensi pendapatan

**Niche Populer:**
- Bisnis dan entrepreneurship
- Kesehatan dan kebugaran
- Pendidikan dan self-development
- Teknologi dan software
- Finance dan investasi

### Langkah 3: Target Audience

**Definisikan Target Anda:**
- Usia dan gender
- Pekerjaan dan pendapatan
- Minat dan hobi
- Masalah yang ingin diselesaikan
- Platform sosial media yang digunakan`
  },
  {
    id: 'memilih-produk',
    title: 'Memilih Produk yang Tepat',
    content: `## Kriteria Produk yang Baik

**1. Relevan dengan Target Audience**
- Sesuai dengan minat dan kebutuhan audience
- Menyelesaikan masalah spesifik
- Mudah dipahami dan digunakan

**2. Kualitas yang Terjamin**
- Review positif dari pembeli sebelumnya
- Dibuat oleh creator yang kredibel
- Update berkala

**3. Margin Komisi yang Menarik**
- Komisi minimal 50%
- Harga jual yang kompetitif
- Potensi upsell dan cross-sell

**4. Permintaan Pasar**
- Volume pencarian yang tinggi
- Tren yang sedang naik
- Review dan testimoni yang baik

### Cara Meneliti Produk

**1. Analisis Data Rysee**
- Lihat produk terlaris
- Perhatikan rating dan review
- Cek komisi yang ditawarkan

**2. Riset Eksternal**
- Google Trends untuk tren pencarian
- Social media untuk diskusi produk
- Forum dan komunitas online

**3. Uji Pasar Kecil**
- Mulai dengan 2-3 produk
- Test di platform sosial media
- Analisis respon dan konversi`
  },
  {
    id: 'mengatur-toko',
    title: 'Mengatur Toko Anda',
    content: `## Customisasi Profil

**1. Profil yang Profesional**
- Foto profil yang jelas
- Bio yang informatif
- Link ke sosial media

**2. Branding Konsisten**
- Nama toko yang mudah diingat
- Logo jika memungkinkan
- Warna dan gaya visual yang konsisten

### Menambahkan Produk

**1. Pilih Produk dari Katalog**
- Browse katalog Rysee
- Filter berdasarkan kategori dan komisi
- Baca deskripsi dan review produk

**2. Organisasi Produk**
- Kelompokkan berdasarkan kategori
- Urutkan berdasarkan popularitas atau komisi
- Highlight produk terbaik

**3. Deskripsi Produk**
- Tulis deskripsi yang menarik
- Fokus pada benefit, bukan fitur
- Gunakan testimonial jika ada`
  },
  {
    id: 'strategi-pemasaran',
    title: 'Strategi Pemasaran',
    content: `## Strategi Konten

**1. Edukasi**
- Bagikan tips dan trik terkait produk
- Buat tutorial cara menggunakan produk
- Share studi kasus dan success story

**2. Storytelling**
- Ceritakan pengalaman pribadi
- Share testimoni pelanggan
- Buat narasi yang menginspirasi

**3. Konsistensi**
- Posting secara teratur
- Jadwal konten yang konsisten
- Maintain kualitas konten

### Strategi Sosial Media

**1. Pilih Platform yang Tepat**
- Instagram: Visual dan lifestyle
- TikTok: Short-form video
- YouTube: Tutorial dan review
- Facebook: Komunitas dan grup
- Twitter/X: Update cepat dan networking

**2. Konten yang Efektif**
- Before/after transformation
- Tutorial step-by-step
- Q&A dan FAQ
- Behind the scenes
- User-generated content

**3. Engagement**
- Respon komentar dan DM
- Buat konten interaktif
- Host live session
- Kolaborasi dengan creator lain

### Strategi Email Marketing

**1. Build Email List**
- Tawarkan lead magnet gratis
- Opt-in form di bio dan website
- Follow-up sequence otomatis

**2. Email Campaigns**
- Welcome series untuk subscriber baru
- Product launch announcements
- Educational content berkala
- Special offers dan promotions`
  },
  {
    id: 'copywriting',
    title: 'Copywriting untuk Produk',
    content: `## Prinsip Copywriting yang Efektif

**1. Fokus pada Benefit**
- Jelaskan apa yang didapat pelanggan
- Bagaimana produk mengubah hidup mereka
- Hasil konkret yang bisa dicapai

**2. Emotional Connection**
- Pahami pain point audience
- Tawarkan solusi yang empatik
- Gunakan bahasa yang relatable

**3. Call to Action yang Jelas**
- Instruksi yang spesifik
- Urgency yang wajar
- Benefit tambahan untuk tindakan segera

### Struktur Copy yang Baik

**1. Hook yang Menarik**
- Pertanyaan yang memancing
- Statistik yang mengejutkan
- Story yang engaging
- Problem statement

**2. Body yang Informatif**
- Eksplainasi solusi
- Benefit utama
- Social proof
- Addressing objections

**3. Closing yang Kuat**
- Reiterate benefit utama
- Final CTA
- Guarantee jika ada
- Scarcity element

### Contoh Copy Template

**Template 1: Problem-Solution**
\`\`\`
Apakah Anda [problem]?
[Describe pain point]

[Product name] adalah solusinya.
[Benefit 1]
[Benefit 2]
[Benefit 3]

Dapatkan sekarang dan [immediate benefit]
[CTA]
\`\`\`

**Template 2: Story-Based**
\`\`\`
Saya dulu [situation]...
[Describe struggle]

Hingga saya menemukan [product].
[Describe transformation]

Sekarang [result]
[CTA]
\`\`\``
  },
  {
    id: 'promosi-sosmed',
    title: 'Promosi di Sosial Media',
    content: `## Instagram Marketing

**1. Feed Posts**
- High-quality visuals
- Caption yang engaging
- Hashtag yang relevan
- Posting schedule yang konsisten

**2. Stories**
- Behind the scenes
- Product demos
- Q&A sessions
- Polls dan quizzes

**3. Reels**
- Tutorial singkat
- Before/after
- Tips dan tricks
- Trending audio

### TikTok Marketing

**1. Content Types**
- Educational content
- Entertainment
- Behind the scenes
- User testimonials

**2. Best Practices**
- Hook dalam 3 detik pertama
- Keep it short and punchy
- Use trending sounds
- Consistent posting

### YouTube Marketing

**1. Video Types**
- Product reviews
- Tutorial lengkap
- Case studies
- Q&A sessions

**2. SEO**
- Keyword research
- Optimasi title dan description
- Thumbnail yang menarik
- Engagement dengan komentar`
  },
  {
    id: 'layanan-pelanggan',
    title: 'Layanan Pelanggan',
    content: `## Pentingnya Customer Service

**1. Build Trust**
- Respon cepat meningkatkan kepercayaan
- Service yang baik menghasilkan repeat purchase
- Word of mouth marketing

**2. Handle Complaints**
- Empati dan understanding
- Solusi yang konkret
- Follow-up untuk memastikan kepuasan

### Best Practices

**1. Response Time**
- Balas dalam 24 jam
- Auto-responder untuk informasi umum
- Live chat jika memungkinkan

**2. Personalization**
- Gunakan nama pelanggan
- Reference purchase history
- Custom recommendations

**3. Proactive Communication**
- Update order status
- Notify tentang promo baru
- Follow-up setelah purchase`
  },
  {
    id: 'mengembangkan-bisnis',
    title: 'Mengembangkan Bisnis',
    content: `## Scaling Strategies

**1. Diversifikasi Produk**
- Tambah produk dalam niche yang sama
- Expand ke niche terkait
- Cross-sell dan upsell

**2. Automasi**
- Email marketing automation
- Social media scheduling
- Customer service automation

**3. Team Building**
- Hire untuk task repetitive
- Outsource specialized work
- Build affiliate team

### Analytics dan Optimization

**1. Track KPIs**
- Conversion rate
- Average order value
- Customer lifetime value
- Return on ad spend

**2. A/B Testing**
- Test different headlines
- Test different CTAs
- Test different visuals
- Test different offers

**3. Continuous Improvement**
- Review performance weekly
- Adjust strategy based on data
- Stay updated dengan trends`
  },
  {
    id: 'tips-best-practices',
    title: 'Tips dan Best Practices',
    content: `## Productivity Tips

**1. Time Management**
- Block time untuk specific tasks
- Prioritize high-impact activities
- Use productivity tools

**2. Content Calendar**
- Plan content in advance
- Batch create content
- Maintain consistency

**3. Work-Life Balance**
- Set working hours
- Take regular breaks
- Avoid burnout

### Mindset Tips

**1. Growth Mindset**
- View failures as learning
- Embrace challenges
- Continuous learning

**2. Patience and Persistence**
- Success takes time
- Consistency is key
- Don't give up easily

**3. Networking**
- Connect with other sellers
- Learn from successful people
- Share knowledge dan experiences`
  },
  {
    id: 'kesalahan-umum',
    title: 'Kesalahan Umum yang Harus Dihindari',
    content: `## Kesalahan Marketing

**1. Fokus pada Fitur, bukan Benefit**
- Salah: "Produk ini punya 10 fitur"
- Benar: "Produk ini akan menghemat 5 jam waktu Anda setiap minggu"

**2. Tidak Memahami Target Audience**
- Marketing ke semua orang = marketing ke tidak ada
- Spesifik lebih baik daripada general

**3. Inconsistency**
- Posting sporadically
- Tidak maintain brand voice
- Tidak follow up dengan leads

### Kesalahan Operasional

**1. Overcommitting**
- Menjanjikan lebih dari yang bisa diberikan
- Tidak setting expectation yang realistis

**2. Poor Customer Service**
- Slow response time
- Tidak addressing complaints
- Tidak following up

**3. Not Tracking Data**
- Tidak tahu apa yang works
- Tidak bisa optimize
- Flying blind

### Kesalahan Finansial

**1. Spending Too Much on Ads**
- Test organik dulu
- Start small, scale gradually
- Monitor ROI

**2. Not Reinvesting**
- Gunakan profit untuk growth
- Invest dalam tools dan education
- Build sustainable business`
  },
  {
    id: 'kesimpulan',
    title: 'Kesimpulan',
    content: `## Kesimpulan

Jualan produk digital di platform Rysee adalah peluang bisnis yang menjanjikan dengan modal minimal. Dengan strategi yang tepat, konsistensi, dan continuous learning, Anda bisa membangun bisnis digital yang sukses dan sustainable.

**Key Takeaways:**
- Pilih produk yang relevan dengan target audience
- Fokus pada benefit, bukan fitur
- Konsisten dalam konten dan engagement
- Berikan customer service yang excellent
- Track data dan optimize continuously
- Bersabar dan terus belajar

**Next Steps:**
1. Daftar di platform Rysee
2. Pilih niche dan target audience
3. Browse dan pilih produk yang tepat
4. Setup toko dan profil
5. Buat konten marketing strategy
6. Start promoting dan selling
7. Track performance dan optimize
8. Scale dan diversify

**Resources Tambahan:**
- Komunitas Rysee untuk bimbingan
- Mentahan konten di Konten Kit
- Tips dan trik di grup eksklusif
- Update materi berkala

---

## Disclaimer

Panduan ini dibuat untuk tujuan edukasi. Hasil yang dicapai dapat bervariasi tergantung pada berbagai faktor termasuk effort, strategi, dan kondisi pasar. Selalu lakukan riset dan adaptasi strategi sesuai dengan situasi Anda.

---

**Versi:** 1.0  
**Tanggal:** Juni 2026  
**Platform:** Rysee`
  }
];

function PanduanProdukDigitalContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedTopic, setSelectedTopic] = useState<string>('pengenalan');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const referrer = searchParams.get('referrer');

  const selectedTopicData = topics.find(t => t.id === selectedTopic);

  const formatContent = (content: string) => {
    return content.split('\n').map((line, index) => {
      if (line.startsWith('## ')) {
        return <h2 key={index} className="text-2xl font-bold text-[#18181B] mt-8 mb-4">{line.replace('## ', '')}</h2>;
      } else if (line.startsWith('### ')) {
        return <h3 key={index} className="text-xl font-semibold text-[#18181B] mt-6 mb-3">{line.replace('### ', '')}</h3>;
      } else if (line.startsWith('**') && line.endsWith('**')) {
        return <h4 key={index} className="text-lg font-semibold text-[#8B5CF6] mt-4 mb-2">{line.replace(/\*\*/g, '')}</h4>;
      } else if (line.startsWith('- ')) {
        return <li key={index} className="text-sm text-[#71717A] ml-4 mb-1">{line.replace('- ', '')}</li>;
      } else if (line.startsWith('**') && line.includes(':')) {
        return <p key={index} className="text-sm font-semibold text-[#18181B] mt-3 mb-1">{line}</p>;
      } else if (line.trim() === '') {
        return <div key={index} className="h-4" />;
      } else if (line.startsWith('```')) {
        return null;
      } else if (line.includes('**') && line.includes('*')) {
        return <p key={index} className="text-sm text-[#71717A] mb-2">{line}</p>;
      } else if (line.match(/^\d+\./)) {
        return <li key={index} className="text-sm text-[#71717A] ml-4 mb-1">{line}</li>;
      } else {
        return <p key={index} className="text-sm text-[#71717A] mb-2 leading-relaxed">{line}</p>;
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#F9F9FB]">
      <GlobalNavbar />

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Back Button */}
        <button
          onClick={() => {
            if (referrer) {
              router.push(referrer);
            } else {
              router.back();
            }
          }}
          className="inline-flex items-center gap-2 text-sm text-[#A1A1AA] hover:text-[#18181B] mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
          Kembali
        </button>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#8B5CF6]/10 to-[#D946EF]/10 rounded-full mb-4">
            <BookOpen className="w-4 h-4 text-[#8B5CF6]" strokeWidth={1.5} />
            <span className="text-xs font-medium text-[#8B5CF6]">E-BOOK</span>
          </div>
          <h1 className="text-4xl font-light tracking-tight text-[#18181B] mb-3">
            Panduan Jualan Produk Digital
          </h1>
          <p className="text-[#A1A1AA] max-w-2xl mx-auto">
            Pelajari strategi dan tips jualan produk digital di platform Rysee untuk membangun bisnis yang sukses.
          </p>
        </div>

        {/* Topic Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {topics.map((topic) => (
              <button
                key={topic.id}
                onClick={() => setSelectedTopic(topic.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedTopic === topic.id
                    ? 'bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white shadow-sm'
                    : 'bg-white border border-gray-100 text-[#A1A1AA] hover:text-[#18181B]'
                }`}
              >
                {topic.title}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl border border-gray-50 p-8 shadow-sm">
          <div className="prose prose-sm max-w-none">
            {selectedTopicData && formatContent(selectedTopicData.content)}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={() => {
              const currentIndex = topics.findIndex(t => t.id === selectedTopic);
              if (currentIndex > 0) {
                setSelectedTopic(topics[currentIndex - 1].id);
              }
            }}
            disabled={topics.findIndex(t => t.id === selectedTopic) === 0}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-xl text-sm font-medium text-[#18181B] hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
            Topik Sebelumnya
          </button>
          <button
            onClick={() => {
              const currentIndex = topics.findIndex(t => t.id === selectedTopic);
              if (currentIndex < topics.length - 1) {
                setSelectedTopic(topics[currentIndex + 1].id);
              }
            }}
            disabled={topics.findIndex(t => t.id === selectedTopic) === topics.length - 1}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white rounded-xl text-sm font-medium hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Topik Berikutnya
            <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>
      </main>
    </div>
  );
}

export default function PanduanProdukDigitalPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F9F9FB] flex items-center justify-center">
      <div className="text-sm text-[#A1A1AA]">Loading...</div>
    </div>}>
      <PanduanProdukDigitalContent />
    </Suspense>
  );
}
