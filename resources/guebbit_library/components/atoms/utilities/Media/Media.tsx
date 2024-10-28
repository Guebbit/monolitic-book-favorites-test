import './Media.scss'
import { defineComponent, onMounted, ref, computed, watch } from 'vue'
import type { PropType } from 'vue'

export enum EMediaTypes {
    IMAGE = 'image',
    IFRAME = 'iframe',
    COLOR = 'color',
    CSS = 'css',
}

/**
 * Component
 */
export default defineComponent({
    name: 'Media',
    props: {

        /**
         * url/path to media
         */
        media: {
            type: String,
            required: true
        },

        /**
         * Background type
         * Background can be an image, a video, an iframe or a color
         * In case of VIDEO, the type is the codec (es: mp4)
         * In case of CSS, it an image that will be used on background-image
         */
        type: {
            type: String as PropType<EMediaTypes | string>,
            default: EMediaTypes.IMAGE
        },

        /**
         * Can be fixed
         */
        height: {
            type: [Number, String],
            required: false
        },

        /**
         * Can be fixed
         */
        width: {
            type: [Number, String],
            required: false
        },

        /**
         * If the thumbnail and lazy are set,
         * we are gonna use the thumbnail and lazyload the correct media later
         *
         * If lazyload is set but thumbnail not: native lazyload (image only)
         *
         * Otherwise, it's the video's poster
         */
        thumbnail: {
            type: String,
            required: false
        },

        /**
         * Activate lazyload.
         */
        lazy: {
            type: Boolean,
            default: false
        },

        /**
         * Class that will be set after
         * a successful lazyload
         */
        loadedClass: {
            type: String,
            default: 'loaded'
        },

        /**
         * Title TAG
         */
        title: {
            type: String,
            default: ''
        },

        /**
         * Alt TAG
         */
        alt: {
            type: String,
            default: ''
        }
    },

    setup(props, { attrs }) {

        /**
         * Allow numbers (pixels) and regula css strings
         */
        const computedWidth = computed(() => {
            if (!props.width)
                return;
            return typeof props.width === 'number' ? `${props.width}px` : props.width;
        })

        /**
         * Allow numbers (pixels) and regula css strings
         */
        const computedHeight = computed(() => {
            if (!props.height)
                return
            return typeof props.height === 'number' ? `${props.height}px` : props.height
        })

        /**
         *
         */
        const styles = computed(() => {
            return {
                width: computedWidth.value,
                height: computedHeight.value
            }
        })

        /**
         *
         */
        const mediaRef = ref<HTMLElement | null>(null)

        watch(mediaRef, () => {
            if (!mediaRef.value || mediaRef.value.tagName !== "VIDEO")
                return;
            (mediaRef.value as HTMLVideoElement).load();
            (mediaRef.value as HTMLVideoElement).play();
        });

        /**
         * Generic function to apply observer
         * @param el
         * @param intersectCallback
         */
        const _observerHelper = <T extends Element>(el: T | null, intersectCallback: (el: T) => void) => {
            // no lazyload or element: observer is useless
            if (!props.lazy || !el)
                return
            const observer = new IntersectionObserver((entries) => {
                if (!entries[0].isIntersecting)
                    return
                intersectCallback(entries[0].target as T)
                observer.disconnect()
            })
            observer.observe(el)
        }

        /**
         * Detect which ref is NOT null and, if lazyload is required, it is initiated on mount
         * WARNING: EMediaTypes.COLOR doesn't have a lazyload
         */
        onMounted(() => {
            if(!props.lazy || !mediaRef.value)
                return;
            switch (props.type) {
                case EMediaTypes.IMAGE:
                    return _observerHelper<HTMLImageElement>(mediaRef.value as HTMLImageElement, (target) => {
                        target.src = props.media
                        target.classList.add(props.loadedClass)
                    })
                case EMediaTypes.CSS:
                    return _observerHelper<HTMLElement>(mediaRef.value, (target) => {
                        target.style.backgroundImage = `url('${props.media}')`
                        target.classList.add(props.loadedClass)
                    })
                case EMediaTypes.IFRAME:
                    return _observerHelper<HTMLIFrameElement>(mediaRef.value as HTMLIFrameElement, (target) => {
                        target.src = props.media
                        target.classList.add(props.loadedClass)
                    })
                case EMediaTypes.COLOR:
                    return;
                default:
                    // generic string can only be video
                    return _observerHelper<HTMLVideoElement>(mediaRef.value as HTMLVideoElement, (video) => {
                        const source = video.firstElementChild as HTMLSourceElement | null
                        if (!source || (video.currentTime > 0 && !video.paused && !video.ended && video.readyState > 2))
                            return
                        source.src = props.media
                        video.onloadeddata = function() {
                            video.classList.add(props.loadedClass)
                        }
                        video.load()
                        video.classList.add(props.loadedClass)
                    })
            };
        });

        /**
         * Render media based on type
         */
        const element = computed(() => {
            switch (props.type) {
                case EMediaTypes.IMAGE:
                    return <img
                        ref={mediaRef}
                        src={props.lazy ? props.thumbnail : props.media}
                        alt={props.alt}
                        title={props.title}
                        style={styles.value}
                        {...attrs}
                    />
                case EMediaTypes.COLOR:
                    return <div
                        style={{
                            ...styles.value,
                            backgroundColor: props.media
                        }}
                        {...attrs}
                    />
                case EMediaTypes.CSS:
                    return <div
                        ref={mediaRef}
                        style={{
                            ...styles.value,
                            backgroundImage: props.lazy && props.thumbnail ? `url('${props.thumbnail}')` : `url('${props.media}')`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center',
                            backgroundSize: 'cover'
                        }}
                        aria-label={props.title}
                        aria-details={props.alt}
                        {...attrs}
                    />
                case EMediaTypes.IFRAME:
                    return <div
                        style={{
                            position: 'relative',
                            height: props.height,
                            width: props.width
                        }}
                        {...attrs}
                    >
                        <iframe
                            ref={mediaRef}
                            src={props.lazy ? undefined : props.media}
                            allowfullscreen
                            title={props.title}
                        />
                    </div>
                default:
                    // since there are a lot of types that can go in "<source>" (the codecs),
                    // string is accepted as props.type and it indicates the video
                    return <video
                        ref={mediaRef}
                        style={styles.value}
                        preload="metadata"
                        playsinline
                        muted
                        loop
                        autoplay
                        poster={props.thumbnail}
                        title={props.title}
                        {...attrs}
                    >
                        <source src={props.lazy ? undefined : props.media} type={props.type} />
                    </video>
            }
        });

        //
        return () => element.value
    }
})
