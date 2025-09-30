// tailwind.config.js

export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode : 'class',
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        mono: ['Roboto Mono', 'monospace'],
      },
     
    },
  },
  plugins: [],
};
