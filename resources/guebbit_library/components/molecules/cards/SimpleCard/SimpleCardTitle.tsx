import { defineComponent, h } from 'vue'
import { THEME_CLASS_PREFIX } from '@/guebbit_library/_vars'

export default defineComponent({
    name: 'SimpleCardTitle',
    props:{
        text: {
            type: String,
            required: false
        },
        tag: {
            type: String,
            default: () => "h3"
        },
    },
    setup(props, { slots }) {
        return () =>
            (slots.default || props.text) && h(props.tag, { class: THEME_CLASS_PREFIX + 'card-title' }, slots.default ? slots.default() : props.text)
    },
})


// // eslint-disable-next-line @typescript-eslint/naming-convention
// export const VCardTitle = createGenericComponent(["card-title"], {
//     text: {
//         type: String,
//         required: false
//     },
//     tag: {
//         type: String,
//         default: () => "h3"
//     },
// })
//
// export default VCardTitle;
//
// export type VCardTitle = InstanceType<typeof VCardTitle>


// import createGenericComponent from "@/guebbit_library/utils/createGenericComponent"
//
// export default createGenericComponent(["card-title"], {
//     text: {
//         type: String,
//         required: false
//     },
//     tag: {
//         type: String,
//         default: () => "h3"
//     },
// });
