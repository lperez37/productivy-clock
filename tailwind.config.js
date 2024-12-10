/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      backdropBlur: {
        'sm': '4px',
      },
      opacity: {
        '5': '0.05',
        '10': '0.1',
        '20': '0.2',
        '40': '0.4',
        '60': '0.6',
      },
    },
  },
  plugins: [],
}
