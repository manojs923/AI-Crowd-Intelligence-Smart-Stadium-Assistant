/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 24px 80px rgba(2, 6, 23, 0.36)',
        neon: '0 0 0 1px rgba(255,255,255,0.06), 0 18px 50px rgba(34,197,94,0.18)',
      },
      fontFamily: {
        display: ['Teko', 'sans-serif'],
        body: ['Barlow', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
