import './BookCard.scss';
import { defineComponent, computed } from 'vue';

import { THEME_VAR_PREFIX, THEME_CLASS_PREFIX } from '@/guebbit_library/_vars'
import SimpleCard, { ESimpleCardVariants } from '../SimpleCard/SimpleCard'
import CardFooter from '../SimpleCard/SimpleCardFooter'
import CardActions from '../SimpleCard/SimpleCardActions'
import CardContent from '../SimpleCard/SimpleCardContent'
import CardHeader from '../SimpleCard/SimpleCardHeader'
import CardMedia from '../SimpleCard/SimpleCardMedia'

import useComponentGenerics from '@/guebbit_library/composables/componentGenerics'
import useComponentVariants from '@/guebbit_library/composables/componentVariants'
import useComponentThemes from '@/guebbit_library/composables/componentThemes'
import editSlotItems from '@/guebbit_library/utils/editSlotItems'

export default defineComponent({
    name: 'BookCard',

    extends: SimpleCard,

    props: {
        /**
         * TODO
         */
        rotation: {
            type: Number,
            default: () => 3,
            validator: (value: number) => value < 7.5,
        },

        /**
         *
         */
        cover: {
            type: String,
            required: false,
        },

        /**
         * Cover media ratio
         */
        ratio: {
            type: [Number, String],
            required: false
        },

        /**
         * on props.video only, determine video type of cover
         */
        type: {
            type: String,
            default: () => ''
        },

        /**
         * Doesn't have ratio or video, would be useless
         */
        spine: {
            type: String,
            required: false,
        },

        /**
         *
         */
        spineTitle: {
            type: String,
            required: false,
        },

        /**
         *
         */
        spineTitleTag: {
            type: String,
            default: () => "span"
        },

        /**
         * TODO
         */
        spineWidth: {
            type: String,
            default: () => '50px',
        },
    },

    setup(props, { slots, attrs }) {
        /**
         * Setup only composable
         */
        const {
            animationClasses
        } = useComponentGenerics({ props });
        const {
            styles: themeStyles
        } = useComponentThemes({ props }, THEME_VAR_PREFIX + "simple-card-");
        const {
            classes: variantsClasses
        } = useComponentVariants<ESimpleCardVariants>({
            props,
            enumItem: ESimpleCardVariants
        }, THEME_CLASS_PREFIX + "card-");

        /**
         * Aggregator of all the classes of component
         */
        const classes = computed(() => [
            ...new Set([
                THEME_CLASS_PREFIX + 'book-card',
                ...animationClasses.value,
                ...variantsClasses.value,
                props.ratio ? THEME_CLASS_PREFIX + 'card-aspect-ratio' : undefined,
                props.disabled ? THEME_CLASS_PREFIX + 'card-disabled' : undefined,
            ])
        ].filter(Boolean));

        /**
         *
         */
        const slotCover = computed(() => editSlotItems(slots.cover, {
            classes: [THEME_CLASS_PREFIX + "card-media"]
        }));;

        /**
         *
         */
        const slotSpine = computed(() => editSlotItems(slots.spine, {
            classes: [THEME_CLASS_PREFIX + "card-background"]
        }));;

        // TODO put in spine footer img\svg via prop and slot
        return () => (
            <div
                class={[attrs.class, classes.value]}
                style={{ ...attrs.style || {}, ...themeStyles.value || {} }}
                {...attrs}
            >
                <div>
                    <div class={THEME_CLASS_PREFIX + 'book-cover'}>
                        <CardHeader
                            title={props.title}
                            titleTag={props.titleTag}
                            sub={props.subtitle}
                            subTag={props.subtitleTag}
                            v-slots={{
                                actions: slots.headerActions,
                                default: slots.header,
                                sub: slots.subtitle,
                                title: slots.title,
                            }}
                        />
                        {slots.default ? slots.default() : null}
                        <CardContent
                            text={props.text}
                            tag={props.textTag}
                            v-slots={{
                                default: slots.content,
                                actions: slots.contentActions,
                            }}
                        />
                        {
                            slotCover.value.length > 0 ?
                                slotCover.value :
                                props.cover ?
                                    <CardMedia
                                        media={props.cover}
                                        ratio={props.ratio}
                                        type={
                                            props.video ?
                                                (props.type ?
                                                        props.type :
                                                        props.cover.split('.').pop()
                                                ) : undefined
                                        }
                                    />
                                    : null
                        }
                        <CardActions
                            variant="absolute"
                            v-slots={{
                                default: slots.actions,
                            }}
                        />
                        <CardFooter
                            v-slots={{
                                default: slots.footer,
                                actions: slots.footerActions,
                            }}
                        />
                    </div>
                    <div class={THEME_CLASS_PREFIX + 'book-spine'}>
                        <CardHeader
                            title={props.spineTitle || props.title}
                            titleTag={props.spineTitleTag}
                            v-slots={{
                                default: slots.spineHeader,
                            }}
                        />
                        {
                            slotSpine.value.length > 0 ?
                                slotSpine.value :
                                props.spine ?
                                    <CardMedia
                                        media={props.spine}
                                        background
                                    />
                                    : null
                        }
                        <CardFooter
                            v-slots={{
                                default: slots.spineFooter,
                            }}
                        />
                    </div>
                </div>
            </div>
        )
    }
});
