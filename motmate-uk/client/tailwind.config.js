/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef7ff',
          100: '#d9ecff',
          200: '#bcdeff',
          300: '#8ec9ff',
          400: '#59abff',
          500: '#2e8bff',
          600: '#1a6ef5',
          700: '#1759d9',
          800: '#1949ad',
          900: '#1a3f86',
        },
      },
    },
  },
  plugins: [],
};
