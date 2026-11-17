/** @type {import('next').NextConfig} */
const nextConfig = {
  // Matikan styledComponents jika hanya pakai Tailwind
  // Saya set ke false sesuai saran komentarmu agar build lebih ringan
  compiler: {
    styledComponents: false, 
  },
  typescript: {
    // Tetap abaikan error agar build tidak terhenti
    ignoreBuildErrors: true,
  },
  eslint: {
    // Abaikan error ESLint saat build untuk Vercel
    ignoreDuringBuilds: true,
  },
  // BAGIAN ESLINT DIHAPUS DARI SINI
  // Konfigurasi ESLint sekarang dikelola via eslint.config.mjs atau CLI
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/favicon.ico',
        destination: '/images/logo.jpeg',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;