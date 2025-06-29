/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        primary: '#FF3C7D',
        secondary: '#30CFD0'
      },
      borderRadius: {
        'button': '0.625rem'
      }
    },
  },
  plugins: [],
}