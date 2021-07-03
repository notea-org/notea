const colors = require('tailwindcss/colors')

module.exports = {
  mode: 'jit',
  purge: ['./pages/**/*.tsx', './components/**/*.tsx'],
  darkMode: 'class',
  theme: {
    colors: {
      gray: colors.gray,
      blue: colors.blue,
      transparent: 'transparent',
      current: 'currentColor',
    },
    screens: {
      md: '768px',
    },
    extend: {
      cursor: {
        'col-resize': 'col-resize',
      },
      nightwind: {
        typography: true,
        colorClasses: ['divide', 'placeholder'],
      },
    },
  },
  variants: {
    extend: {
      display: ['group-hover'],
      visibility: ['group-hover'],
      backgroundColor: ['active'],
      borderWidth: ['last'],
    },
  },
  plugins: [require('@tailwindcss/typography'), require('nightwind')],
}
