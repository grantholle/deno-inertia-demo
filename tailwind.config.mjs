/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "inertia.ts",
    "src/**/*.{js,ts,vue}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Gilroy', 'sans-serif'], 
      }
    },
  },
  plugins: [],
};
