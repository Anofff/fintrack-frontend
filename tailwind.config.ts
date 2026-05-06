import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#00694c',
        'primary-container': '#008560',
        'on-primary': '#ffffff',
        'on-primary-container': '#f5fff7',
        'inverse-primary': '#68dbae',

        secondary: '#0060a8',
        'secondary-container': '#5da9fe',
        'on-secondary': '#ffffff',
        'on-secondary-container': '#003d6d',

        tertiary: '#554cb9',
        'tertiary-container': '#6e66d4',
        'on-tertiary': '#ffffff',

        error: '#ba1a1a',
        'error-container': '#ffdad6',
        'on-error': '#ffffff',

        background: '#f8f9ff',
        surface: '#f8f9ff',
        'surface-bright': '#f8f9ff',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#eff4ff',
        'surface-container': '#e5eeff',
        'surface-container-high': '#dce9ff',
        'surface-container-highest': '#d3e4fe',
        'surface-dim': '#cbdbf5',
        'surface-variant': '#d3e4fe',
        'inverse-surface': '#213145',
        'inverse-on-surface': '#eaf1ff',

        'on-surface': '#0b1c2f',
        'on-surface-variant': '#3d4943',
        'on-background': '#0b1c2f',

        outline: '#6d7a73',
        'outline-variant': '#bccac1',

        'color-income': '#00694c',
        'color-debit': '#ba1a1a',
        'color-transfer': '#0060a8',
        'color-cash-out': '#EF9F27',
        'color-loan': '#554cb9',
        'color-data': '#185FA5',
        'color-airtime': '#378ADD',
        'color-uncategorised': '#6d7a73',

        'dark-bg': '#141C26',
        'dark-surface': '#1A2535',
        'dark-surface-alt': '#212E40',
        'dark-border': 'rgba(255,255,255,0.08)',
        'dark-text': '#E8EDF3',
        'dark-muted': '#8A9BB0',
      },

      fontSize: {
        h1: ['28px', { lineHeight: '34px', fontWeight: '600', letterSpacing: '-0.02em' }],
        h2: ['22px', { lineHeight: '28px', fontWeight: '600', letterSpacing: '-0.01em' }],
        h3: ['18px', { lineHeight: '24px', fontWeight: '600' }],
        h4: ['15px', { lineHeight: '20px', fontWeight: '500' }],
        'body-reg': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'body-mid': ['14px', { lineHeight: '20px', fontWeight: '500' }],
        'body-sm': ['13px', { lineHeight: '18px', fontWeight: '400' }],
        label: ['12px', { lineHeight: '16px', fontWeight: '600' }],
      },

      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        gutter: '20px',
      },

      borderRadius: {
        sm: '4px',
        DEFAULT: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        full: '9999px',
      },

      borderWidth: {
        3: '3px',
      },

      boxShadow: {
        card: '0px 2px 4px rgba(0,0,0,0.04), 0px 4px 12px rgba(0,0,0,0.02)',
        nav: '0px -2px 10px rgba(0,0,0,0.02)',
      },

      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
