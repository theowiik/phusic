/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
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
    },
  },
  plugins: [],
}
