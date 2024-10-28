/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */
// Style
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import {createVuetify} from 'vuetify'
// @ts-expect-error missing types
import tailwindConfig from "../../tailwind.config.js";

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
    theme: {
        defaultTheme: 'dark',
        themes: {
            dark: {
                dark: true,
                colors:{
                    primary: tailwindConfig.theme.extend.colors.primary[500], // base
                    'primary-100': tailwindConfig.theme.extend.colors.primary[100],
                    'primary-200': tailwindConfig.theme.extend.colors.primary[200],
                    'primary-300': tailwindConfig.theme.extend.colors.primary[300],
                    'primary-400': tailwindConfig.theme.extend.colors.primary[400],
                    'primary-500': tailwindConfig.theme.extend.colors.primary[500],
                    'primary-600': tailwindConfig.theme.extend.colors.primary[600],
                    'primary-700': tailwindConfig.theme.extend.colors.primary[700],
                    'primary-800': tailwindConfig.theme.extend.colors.primary[800],
                    'primary-900': tailwindConfig.theme.extend.colors.primary[900],

                    secondary: tailwindConfig.theme.extend.colors.secondary[500], // base
                    'secondary-100': tailwindConfig.theme.extend.colors.secondary[100],
                    'secondary-200': tailwindConfig.theme.extend.colors.secondary[200],
                    'secondary-300': tailwindConfig.theme.extend.colors.secondary[300],
                    'secondary-400': tailwindConfig.theme.extend.colors.secondary[400],
                    'secondary-500': tailwindConfig.theme.extend.colors.secondary[500],
                    'secondary-600': tailwindConfig.theme.extend.colors.secondary[600],
                    'secondary-700': tailwindConfig.theme.extend.colors.secondary[700],
                    'secondary-800': tailwindConfig.theme.extend.colors.secondary[800],
                    'secondary-900': tailwindConfig.theme.extend.colors.secondary[900],
                }
            },
        }
    }
})
