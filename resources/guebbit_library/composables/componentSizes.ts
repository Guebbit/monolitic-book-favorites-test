import { computed } from 'vue'
import type { PropType } from 'vue'

export enum EComponentSizes {
  XS = 'xs',
  SM = 'sm',
  MD = 'md',
  LG = 'lg',
  XL = 'xl',
}

/**
 *
 * @param prefix
 * @param props
 */
export default (prefix = "", props: Record<'size', EComponentSizes> = { size: EComponentSizes.MD }) => {
  /**
   * Prop for component size
   */
  const sizeProps = {
    size: {
      type: String as PropType<EComponentSizes>,
      default: () => EComponentSizes.MD,
    },
  };

  /**
   * If a size was set, the logic lies in the css class
   */
  const classes = computed(() =>
    props.size ? `${prefix}${props.size}` : ''
  );

  return {
    props: sizeProps,
    classes
  }
};