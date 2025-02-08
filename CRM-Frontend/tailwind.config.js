import defaultTheme from 'tailwindcss/defaultTheme';
import colors from 'tailwindcss/colors';
import flattenColorPalette from 'tailwindcss/lib/util/flattenColorPalette.js';

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  darkMode: "class", // Ensures dark mode works with a class
  theme: {
    extend: {
      colors: {
        primary: colors.indigo,
        secondary: colors.gray,
      },
    },
  },
  plugins: [addVariablesForColors],
};

// Plugin to add Tailwind colors as CSS variables
function addVariablesForColors({ addBase, theme }) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(Object.entries(allColors).map(([key, val]) => [`--${key}`, val]));

  addBase({
    ":root": newVars,
    ".dark": newVars, // Ensures dark mode works correctly
  });
}
