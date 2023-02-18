const tailwindConfig = require('./tailwind.config');

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...tailwindConfig,
  content: [...tailwindConfig.content, './test-suite/**/*.{js,ts,jsx,tsx}'],
};
