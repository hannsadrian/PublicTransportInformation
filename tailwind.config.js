module.exports = {
  theme: {
    extend: {
      colors: {
        unselected: "#252e3d"
      }
    }
  },
  variants: {
    backgroundColor: ["responsive", "hover", "focus", "disabled"],
    cursor: ["responsive", "hover", "focus", "disabled"]
  },
  plugins: [
    function({ addVariant, e }) {
      addVariant("disabled", ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.${e(`disabled${separator}${className}`)}:disabled`;
        });
      });
    }
  ]
};
