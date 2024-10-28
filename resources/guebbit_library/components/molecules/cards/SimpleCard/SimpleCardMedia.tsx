import { defineComponent } from 'vue'
import Media from '../../../abstracts/Media/Media'
import { THEME_CLASS_PREFIX } from '@/guebbit_library/_vars'

export default defineComponent({
    name: 'SimpleCardMedia',
    extends: Media,

    props: {
        /**
         * If it's a background
         */
        background: {
            type: Boolean,
            default: () => false
        },
    },

    setup(props, { attrs, slots }) {
        return () =>
            <Media
                {...props}
                {...attrs}
                class={attrs.class ? attrs.class : (props.background ? THEME_CLASS_PREFIX + 'card-background' : THEME_CLASS_PREFIX + 'card-media')}
                v-slots={slots}
            />
    },
})
