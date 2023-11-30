/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      borderWidth: {
        '40': '40px', // This creates a new class 'border-b-40'
      },
      screens: {
        '2xl': '1920px', // Breakpoint at 1920px
        'xl': '1280px',  // Breakpoint at 1280px
        'lg': '960px',   // Breakpoint at 480px
        'md': '480px',   // Breakpoint at 480px
        'sm': '360px',   // Breakpoint at 360px
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
