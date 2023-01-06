const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './layouts/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        gray: colors.zinc,
        amber: colors.amber,
        lime: colors.lime,
        violet: colors.violet,
        lightBlue: colors.lightBlue,
      },
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
}
