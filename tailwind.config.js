const colors = require('tailwindcss/colors');

module.exports = {
  purge: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        gray: colors.gray,
        amber: colors.amber,
        lime: colors.lime,
        violet: colors.violet,
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
