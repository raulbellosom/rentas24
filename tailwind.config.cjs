/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
  content: [
    // ...
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Manrope", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        brand: {
          50: "#f5f9fc",
          100: "#e6f0f8",
          200: "#c8dcef",
          300: "#9fc0e1",
          400: "#639ac7",
          500: "#2e6f9f",
          600: "#1f567f",
          700: "#184565",
          800: "#14344e",
          900: "#10263c",
          950: "#0b1528",
        },
        accent: {
          50: "#edfbfd",
          100: "#d3f5fa",
          200: "#aeeaf5",
          300: "#7edbec",
          400: "#42d4ea",
          500: "#21c1dc",
          600: "#1398b2",
          700: "#127992",
          800: "#155f72",
          900: "#154f60",
          950: "#083643",
        },
        primary: {
          50: "#f5f9fc",
          100: "#e6f0f8",
          200: "#c8dcef",
          300: "#9fc0e1",
          400: "#639ac7",
          500: "#2e6f9f",
          600: "#1f567f",
          700: "#184565",
          800: "#14344e",
          900: "#10263c",
          950: "#0b1528",
        },
        secondary: {
          50: "#edfbfd",
          100: "#d3f5fa",
          200: "#aeeaf5",
          300: "#7edbec",
          400: "#42d4ea",
          500: "#21c1dc",
          600: "#1398b2",
          700: "#127992",
          800: "#155f72",
          900: "#154f60",
          950: "#083643",
        },
      },
    },
  },
  plugins: [],
  variants: {
    extend: {
      opacity: ["disabled"],
    },
  },
  animation: {
    fadeOut: "fadeOut 0.5s ease-in-out",
  },
};
