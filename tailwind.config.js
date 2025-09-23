/** @type {import('tailwindcss').Config} */
import PrimeUI from 'tailwindcss-primeui';

export default {
  darkMode: 'media',
  content: ['./src/**/*.{html,ts}'],
  plugins: [PrimeUI],
  theme: {
    screens: {
      sm: '576px',
      md: '768px',
      lg: '992px',
      xl: '1200px',
      '2xl': '1920px'
    },
    extend: {
      colors: {
        ruziblue: "#253b63"
      }
    }
  }
};

