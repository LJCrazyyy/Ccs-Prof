/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0f766e',
        'primary-dark': '#0b5f59',
        secondary: '#f8fbfa',
        accent: '#0f766e',
        'dark-bg': '#123331',
        'light-text': '#1f2937',
      },
      backgroundImage: {
        'gradient-main': 'linear-gradient(135deg, #f6fbfb 0%, #dbeeea 45%, #e6f3f1 100%)',
      },
    },
  },
  plugins: [],
}