/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0d1b2a",
        slateink: "#334155",
        muted: "#64748b",
        line: "#dde5ef",
        paper: "#ffffff",
        canvas: "#eef3f9",
        brand: {
          50: "#eff8ff",
          100: "#dbeefe",
          200: "#bfe1fd",
          300: "#93cdfb",
          400: "#60b0f7",
          500: "#3691ee",
          600: "#1f72d6",
          700: "#1a5cae",
          800: "#1b4d8c",
          900: "#1b4173",
        },
        teal2: "#0ea5a3",
        good: "#0f8a5f",
        warn2: "#b4690e",
        bad: "#d23f3f",
      },
      fontFamily: {
        sans: [
          '"PingFang SC"',
          '"Microsoft YaHei"',
          '"Hiragino Sans GB"',
          '"Source Han Sans SC"',
          '"Noto Sans CJK SC"',
          '"Segoe UI"',
          "system-ui",
          "sans-serif",
        ],
        num: ['"Segoe UI"', '"Helvetica Neue"', "Arial", "sans-serif"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(13,27,42,.04), 0 8px 24px rgba(13,27,42,.06)",
        lift: "0 10px 30px rgba(13,27,42,.10)",
      },
      borderRadius: {
        xl2: "18px",
      },
    },
  },
  plugins: [],
};
