module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: { extend: {} },
  plugins: [require('@tailwindcss/forms')],
}
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Raleway"', 'ui-sans-serif', 'system-ui'],
        script: ['"OperaSignature"', 'cursive'],
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
