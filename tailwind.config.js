/** @type {import('tailwindcss').Config} */
module.exports = {
  // ✅ Para controlar el modo oscuro por clase (y poder forzarlo fijo desde <html class="dark">)
  darkMode: ["class"],

  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        rtj: {
          bg: "#05071A", // fondo
          card: "#10142A",
          magenta: "#C02485", // principal
          fucsia: "#E5006D", // acento
          yellow: "#FFD943", // detalles
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui"],
        body: ["var(--font-body)", "system-ui"],
      },
      borderRadius: {
        bubble: "24px",
        hero: "32px",
      },
    },
  },

  plugins: [],
};
