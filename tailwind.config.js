/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    "./src/**/*.{html,ts}",  // ✅ this is crucial!
  ],
  theme: {
    extend: {
      colors: {
        ...colors  // re-add full color palette
      }
    }
  },
  plugins: [],
}
