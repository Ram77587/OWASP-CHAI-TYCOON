/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        chai: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        terracotta: {
          500: '#c2410c',
          600: '#9a3412',
          700: '#7c2d12',
        },
        brass: {
          400: '#d4af37',
          500: '#aa8c2c',
          600: '#856d22',
        }
      },
      animation: {
        'bubble': 'bubble 1.5s infinite ease-in-out',
        'steam': 'steam 2s infinite ease-out',
        'bounce-short': 'bounceShort 0.5s ease-in-out',
      },
      keyframes: {
        bubble: {
          '0%, 100%': { transform: 'translateY(0) scale(1)', opacity: '0.7' },
          '50%': { transform: 'translateY(-6px) scale(1.15)', opacity: '1' },
        },
        steam: {
          '0%': { transform: 'translateY(0) scaleX(0.8)', opacity: '0.8' },
          '100%': { transform: 'translateY(-24px) scaleX(1.3)', opacity: '0' },
        },
        bounceShort: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' }
        }
      }
    },
  },
  plugins: [],
}
