/**
 * TODO?
 * https://github.com/vuetifyjs/vuetify/blob/e3b9895b12b669bee7d39f9de8653222231f5330/packages/vuetify/src/composables/component#L15
 *
 * example:
 * https://github.com/vuetifyjs/vuetify/blob/e3b9895b12b669bee7d39f9de8653222231f5330/packages/vuetify/src/composables/border
 */


/**
 * Credits to Vuetify
 * https://github.com/vuetifyjs
 *
 * Original file
 * https://github.com/vuetifyjs/vuetify/blob/e3b9895b12b669bee7d39f9de8653222231f5330/packages/vuetify/src/util/propsFactory#L31
 */
import type { IfAny } from '@vue/shared' // eslint-disable-line vue/prefer-import-from-vue
import type { ComponentObjectPropsOptions, Prop, PropType } from 'vue'

/**
 * Creates a factory function for props definitions.
 * This is used to define props in a composable then override
 * default values in an implementing component.
 *
 * @example Simplified signature
 * (props: Props) => (defaults?: Record<keyof props, any>) => Props
 *
 * @example Usage
 * const makeProps = propsFactory({
 *   foo: String,
 * })
 *
 * defineComponent({
 *   props: {
 *     ...makeProps({
 *       foo: 'a',
 *     }),
 *   },
 *   setup (props) {
 *     // would be "string | undefined", now "string" because a default has been provided
 *     props.foo
 *   },
 * }
 */

/**
 *
 * @param props
 * @param source
 */
export function propsFactory<
    PropsOptions extends ComponentObjectPropsOptions
> (props: PropsOptions, source = "") {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return <Defaults extends PartialKeys<PropsOptions> = {}>(
        defaults?: Defaults
    ): AppendDefault<PropsOptions, Defaults> => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return Object.keys(props).reduce<any>((obj, prop) => {
            const isObjectDefinition = typeof props[prop] === 'object' && props[prop] != null && !Array.isArray(props[prop])
            const definition = isObjectDefinition ? props[prop] : { type: props[prop] }

            if (defaults && prop in defaults) {
                obj[prop] = {
                    ...definition,
                    default: defaults[prop],
                }
            } else {
                obj[prop] = definition
            }

            if (source && !obj[prop].source) {
                obj[prop].source = source
            }

            return obj
        }, {})
    }
}

type AppendDefault<T extends ComponentObjectPropsOptions, D extends PartialKeys<T>> = {
    [P in keyof T]-?: unknown extends D[P]
        ? T[P]
        : T[P] extends Record<string, unknown>
            ? Omit<T[P], 'type' | 'default'> & {
            type: PropType<MergeTypeDefault<T[P], D[P]>>
            default: MergeDefault<T[P], D[P]>
        }
            : {
                type: PropType<MergeTypeDefault<T[P], D[P]>>
                default: MergeDefault<T[P], D[P]>
            }
}

type MergeTypeDefault<T, D, P = InferPropType<T>> = unknown extends D
    ? P
    : (P | D)
type MergeDefault<T, D, P = InferPropType<T>> = unknown extends D
    ? P
    : (NonNullable<P> | D)

/**
 * Like `Partial<T>` but doesn't care what the value is
 */
type PartialKeys<T> = { [P in keyof T]?: unknown }

// Copied from Vue
type InferPropType<T> = [T] extends [null]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ? any // null & true would fail to infer
    : [T] extends [{ type: null | true }]
        // As TS issue https://github.com/Microsoft/TypeScript/issues/14829
        // somehow `ObjectConstructor` when inferred from { (): T } becomes `any`
        // `BooleanConstructor` when inferred from PropConstructor(with PropMethod) becomes `Boolean`
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ? any
        : [T] extends [ObjectConstructor | { type: ObjectConstructor }]
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ? Record<string, any>
            : [T] extends [BooleanConstructor | { type: BooleanConstructor }]
                ? boolean
                : [T] extends [DateConstructor | { type: DateConstructor }]
                    ? Date
                    : [T] extends [(infer U)[] | { type: (infer U)[] }]
                        ? U extends DateConstructor
                            ? Date | InferPropType<U>
                            : InferPropType<U>
                        : [T] extends [Prop<infer V, infer D>]
                            ? unknown extends V
                                ? IfAny<V, V, D>
                                : V
                            : T
