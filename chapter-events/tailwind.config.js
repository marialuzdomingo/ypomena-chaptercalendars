/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // YPO brand palette (from YPO_Color_Swatch_Main_BrandColors)
        navy: "#041E42",   // core brand color — dark blue, primary
        blue: "#0057B7",   // secondary blue — links, interactive accents
        gold: "#D69D23",   // core brand color — gold
        orange: "#EA7600", // secondary — chapter tags, warm accent
        red: "#DA291C",    // secondary — reserved for "cancelled" status only
        ink: "#1C1F26",
        paper: "#FAFAFC",
        line: "#E3E8EF",
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
    },
  },
  plugins: [],
};
