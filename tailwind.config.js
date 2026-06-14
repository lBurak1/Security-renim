/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0b1120',
        panel: '#111a2e',
        panel2: '#16213e',
        line: '#243049',
        brand: '#3b82f6',
        accent: '#22d3ee',
      },
    },
  },
  plugins: [],
}
