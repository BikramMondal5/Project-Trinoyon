// tailwind.config.js
module.exports = {
  content: [
    "./views/**/*.ejs",
    "./partials/**/*.ejs",
    "./public/**/*.ejs",
    "./public/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF3C7D', // Your custom primary color
      }
    },
  },
  plugins: [],
}
