import { computed, defineComponent, h } from 'vue'
import CardActions from './SimpleCardActions'
import { THEME_CLASS_PREFIX } from '@/guebbit_library/_vars'
import editSlotItems from '@/guebbit_library/utils/editSlotItems'

export default defineComponent({
    name: 'SimpleCardContent',
    props: {
        /**
         * Content text (if not slot)
         */
        text: {
            type: String,
            default: () => ''
        },

        /**
         * Tag of text (if not slot)
         */
        tag: {
            type: String,
            default: () => 'p'
        },
    },
    setup(props, { slots }) {

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
            slots.default || actionsSlot.value.length > 0 || props.text ?
                <div class={THEME_CLASS_PREFIX + 'card-content'}>
                    {
                        slots.default ?
                            slots.default() :
                            props.text || slots.text ?
                                h(props.tag, {}, slots.text ? slots.text() : props.text)
                                : null
                    }
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
