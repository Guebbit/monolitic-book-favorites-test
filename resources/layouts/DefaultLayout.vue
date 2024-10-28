<template>
    <v-app>
        <Header :currentUser="props.currentUser" />

        <v-main style="--v-layout-top: 0;">

            <!-- Toasts -->
            <div class="fixed top-5 right-5 z-50">
                <div
                    v-for="(msg, index) in messages"
                    :key="getUuid() + index"
                    class="bg-secondary-600 p-5 mb-5 rounded shadow-lg transition-transform transform translate-y-full"
                    style="color: var(--on-secondary-600)"
                    role="alert"
                >
                    {{msg}}
                </div>
            </div>

            <!-- Page -->
            <slot />

            <Footer />
        </v-main>

        <transition name="fade">
            <CoreLoading v-show="loadings.core" />
        </transition>

        <SideLoading
            v-show="isLoading"
        />
    </v-app>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { onMounted, defineProps, type PropType } from "vue";
import type { ICurrentUser } from "@/types";
import { useCoreStore } from "@/stores/core";
import { useToastStore } from "@/stores/toasts";
import CoreLoading from "@/components/atoms/CoreLoading.vue";
import SideLoading from "@/components/atoms/SideLoading.vue";
import Header from "@/components/organisms/Header.vue";
import Footer from "@/components/organisms/Footer.vue";
import { getUuid } from "@guebbit/js-toolkit";

/**
 * Props
 */
const props = defineProps({
    currentUser: {
        type: Object as PropType<ICurrentUser>,
        required: false
    }
});

/**
 * core loadings
 */
const {
    setLoading
} = useCoreStore();
const {
    // for single loadings
    loadings,
    // for all loadings
    isLoading
} = storeToRefs(useCoreStore());

const {
    messages
} = storeToRefs(useToastStore());

setLoading('core', true);
// TODO implement in inertia
onMounted(() => setLoading('core', false))
</script>
