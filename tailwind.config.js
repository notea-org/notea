const colors = require('tailwindcss/colors')

module.exports = {
  purge: false,
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
      backgroundColor: ['active'],
      borderWidth: ['last'],
    },
  },
  plugins: [require('@tailwindcss/typography'), require('nightwind')],
}
