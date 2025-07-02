/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        primary: '#1E88E5',
        secondary: '#30CFD0'
      },
      borderRadius: {
        'button': '0.625rem'
      }
    },
  },
  plugins: [],
}