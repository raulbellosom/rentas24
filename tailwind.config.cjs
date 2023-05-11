/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
  content: [
    // ...
    "./src/**/*.{js,jsx,ts,tsx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: {
          50: "#f2f8fd",
          100: "#e4effa",
          200: "#c4def3",
          300: "#90c2e9",
          400: "#55a4db",
          500: "#318dcf",
          600: "#1f6caa",
          700: "#1b5689",
          800: "#1a4a72",
          900: "#1b3f5f",
          950: "#12283f",
        },
        secondary: {
          50: "#eff9ff",
          100: "#daf0ff",
          200: "#bee6ff",
          300: "#91d7ff",
          400: "#5dbffd",
          500: "#37a1fa",
          600: "#2f8bf0",
          700: "#196cdc",
          800: "#1b57b2",
          900: "#1c4b8c",
          950: "#162e55",
        },
      },
    },
  },
  plugins: [require("flowbite/plugin")],
  variants: {
    extend: {
      opacity: ["disabled"],
    },
  },
  animation: {
    fadeOut: "fadeOut 0.5s ease-in-out",
  },
};
