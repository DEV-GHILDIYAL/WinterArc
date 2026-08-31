/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        winter: {
          bg: '#0A0A0F',
          card: '#12121A',
          cardHover: '#1A1A26',
          border: '#242436',
          borderGlow: 'rgba(255, 107, 53, 0.3)',
          text: '#F1F5F9',
          muted: '#94A3B8',
          orange: '#FF6B35',
          red: '#E63946',
          ice: '#00D9FF',
          darkIce: '#005580',
          success: '#10B981',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['"Space Grotesk"', '"Sora"', 'sans-serif'],
      },
      boxShadow: {
        fire: '0 0 25px rgba(255, 107, 53, 0.4)',
        ice: '0 0 25px rgba(0, 217, 255, 0.3)',
        card: '0 8px 30px rgba(0, 0, 0, 0.5)',
      },
      backgroundImage: {
        'fire-gradient': 'linear-gradient(135deg, #FF6B35 0%, #E63946 100%)',
        'ice-gradient': 'linear-gradient(135deg, #00D9FF 0%, #0077FF 100%)',
        'dark-gradient': 'linear-gradient(180deg, #0A0A0F 0%, #12121D 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'flame-flicker': 'flicker 1.5s ease-in-out infinite alternate',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { transform: 'scale(1) rotate(-1deg)', opacity: '1' },
          '50%': { transform: 'scale(1.08) rotate(1deg)', opacity: '0.88' },
        },
      },
    },
  },
  plugins: [],
};
