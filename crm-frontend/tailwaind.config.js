/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        luxury: {
          navy:      '#0B1628',
          'navy-mid':'#132040',
          'navy-card':'#172848',
          'navy-bdr':'#1E3260',
          gold:      '#C9973A',
          'gold-bright':'#E8B84B',
          champagne: '#F5DFA0',
          'champagne-dim':'rgba(245,223,160,0.15)',
          ivory:     '#F0E8D5',
          muted:     'rgba(240,232,213,0.45)',
          silver:    '#94A3B8',
          platinum:  '#A78BFA',
        },
      },
      fontFamily: {
        serif:  ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans:   ['Montserrat', 'sans-serif'],
      },
      animation: {
        'fade-up':   'fadeUp 0.6s ease both',
        'fade-up-1': 'fadeUp 0.6s ease 0.05s both',
        'fade-up-2': 'fadeUp 0.6s ease 0.12s both',
        'fade-up-3': 'fadeUp 0.6s ease 0.19s both',
        'fade-up-4': 'fadeUp 0.6s ease 0.26s both',
        'slide-in':  'slideIn 0.4s ease both',
        'shimmer':   'shimmer 1.6s ease infinite',
        'pulse-dot': 'pulseDot 2s ease infinite',
        'gold-glow': 'goldGlow 3s ease infinite',
        'spin-slow': 'spin 0.8s linear infinite',
      },
      keyframes: {
        fadeUp:   { from:{ opacity:0, transform:'translateY(22px)' }, to:{ opacity:1, transform:'translateY(0)' } },
        slideIn:  { from:{ opacity:0, transform:'translateX(-12px)' }, to:{ opacity:1, transform:'translateX(0)' } },
        shimmer:  { '0%,100%':{ opacity:.15 }, '50%':{ opacity:.45 } },
        pulseDot: { '0%,100%':{ transform:'scale(1)', boxShadow:'0 0 6px #4ADE8088' }, '50%':{ transform:'scale(1.2)', boxShadow:'0 0 14px #4ADE80BB' } },
        goldGlow: { '0%,100%':{ boxShadow:'0 0 12px rgba(201,151,58,0.2)' }, '50%':{ boxShadow:'0 0 28px rgba(201,151,58,0.5)' } },
      },
      backgroundImage: {
        'hero-pattern': "repeating-linear-gradient(45deg, rgba(201,151,58,0.04) 0, rgba(201,151,58,0.04) 1px, transparent 0, transparent 50%)",
        'gold-line':    'linear-gradient(to right, transparent, #C9973A60, transparent)',
        'card-surface': 'linear-gradient(145deg, #172848, #132040)',
      },
    },
  },
  plugins: [],
}