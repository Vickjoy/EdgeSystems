/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'custom-black': '#000000',
        'dark-blue': '#3D0000',
        'mid-blue': '#950101',
        'light-blue': '#FF0000',
      },
    },
  },
  plugins: [],
}