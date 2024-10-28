import { computed } from 'vue'
import { THEME_CLASS_PREFIX } from '../_vars'

export interface IGenericProps {
  props?: {
    animated?: boolean,
    animatedHover?: boolean,
    animatedActive?: boolean,
    active?: boolean,
  },
  settings?: Record<string, unknown>
}

/**
 *
 * @param props
 * @param settings
 * @param prefix
 */
export default ({ props, settings }: IGenericProps = {}, prefix= THEME_CLASS_PREFIX) => {

  /**
   *
   */
  const animationProps = {
    /**
     * animate on hover and on active
     */
    animated: {
      type: Boolean,
      default: () => true,
      ...settings?.animated || {}
    },

    /**
     * Animate on hover only
     */
    animatedHover: {
      type: Boolean,
      default: () => false,
      ...settings?.animatedHover || {}
    },

    /**
     * Animate on active only
     */
    animatedActive: {
      type: Boolean,
      default: () => false,
      ...settings?.animatedActive || {}
    },

    /**
     * Button is active
     */
    active: {
      type: Boolean,
      default: () => false,
      ...settings?.active || {}
    },
  };

  /**
   *
   */
  const animationClasses = computed(() => [
    (props?.animated || props?.animatedHover) ? prefix + 'animate-on-hover' : undefined,
    (props?.animated || props?.animatedActive) ? prefix + 'animate-on-active' : undefined,
    props?.active ? prefix + 'animate-active' : undefined,
  ].filter(Boolean) as string[]);

  return {
    animationProps,
    animationClasses
  }
}
