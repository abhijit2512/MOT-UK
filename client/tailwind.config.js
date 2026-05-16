/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef6ff',
          100: '#d9eaff',
          200: '#bcd9ff',
          300: '#8ebfff',
          400: '#599bff',
          500: '#3478ff',
          600: '#1f59f5',
          700: '#1845d1',
          800: '#1839a4',
          900: '#163382',
        },
      },
    },
  },
  plugins: [],
};
