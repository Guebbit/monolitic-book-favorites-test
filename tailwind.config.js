import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/**/*.vue',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            // Vuetify breakpoints
            screens: {
                sm: '600px',
                md: '960px',
                lg: '1264px',
                xl: '1904px',
            },
            colors: {
                primary: {
                    100: '#C3F8FF',
                    200: '#87F1FF',
                    300: '#4CEAF4',
                    400: '#10E4E0',
                    500: '#00BCD4',
                    600: '#009696',
                    700: '#00707F',
                    800: '#004B55',
                    900: '#00253E',
                },
                secondary: {
                    100: '#FFEAD0',
                    200: '#FFDB99',
                    300: '#FFC966',
                    400: '#FFAC33',
                    500: '#FF9800',
                    600: '#CC7900',
                    700: '#995B00',
                    800: '#663C00',
                    900: '#331E00',
                },
            },
        },
    },

    plugins: [forms],
};
