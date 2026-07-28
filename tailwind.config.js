/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#EAE5D9',
        card: '#FBF8F2',
        ink: '#24211C',
        muted: '#6B6555',
        ledger: {
          DEFAULT: '#3B5249',
          light: '#4E6D61',
          dark: '#293B34',
        },
        amber: {
          DEFAULT: '#B8842E',
          light: '#D7A85A',
          dark: '#8C6320',
        },
        line: '#CFC6B0',
      },
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        body: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(36, 33, 28, 0.06), 0 2px 8px rgba(36, 33, 28, 0.05)',
        cardHover: '0 4px 14px rgba(36, 33, 28, 0.12), 0 2px 4px rgba(36, 33, 28, 0.08)',
      },
      backgroundImage: {
        grain: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};
