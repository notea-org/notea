module.exports = {
  purge: ['./**/*.tsx'],
  darkMode: 'class',
  theme: {
    extend: {
      cursor: {
        'col-resize': 'col-resize',
      },
    },
  },
  variants: {
    extend: {
      display: ['group-hover'],
      backgroundColor: ['active'],
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
