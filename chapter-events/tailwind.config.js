/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // YPO brand palette (from YPO_Color_Swatch_Main_BrandColors)
        navy: "#041E42",     // core brand color — dark blue, now the page background
        paper: "#0B2A52",    // lighter navy surface — cards, panels, modals, hovers
        ink: "#F2F5F9",      // near-white text, readable on the dark navy background
        line: "rgba(255,255,255,0.12)", // subtle borders on dark surfaces
        gold: "#D69D23",     // core brand color — gold, primary accent on dark bg
        sky: "#0090DA",      // secondary — links, readable accent on dark navy
        blue: "#0057B7",     // secondary — used within status chips (white chip bg, so still legible)
        orange: "#EA7600",   // secondary — chapter tags, warm accent
        red: "#DA291C",      // secondary — reserved for "cancelled" status only
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
