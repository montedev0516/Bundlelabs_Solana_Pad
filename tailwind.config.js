const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      fontSize: {
        xxs: "12px",
        xs: "14px",
        sm: "16px",
        base: "18px",
        lg: "20px",
        xl: "22px",
        '2xl': "26px",
        '3xl': "32px"
      },
      width: {
        button: "40px",
      },
      height: {
        button: "40px",
      },
    },
    colors: {
      "slate-tableHeader": "#020b1b",
      "slate-title": "#030F25",
      "slate-900": "#07142B",
      "slate-950": "#020B1A",
      "slate-500": "#3E75A7",
      "blue-950": "#142B69",
      "black-light": "#10102D",
      "gray-dark": "#1F1F1F",
      "gray-highlight": "#2D2D2D",
      "gray-normal": "#878787",
      "gray-border": "#87878760",
      "red-normal": "#D81D3C",
      "red-semi": "#D81D3C15",
      "green-normal": "#00b478",
      "green-dark": "#57C03220",
      "yellow-normal": "#F19A27",
    }
  },
  plugins: [],
});