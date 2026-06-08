/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff1f1',
          100: '#ffe4e4',
          200: '#ffc9c9',
          300: '#ffa0a0',
          400: '#f96060',
          500: '#C1121F',
          600: '#a00e19',
          700: '#8B0000',
          800: '#720000',
          900: '#5e0000',
          950: '#3d0000',
        },
        crimson: {
          50: '#fff1f1',
          100: '#ffe1e1',
          200: '#ffc8c8',
          300: '#ffa0a0',
          400: '#ff6868',
          500: '#f83b3b',
          600: '#e51b1b',
          700: '#c11212',
          800: '#8B1A1A',
          900: '#7a1616',
        },
        noir: {
          50: '#f6f6f6',
          100: '#e7e7e7',
          200: '#d1d1d1',
          300: '#b0b0b0',
          400: '#888888',
          500: '#6d6d6d',
          600: '#5d5d5d',
          700: '#4f4f4f',
          800: '#454545',
          900: '#3d3d3d',
          950: '#0A0A0A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        'brand': '0 4px 24px rgba(193, 18, 31, 0.25)',
        'brand-lg': '0 8px 40px rgba(193, 18, 31, 0.35)',
        'card': '0 2px 20px rgba(0,0,0,0.08)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.14)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'pulse-brand': 'pulseBrand 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseBrand: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(193, 18, 31, 0.4)' },
          '50%': { boxShadow: '0 0 0 10px rgba(193, 18, 31, 0)' },
        },
      },
    },
  },
  plugins: [],
};
