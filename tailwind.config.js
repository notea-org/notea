module.exports = {
  purge: ['./**/*.tsx'],
  darkMode: 'class',
  theme: {
    extend: {
      cursor: {
        'col-resize': 'col-resize',
      },
      nightwind: {
        typography: true,
      },
    },
  },
  variants: {
    extend: {
      display: ['group-hover'],
      backgroundColor: ['active'],
    },
  },
  plugins: [require('@tailwindcss/typography'), require('nightwind')],
}
