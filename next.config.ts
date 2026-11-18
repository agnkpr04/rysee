/** @type {import('next').NextConfig} */
const nextConfig = {
  // Matikan styledComponents jika hanya pakai Tailwind
  // Saya set ke false sesuai saran komentarmu agar build lebih ringan
  compiler: {
    styledComponents: false, 
  },
  // Konfigurasi ESLint dikelola via eslint.config.mjs
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