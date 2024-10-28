import { inject, provide, computed, ref } from 'vue'
import type { InjectionKey, Ref } from 'vue';

export interface IThemeGlobal {
    /**
     * Specify if it's a dark or light theme,
     * to better control some UI details
     * TODO
     */
    dark?: boolean

    /**
     * Colors of theme
     * instruction => value
     */
    colors?: Record<string, string | [string, string]>

    /**
     * Colors of document root,
     * use a prefix like "g-theme-"
     * instruction => value
     */
    globals?: Record<string, string | [string, string]>

    /**
     * TODO
     * Specific colors for the components
     * component => instruction => value
     */
    components?: Record<string, Record<string, string>>
}

/**
 * Use:
 * https://www.npmjs.com/package/color
 * https://github.com/Qix-/color
 *
 * Ideas:
 * https://vuetifyjs.com/en/features/theme/#javascript
 * https://github.com/vuetifyjs/vuetify/blob/ae33530ac17226ca942849bea364ee441ae1dd9f/packages/vuetify/src/composables/theme#L211
 * https://github.com/vuetifyjs/vuetify/blob/ae33530ac17226ca942849bea364ee441ae1dd9f/packages/vuetify/src/framework#L43
 */
export default () => {
    /**
     * Access to all themes that can be provided elsewhere
     */
    const themeSymbol: InjectionKey<Ref<Record<string, IThemeGlobal>>> = Symbol.for('guebbit:themes');

    /**
     * Access to all themes that can be provided elsewhere
     */
    const currentSymbol: InjectionKey<Ref<keyof Record<string, IThemeGlobal>>> = Symbol.for('guebbit:current-theme');

    /**
     * Global theme object
     */
    const themes = inject<Ref<Record<string, IThemeGlobal>>>(themeSymbol, ref({}));

    /**
     * Name of theme currently in use
     */
    const currentName = inject<Ref<string>>(currentSymbol, ref(""));

    /**
     * Theme in use
     */
    const current = computed(() => themes.value[currentName.value]);

    /**
     * Add a new theme (overwrite if exist)
     * Not one-liner with spreading ... to ensure reactivity is maintained
     *
     * @param name
     * @param themeData
     */
    const add = (name = "", themeData: IThemeGlobal = {}) =>
        themes.value[name] = themeData;

    /**
     * Edit a new theme (create if not exist)
     *
     * @param name
     * @param themeData
     */
    const edit = (name = "", themeData: IThemeGlobal = {}) =>
        themes.value[name] = {
            ...themes.value[name],
            ...themeData
        }

    /**
     * Set all themes, replacing the old theme tree
     * @param themeDictionary
     */
    const set = (themeDictionary: Record<string, IThemeGlobal>) =>
        themes.value = { ...themeDictionary }

    /**
     * List of available themes
     */
    const list = computed(() => Object.keys(themes.value))

    /**
     *
     */
    return {
        themeSymbol,
        themes,
        currentSymbol,
        currentName,
        current,
        add,
        edit,
        set,
        list,
    }
}
