import { computed } from 'vue'
import type { PropType, CSSProperties } from 'vue'
import { THEME_ROOT_PREFIX } from '../_vars'
import useThemeGenerator from './themeGenerator'

export interface IThemeProps {
    props?: {
        color?: string,
        theme?: Record<string, string>,
    },
    settings?: Record<string, unknown>
}

/**
 * TODO Come applicare sia il tema light che il tema dark?
 *
 * @param props
 * @param settings
 * @param prefix
 * @param globalPrefix
 */
export default ({ props, settings }: IThemeProps = {}, prefix = '', globalPrefix = THEME_ROOT_PREFIX) => {
    const {
        themes: themeGlobal,
        currentName
    } = useThemeGenerator()

    /**
     *
     */
    const themeProps = {
        /**
         * Use a theme already defined in themeGlobal
         */
        color: {
            type: String,
            default: () => '',
            ...settings?.color || {}
        },

        /**
         * How to setup custom var(--cssvar) instructions
         */
        theme: {
            type: Object as PropType<Record<string, string>>,
            default: () => {
                return {}
            },
            ...settings?.theme || {}
        }
    }

    /**
     * Styles for :root css
     * Object StyleValue compliant
     */
    const rootStyles = computed(() =>
        Object.fromEntries(
            Object.entries(currentName.value && themeGlobal.value?.[currentName.value]?.globals || {})
                .map(([key, value]) => [`--${globalPrefix}${key}`, value])
        ) as CSSProperties
    )

    /**
     * Styles for HTML elements
     * Object StyleValue compliant
     */
    const styles = computed(() =>
        Object.fromEntries([
            /**
             * The css vars passed through "color" must have the globalPrefix because the CSS components
             * have generic rules based on that. They will rewrite (locally) the global root style (if any)
             */
            ...Object.entries(props?.color && themeGlobal.value?.[props?.color]?.colors || {})
                .map(([key, value]) => [`--${globalPrefix}${key}`, value]),

            /**
             * This CSS instead is specific for the component so it can be personalized without worrying
             * about variables with same name but different meaning based on the CSS element
             */
            ...Object.entries(props?.theme || {})
                .map(([key, value]) => {
                    // if value is array of strings,
                    // then the first is the value and the second another prefix
                    if (Array.isArray(value))
                        return [`--${value[1]}${prefix}${key}`, value[0]]
                    return [`--${prefix}${key}`, value]
                })
        ]) as CSSProperties
    )

    /**
     * css var(--name) that user can implement
     */
    const styleString = computed(() =>
        Object.entries(styles.value)
            .map(([key, value]) => `${key}: ${value};`)
            .join(' ')
    )

    return {
        currentTheme: currentName,
        theme: themeGlobal,
        props: themeProps,
        rootStyles,
        styles,
        styleString
    }
}
