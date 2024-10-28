import { computed, defineComponent, h } from 'vue'
import { THEME_CLASS_PREFIX } from '@/guebbit_library/_vars'
import CardActions, { ESimpleCardActionsVariants } from './SimpleCardActions'
import useComponentVariants from '@/guebbit_library/composables/componentVariants'
import editSlotItems from '@/guebbit_library/utils/editSlotItems'

export enum ESimpleCardFooterVariants {
    START = 'start',
    CENTER = 'center',
    END = 'end',
}

/**
 * Outside setup only composable
 */
const {
    props: variantsProps
} = useComponentVariants<ESimpleCardFooterVariants>()

export default defineComponent({
    name: 'SimpleCardFooter',
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
        const actionsSlot = computed(() => editSlotItems(slots.actions, {
            classes: [THEME_CLASS_PREFIX + "card-icon"]
        }, {
            tags: ["img", "svg"]
        }));

        /**
         *
         */
        const defaultSlot = computed(() =>
            slots.default || actionsSlot.value.length > 0 ?
                <div class={[THEME_CLASS_PREFIX + "card-footer", variantsClasses.value]}>
                    {slots.default ? slots.default() : null}
                    {actionsSlot.value.length > 0 ? <CardActions>{actionsSlot.value}</CardActions> : null}
                </div>
                : null
        )

        /**
         * Template
         */
        return () => defaultSlot.value
    }
})
