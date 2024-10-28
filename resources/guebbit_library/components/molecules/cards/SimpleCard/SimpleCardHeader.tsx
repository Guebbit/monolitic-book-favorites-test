import { computed, defineComponent } from 'vue'
import { THEME_CLASS_PREFIX } from '@/guebbit_library/_vars'
import useComponentVariants from '@/guebbit_library/composables/componentVariants'
import CardTitle from './SimpleCardTitle'
import CardSubtitle from './SimpleCardSubtitle'
import CardActions, { ESimpleCardActionsVariants } from './SimpleCardActions'

export enum ESimpleCardHeaderVariants {
    START = 'start',
    CENTER = 'center',
    END = 'end',
}

/**
 * Outside setup only composable
 */
const {
    props: variantsProps
} = useComponentVariants<ESimpleCardHeaderVariants>()

export default defineComponent({
    name: 'SimpleCardHeader',
    props: {
        ...variantsProps,

        title: {
            type: String,
            required: false
        },
        titleTag: {
            type: String,
            default: () => 'h3'
        },
        sub: {
            type: String,
            required: false
        },
        subTag: {
            type: String,
            default: () => 'span'
        }
    },
    setup(props, { slots }) {
        /**
         * Setup only composable
         */
        const {
            classes: variantsClasses
        } = useComponentVariants<ESimpleCardActionsVariants>({ props }, THEME_CLASS_PREFIX + 'card-section-')

        /**
         *
         */
        const cardSub = computed(() =>
            (props.sub || slots.sub) &&
            <CardSubtitle
                text={props.sub}
                tag={props.subTag}
                v-slot={{
                    default: slots.sub
                }}
            />)

        /**
         * CardTitle
         */
        const cardTitle = computed(() =>
            (props.title || slots.title || cardSub.value) &&
            <CardTitle
                text={props.title}
                tag={props.titleTag}
                v-slots={{
                    default: () => (
                        <>
                            {slots.title ? slots.title() : props.title}
                            {cardSub.value}
                        </>
                    )
                }}
            />)

        /**
         *
         */
        const defaultSlot = computed(() =>
            slots.default || slots.actions || cardTitle.value ?
                <div class={[THEME_CLASS_PREFIX + 'card-header', variantsClasses.value]}>
                    {slots.default ? slots.default() : null}
                    <CardActions
                        v-slots={{
                            default: slots.actions
                        }}
                    />
                    {cardTitle.value}
                </div>
                : null
        )

        /**
         * Template
         */
        return () => defaultSlot.value
    }
})
