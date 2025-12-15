/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],

  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        rtj: {
          bg: "#05071A",      // fondo oscuro base
          card: "#10142A",
          magenta: "#C02485", // principal
          fucsia: "#E5006D",  // acento
          yellow: "#FFD943",  // detalles
        },
      },
      backgroundImage: {
        // Fondo general de página
        "rtj-page": "linear-gradient(180deg, #C02485 0%, #E5006D 45%, #05071A 100%)",
        // Hero o secciones principales
        "rtj-hero": "linear-gradient(90deg, #C02485 15%, #E5006D 60%, #05071A 90%)",
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
