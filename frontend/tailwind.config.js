/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        playful: ['"Archivo Black"', 'sans-serif'],
      },
      colors: {
        dark: {
          bg: '#0a0a0a',
          surface: '#141414',
          surfaceStrong: '#0f0f0f',
          border: 'rgba(255, 255, 255, 0.08)',
          borderStrong: 'rgba(255, 255, 255, 0.12)',
          text: '#e5e5e5',
          textMuted: 'rgba(229, 229, 229, 0.6)',
          textDim: 'rgba(229, 229, 229, 0.4)',
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
      },
      keyframes: {
        'fade-in': {
          from: {
            opacity: '0',
            transform: 'translateY(-10px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
    },
  },
  plugins: [],
}
