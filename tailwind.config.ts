import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        paper: 'var(--paper)',
        ink: 'var(--ink)',
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        gold: {
          DEFAULT: 'var(--gold)',
          deep: 'var(--gold-deep)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        maroon: 'var(--maroon)',
        palm: 'var(--palm)',
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        title: ['"Marcellus"', 'Georgia', 'serif'],
        sans: ['"Karla"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0) rotate(0)' },
          '50%': { transform: 'translateY(-14px) rotate(1.5deg)' },
        },
        'shimmer-sweep': {
          '0%': { backgroundPosition: '0%' },
          '100%': { backgroundPosition: '200%' },
        },
        'spin-soft': {
          to: { transform: 'rotate(360deg)' },
        },
        'map-pulse': {
          '0%, 100%': { opacity: '0.2', transform: 'translate(-50%, -50%) scale(0.72)' },
          '55%': { opacity: '0.75', transform: 'translate(-50%, -50%) scale(1.25)' },
        },
        'route-draw': {
          '0%': { strokeDashoffset: '520px' },
          '100%': { strokeDashoffset: '0' },
        },
      },
      animation: {
        'float-slow': '7s ease-in-out infinite float-slow',
        'foil': '6s linear infinite shimmer-sweep',
        'spin-soft': '36s linear infinite spin-soft',
        'spin-soft-reverse': '48s linear infinite reverse spin-soft',
        'map-pulse': '2.4s ease-out infinite map-pulse',
      },
    },
  },
  plugins: [],
} satisfies Config;
