import { computed, defineComponent } from 'vue'
import Media from '../../atoms/utilities/Media/Media'
import AspectRatio from '../../atoms/utilities/AspectRatio/AspectRatio'
import { THEME_VAR_PREFIX } from '../../../_vars'


export default defineComponent({
    name: 'AbstractMedia',
    extends: Media,

    props: {
        /**
         * Wanted ratio
         */
        ratio: {
            type: [Number, String],
            required: false
        },
    },

    setup(props, { attrs, slots }) {
        const hasRatio = computed(() => !!props.ratio)

        // regula element
        if(!hasRatio.value)
            return () =>
                <Media
                    {...props}
                    {...attrs}
                    v-slots={slots}
                />

        // ratioed element
        return () =>
            <AspectRatio
                {...attrs}
                ratio={props.ratio}
                style={{
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    ["--" + THEME_VAR_PREFIX + "image-aspect-ratio"]: "var(--" + THEME_VAR_PREFIX + "aspect-ratio)",
                }}
            >
                <Media
                    {...props}
                    v-slots={slots}
                />
            </AspectRatio>
    },
})
