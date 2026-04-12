/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'DM Sans'", "system-ui", "sans-serif"],
        mono: ["'DM Mono'", "monospace"],
      },
      colors: {
        primary:     "#2a2623",
        "primary-fg":"#f7f6f2",
        accent:      "#d4622a",
        background:  "#f7f6f2",
        surface:     "#ffffff",
        surface2:    "#f0efe9",
        border:      "#e2e0d8",
        border2:     "#cbc9be",
        muted:       "#9b9a92",
        secondary:   "#6b6960",
        destructive: "#c0392b",
      },
      borderRadius: {
        DEFAULT: "8px",
        lg:      "12px",
        xl:      "16px",
      },
    },
  },
  plugins: [],
};
