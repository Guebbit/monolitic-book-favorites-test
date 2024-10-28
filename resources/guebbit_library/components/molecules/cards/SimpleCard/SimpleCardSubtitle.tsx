import { defineComponent, h } from 'vue'
import { THEME_CLASS_PREFIX } from '@/guebbit_library/_vars'

export default defineComponent({
    name: 'SimpleCardSubtitle',
    props:{
        text: {
            type: String,
            required: false
        },
        tag: {
            type: String,
            default: () => "span"
        },
    },
    setup(props, { slots }) {
        return () =>
            (slots.default || props.text) && h(props.tag, { class: THEME_CLASS_PREFIX + 'card-subtitle' }, slots.default ? slots.default() : props.text)
    },
})
