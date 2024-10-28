import './AspectRatio.scss';
import { defineComponent, computed } from 'vue';
import translateAspectRatio from "@/guebbit_library/utils/translateAspectRatio";
import {THEME_VAR_PREFIX} from "@/guebbit_library";

/**
 * Component
 */
export default defineComponent({
    name: 'AspectRatio',

    props: {
        /**
         * Wanted ratio
         * Can be a number (like 56.25%) or a string (like '16/9')
         */
        ratio: {
            type: [Number, String],
        },
    },

    setup(props, { slots }) {
        const calculatedAspectRatio = computed(() => translateAspectRatio(props.ratio));

        if(!calculatedAspectRatio.value)
            return () => slots.default?.()

        return () => (
          <div
              class="aspect-ratio-container"
              // eslint-disable-next-line @typescript-eslint/naming-convention
              style={{ ["--" + THEME_VAR_PREFIX + "aspect-ratio"]: calculatedAspectRatio.value }}
          >
              {slots.default?.()}
          </div>
        );
    },
});
