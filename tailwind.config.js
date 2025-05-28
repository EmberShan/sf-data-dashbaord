/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F9FBFC',
        'light-blue': '#E6F0F8',
        blue: '#C3E7FE',
        caption: '#A3B3BF',
        text: '#215273',
      },
    },
  },
  plugins: [],
} 