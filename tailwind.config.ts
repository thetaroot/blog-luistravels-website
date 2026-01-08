import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    'bg-warm-white/98',
    'bg-warm-white/95',
    'bg-warm-white/90',
    'bg-warm-white/80',
    'bg-warm-white/70',
    'bg-warm-white/60',
    'bg-warm-white/50',
    'bg-warm-white/40',
    'bg-warm-white/30',
    'bg-warm-white/20',
    'bg-warm-white/10',
    'border-warm-white/95',
    'border-warm-white/90',
    'border-warm-white/80',
    'border-warm-white/70',
    'border-warm-white/60',
    'border-warm-white/50',
    'border-warm-white/40',
    'border-warm-white/30',
    'border-warm-white/20',
    'border-warm-white/10',
    'border-pure-white',
    'backdrop-blur-2xl',
    'backdrop-blur-xl',
    'backdrop-blur-sm',
  ],
  theme: {
    extend: {
      colors: {
        'warm-white': '#F1EDE4',
        'pure-white': '#FFFFFF',
        'dark': '#141413',
      },
      opacity: {
        '98': '0.98',
      },
      fontFamily: {
        'playfair': ['var(--font-playfair)', 'serif'],
        'crimson': ['var(--font-crimson)', 'serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
export default config