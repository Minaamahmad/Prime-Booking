/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cultural Fusion Color Palette
        // Pakistani Jade - Primary
        jade: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
        },
        // Terracotta - Secondary
        terracotta: {
          50: '#FEF3F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
        },
        // Sand - Cultural Neutrals
        sand: {
          50: '#FFFBF5',
          100: '#FEF3E2',
          200: '#FDE8D4',
          300: '#FBD5A5',
          400: '#F8B849',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
        // Stone - Deep Neutrals
        stone: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#44403C',
          800: '#1E293B',
          900: '#1C1917',
        },
        // Saffron - Cultural Accent
        saffron: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
        // Cultural Cream
        cream: {
          50: '#FFFAF5',
          100: '#FFF7ED',
          200: '#FEEDD7',
          300: '#FED7AA',
          400: '#FDBA74',
          500: '#FB923C',
          600: '#F97316',
          700: '#EA580C',
          800: '#C2410C',
          900: '#9A3412',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Tajawal', 'system-ui', 'sans-serif'],
        display: ['Tajawal', 'Inter Display', 'system-ui', 'sans-serif'],
        cultural: ['Tajawal', 'Noto Sans Arabic', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'cultural': '0 20px 25px -5px rgba(34, 197, 94, 0.1), 0 10px 10px -5px rgba(34, 197, 94, 0.04)',
        'jali': '0 0 0 1px rgba(34, 197, 94, 0.05), 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'arch': '0 25px 50px -12px rgba(245, 158, 11, 0.25)',
        'terracotta': '0 10px 15px -3px rgba(239, 68, 68, 0.1), 0 4px 6px -2px rgba(239, 68, 68, 0.05)',
        'sand': '0 4px 6px -1px rgba(245, 158, 11, 0.1), 0 2px 4px -1px rgba(245, 158, 11, 0.06)',
      },
      borderRadius: {
        'arch': '2rem 2rem 0.5rem 0.5rem', // Mughal arch shape
        'arch-top': '2rem 2rem 0 0',
        'arch-bottom': '0 0 2rem 2rem',
        'cultural': '1.5rem',
        'jali': '0.25rem',
      },
      backdropBlur: {
        'cultural': '8px',
      },
      animation: {
        'cultural-reveal': 'culturalReveal 0.8s ease-out',
        'jali-pattern': 'jaliPattern 3s ease-in-out infinite',
        'arch-elevate': 'archElevate 0.4s ease-out',
        'cultural-shimmer': 'culturalShimmer 2s linear infinite',
        'pattern-fade': 'patternFade 0.6s ease-out',
      },
      keyframes: {
        culturalReveal: {
          '0%': { 
            opacity: '0',
            transform: 'scale(0.95) translateY(20px)',
            clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)'
          },
          '50%': {
            opacity: '0.5',
            clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)'
          },
          '100%': { 
            opacity: '1',
            transform: 'scale(1) translateY(0)',
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
          },
        },
        jaliPattern: {
          '0%, 100%': { 
            backgroundPosition: '0% 50%',
            opacity: '0.1'
          },
          '50%': { 
            backgroundPosition: '100% 50%',
            opacity: '0.2'
          },
        },
        archElevate: {
          '0%': { transform: 'translateY(0px)' },
          '100%': { transform: 'translateY(-8px)' },
        },
        culturalShimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        patternFade: {
          '0%': { 
            opacity: '0',
            backgroundSize: '200% 200%',
            backgroundPosition: '100% 0'
          },
          '100%': { 
            opacity: '1',
            backgroundSize: '100% 100%',
            backgroundPosition: '0% 0'
          },
        },
      },
      transitionTimingFunction: {
        'cultural': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'arch': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
      },
      backgroundImage: {
        'jali-pattern': `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2316A34A' fill-opacity='0.1'%3E%3Cpath d='M0 0h40v40H0z'/%3E%3Cpath d='M20 0v40M0 20h40' stroke='%2316A34A' stroke-width='0.5'/%3E%3C/g%3E%3C/svg%3E")`,
        'geometric-pattern': `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23F59E0B' fill-opacity='0.05'%3E%3Cpath d='M30 0L60 30 30 60 0 30z'/%3E%3Cpath d='M30 0L60 30 30 60 0 30z' transform='rotate(45 30 30)'/%3E%3C/g%3E%3C/svg%3E")`,
        'cultural-gradient': 'linear-gradient(135deg, #F0FDF4 0%, #FEF3E2 50%, #FFFAF5 100%)',
      },
    },
  },
  plugins: [],
}