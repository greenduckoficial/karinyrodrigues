import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: 'oklch(var(--paper) / <alpha-value>)',
        ink: 'oklch(var(--ink) / <alpha-value>)',
        muted: 'oklch(var(--muted) / <alpha-value>)',
        line: 'oklch(var(--line) / <alpha-value>)',
        card: 'oklch(var(--card) / <alpha-value>)',
        accent: 'oklch(var(--accent) / <alpha-value>)',
        'accent-soft': 'oklch(var(--accent-soft) / <alpha-value>)',
        amber: 'oklch(var(--amber) / <alpha-value>)',
      },
      fontFamily: {
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '14px',
        '2xl': '20px',
        full: '9999px',
      },
      maxWidth: {
        prose: '720px',
      },
    },
  },
  plugins: [],
} satisfies Config
