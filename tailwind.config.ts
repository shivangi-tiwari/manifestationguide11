import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cream page background
        cream: {
          DEFAULT: '#FFF5D6',
          dark: '#1A1A1A',
        },
        // Sage section background (alternating with butter)
        sage: {
          DEFAULT: '#CFE0D0',
          dark: '#2D3A2F',
        },
        // Butter yellow section background
        butter: {
          DEFAULT: '#FBD86B',
          dark: '#3D3820',
        },
        // Olive text color
        olive: {
          DEFAULT: '#5C6B4B',
          dark: '#E8E8D0',
        },
        // Brown accents/buttons
        brown: {
          DEFAULT: '#8A4B1F',
          dark: '#C47A3A',
        },
        // Semantic aliases
        background: {
          DEFAULT: '#FFF5D6',
          dark: '#1A1A1A',
        },
        foreground: {
          DEFAULT: '#5C6B4B',
          dark: '#E8E8D0',
        },
        muted: {
          DEFAULT: '#8A7A6B',
          dark: '#A8A090',
        },
        accent: {
          DEFAULT: '#8A4B1F',
          foreground: '#FFF5D6',
        },
        'accent-secondary': {
          DEFAULT: '#5C6B4B',
          foreground: '#FFF5D6',
        },
        border: {
          DEFAULT: '#D4C4A8',
          dark: '#3D3528',
        },
        ring: {
          DEFAULT: '#8A4B1F',
        },
      },
      fontFamily: {
        display: ['var(--font-cormorant)', 'Georgia', 'serif'],
        body: ['var(--font-arimo)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-arimo)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['clamp(3rem, 8vw, 5.5rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg': ['clamp(2.5rem, 6vw, 4rem)', { lineHeight: '1.15', letterSpacing: '-0.015em' }],
        'display-md': ['clamp(2rem, 4.5vw, 3rem)', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'display-sm': ['clamp(1.75rem, 3.5vw, 2.25rem)', { lineHeight: '1.25', letterSpacing: '-0.005em' }],
        'heading-xl': ['clamp(1.5rem, 3vw, 2rem)', { lineHeight: '1.3' }],
        'heading-lg': ['clamp(1.25rem, 2.5vw, 1.5rem)', { lineHeight: '1.35' }],
        'heading-md': ['clamp(1.125rem, 2vw, 1.25rem)', { lineHeight: '1.4' }],
        'body-lg': ['1.125rem', { lineHeight: '1.7' }],
        'body': ['1rem', { lineHeight: '1.7' }],
        'body-sm': ['0.875rem', { lineHeight: '1.6' }],
        'caption': ['0.75rem', { lineHeight: '1.5' }],
      },
      spacing: {
        'space-3xs': '0.125rem',
        'space-2xs': '0.25rem',
        'space-xs': '0.375rem',
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
      },
      borderRadius: {
        'card': '1rem',
        'card-lg': '1.25rem',
        'card-xl': '1.5rem',
      },
      boxShadow: {
        'card': '0 2px 8px -2px rgb(138 75 31 / 0.08), 0 4px 16px -4px rgb(138 75 31 / 0.06)',
        'card-hover': '0 8px 24px -4px rgb(138 75 31 / 0.12), 0 16px 32px -8px rgb(138 75 31 / 0.08)',
        'gold': '0 0 0 2px #8A4B1F',
      },
      transitionDuration: {
        '200': '200ms',
        '300': '300ms',
        '400': '400ms',
      },
      transitionTimingFunction: {
        'ease-out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};
export default config;