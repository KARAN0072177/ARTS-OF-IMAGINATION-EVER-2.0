/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        fredoka: ["Fredoka", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
        titillium: ["Titillium Web", "sans-serif"],
      },
      boxShadow: {
        'text': '0 4px 6px rgba(105, 67, 78, 0.1)',
      },
      animation: {
        float: "float 4s ease-in-out infinite", // 👈 add this
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities(
        {
          '.text-shadow': {
            textShadow: '2px 2px 4px rgba(105 67, 78, 0.8)',
          },
          '.text-shadow-md': {
            textShadow: '0 0 10px #93C5FD',
          },
          '.text-shadow-lg': {
            textShadow: '0 0 10px #93C5FD',
          },
        },
        ['responsive', 'hover']
      );
    },
  ],
}