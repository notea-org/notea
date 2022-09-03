const colors = require('tailwindcss/colors');
const defaultConfig = require('tailwindcss/defaultConfig');

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
        fontFamily: {
            sans: ['Noto Sans'].concat(defaultConfig.theme.fontFamily['sans']),
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
};
