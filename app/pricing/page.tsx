import GlobalNavbar from '@/components/GlobalNavbar';
import Footer from '@/components/Footer';
import PricingTiers from './components/PricingTiers';

export const metadata = {
  title: 'Pricing | Rysee - Pilih Paket Membership Anda',
  description: 'Free, atau Premium Rp59.000. Sekali bayar, akses selamanya. Komisi referral Rp50.000 per upgrade.',
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#F9F9FB] font-sans text-[#18181B] antialiased">
      <GlobalNavbar isSticky={true} />

      {/* Hero Section */}
      <section className="w-full px-6 md:px-8 pt-12 pb-8 md:pt-16 md:pb-12 bg-gradient-to-br from-[#8B5CF6]/5 via-[#D946EF]/5 to-[#FBBF24]/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#8B5CF6]/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-[#D946EF]/10 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-1.5 mb-5 border border-[#8B5CF6]/10">
            <span className="text-[11px] font-medium text-[#8B5CF6] tracking-wider uppercase">Sekali Bayar • Akses Selamanya</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-light text-[#18181B] mb-4 tracking-tight">
            Upgrade ke{' '}
            <span className="bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899] bg-clip-text text-transparent font-medium">
              Premium
            </span>
          </h1>
          <p className="text-sm md:text-base text-[#71717A] font-light max-w-2xl mx-auto leading-relaxed">
            Akses Produk Digital siap jual dengan komisi 80% & Website Templates 35%<br />
            Komisi referral 85%{' '}
            <span className="font-semibold text-[#18181B]">Rp 50.000</span> per upgrade.
          </p>
        </div>
      </section>

      {/* Pricing Tiers + Referral Matrix + FAQ */}
      <PricingTiers />

      <Footer />
    </div>
  );
}
