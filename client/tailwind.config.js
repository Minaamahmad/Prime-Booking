/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          teal: '#0f766e',
          amber: '#f59e0b',
          charcoal: '#374151',
          coral: '#f87171',
        },
      },
      boxShadow: {
        'luxury': '0 10px 25px -3px rgba(15, 118, 110, 0.1), 0 4px 6px -2px rgba(15, 118, 110, 0.05)',
        'card': '0 4px 6px -1px rgba(55, 65, 81, 0.1), 0 2px 4px -1px rgba(55, 65, 81, 0.06)',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
      },
      animation: {
        'slide-in': 'slideIn 0.5s ease-out',
        'fade-in': 'fadeIn 0.3s ease-in',
        'shine': 'shine 1.5s ease-in-out',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shine: {
          '0%': { transform: 'translateX(-100%) skewX(-12deg)' },
          '100%': { transform: 'translateX(200%) skewX(-12deg)' },
        },
      },
    },
  },
  plugins: [],
}