/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Adjust the paths according to your project structure
  ],
  theme: {
    extend: {
      colors: {
        'picton-blue': {
          '50': '#f1f9fe',
          '100': '#e2f3fc',
          '200': '#bfe6f8',
          '300': '#86d3f3',
          '400': '#46bcea',
          '500': '#21aae1', // Color principal
          '600': '#1084b9',
          '700': '#0e6996',
          '800': '#10597c',
          '900': '#134a67',
          '950': '#0d2f44',
        },
      },
    },
  },
  plugins: [],
};
