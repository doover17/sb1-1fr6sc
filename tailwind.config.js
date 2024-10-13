/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: '#f4e9d5',
        brown: {
          100: '#f5e0c5',
          200: '#e6c49f',
          300: '#d7a97a',
          400: '#c88e55',
          500: '#b97330',
          600: '#9a5f26',
          700: '#7b4b1d',
          800: '#5c3713',
          900: '#3d240a',
        },
      },
      fontFamily: {
        medieval: ['MedievalSharp', 'cursive'],
      },
    },
  },
  plugins: [],
}