<template>
    <div class="core-loading">
        <div class="g-vue-book-side-load g-vue-animate-active">
            <div class="g-vue-book">
                <div></div>
                <div></div>
                <div></div>
            </div>
            <ul class="g-vue-pages">
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
            </ul>
        </div>
    </div>
</template>

<style lang="scss">
@use "@/assets/styles/variables" as vars;
@use "@guebbit/css-ui/src/atoms/animations/BookSideLoad" with (
    $css-ui-dark-theme-class: vars.$css-ui-dark-theme-class,
    $css-ui-var-prefix: vars.$css-ui-var-prefix,
    $css-ui-class-prefix: vars.$css-ui-class-prefix,
    $css-ui-root-prefix: vars.$css-ui-root-prefix
);

.core-loading {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
    background: var(--body-background-color);
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
<script setup lang="ts">
</script>
