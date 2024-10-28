import { computed, defineComponent } from 'vue'

import { THEME_CLASS_PREFIX } from '@/guebbit_library/_vars'
import useComponentVariants from '@/guebbit_library/composables/componentVariants'
import editSlotItems from '@/guebbit_library/utils/editSlotItems'

export enum ESimpleCardActionsVariants {
    START = 'start',
    CENTER = 'center',
    END = 'end',
    VERTICAL = 'vertical',
}

/**
 * Outside setup only composable
 */
const {
    props: variantsProps
} = useComponentVariants<ESimpleCardActionsVariants>({
    settings: {
        default: () => ESimpleCardActionsVariants.START
    }
})

/**
 * Template
 */
export default defineComponent({
    name: 'SimpleCardActions',
    props: {
        ...variantsProps,
    },
    setup(props, { slots }) {
        /**
         * Setup only composable
         */
        const {
            classes: variantsClasses
        } = useComponentVariants<ESimpleCardActionsVariants>({ props }, THEME_CLASS_PREFIX + 'card-section-');

        /**
         *
         */
        const defaultSlot = computed(() => editSlotItems(slots.default, {
            classes: [THEME_CLASS_PREFIX + "card-icon"]
        }, {
            tags: ["img", "svg"]
        }));

        /**
         * Template
         */
        return () =>
            defaultSlot.value.length > 0 && <div class={[THEME_CLASS_PREFIX + 'card-actions', variantsClasses.value]}>{defaultSlot.value}</div>
    },
})
