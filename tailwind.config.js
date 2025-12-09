const colors = require('tailwindcss/colors');
const defaultConfig = require('tailwindcss/defaultConfig');

module.exports = {
    mode: 'jit',
    purge: ['./pages/**/*.tsx', './components/**/*.tsx'],
    darkMode: 'class',
    theme: {
        colors: {
            // Claude-inspired warm color palette
            gray: {
                50: '#FAFAF9',
                100: '#F5F5F4',
                200: '#E7E5E4',
                300: '#D6D3D1',
                400: '#A8A29E',
                500: '#78716C',
                600: '#57534E',
                700: '#44403C',
                800: '#292524',
                900: '#1C1917',
            },
            primary: {
                50: '#FFF7ED',
                100: '#FFEDD5',
                200: '#FED7AA',
                300: '#FDBA74',
                400: '#FB923C',
                500: '#F97316', // Claude's warm orange
                600: '#EA580C',
                700: '#C2410C',
                800: '#9A3412',
                900: '#7C2D12',
            },
            accent: {
                50: '#FEF3F2',
                100: '#FEE2E2',
                200: '#FECACA',
                300: '#FCA5A5',
                400: '#F87171',
                500: '#EF4444',
                600: '#DC2626',
                700: '#B91C1C',
                800: '#991B1B',
                900: '#7F1D1D',
            },
            blue: colors.blue,
            red: colors.red,
            yellow: colors.yellow,
            green: colors.green,
            transparent: 'transparent',
            current: 'currentColor',
            white: '#FFFFFF',
            black: '#000000',
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
            sans: [
                'ui-sans-serif',
                '-apple-system',
                'BlinkMacSystemFont',
                'Segoe UI',
                'Roboto',
                'Inter',
                'Helvetica Neue',
                'Arial',
                'sans-serif',
                'Apple Color Emoji',
                'Segoe UI Emoji',
            ],
            serif: [
                'ui-serif',
                'Charter',
                'Bitstream Charter',
                'Georgia',
                'Cambria',
                'Times New Roman',
                'Times',
                'serif',
            ],
            mono: defaultConfig.theme.fontFamily['mono'],
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
