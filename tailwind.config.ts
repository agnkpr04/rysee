/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
  "./app/**/*.{js,ts,jsx,tsx,mdx}",
  "./components/**/*.{js,ts,jsx,tsx,mdx}", // Tambahkan ini kalau folder components di luar app
  "./src/**/*.{js,ts,jsx,tsx,mdx}",
],
  theme: {
    extend: {
      colors: {
        dark: "#0D0D0D",
        gold: "#D4AF37",
        bright: "#FFFFFF",
        dim: "rgba(255, 255, 255, 0.4)",
      },
      fontFamily: {
        syne: ["var(--font-syne)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
        cormorant: ["var(--font-cormorant)", "serif"],
      },
      keyframes: {
        lightSweep: {
          '0%': { left: '-50vw', opacity: '0' },
          '15%': { opacity: '0.6' },
          '85%': { opacity: '0.6' },
          '100%': { left: '100vw', opacity: '0' },
        },
      },
      animation: {
        'light-sweep': 'lightSweep 6s cubic-bezier(0.4, 0, 0.2, 1) infinite',
      },
    },
  },
  plugins: [],
}