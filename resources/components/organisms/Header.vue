<template>
    <v-navigation-drawer
        id="main-navigation-drawer"
        v-model="mobileMenuDrawer"
        temporary
    >
        <v-list v-if="props.currentUser">
            <v-list-item
                min-height="100"
                :title="props.currentUser.name"
                :subtitle="props.currentUser.email"
            />
        </v-list>

        <v-divider/>

        <v-list nav density="compact">
            <v-list-item
                v-for="item in menuList"
                v-show="
                    !item.authentication ||
                    (item.authentication && !item.admin && props.currentUser) ||
                    (item.authentication && item.admin && props.currentUser && props.currentUser.admin)"
                :key="'desktop-navigation-' + item.label"
                min-height="60"
                @click="() => Inertia.visit(item.route)"
                :active="item.route === $page.url"
            >
                <template v-slot:prepend>
                    <font-awesome-icon class="v-icon ml-3" :icon="item.icon"/>
                </template>
                <v-list-item-title>
                    {{ item.label }}
                </v-list-item-title>
            </v-list-item>
        </v-list>

        <template v-slot:prepend>
            <template v-if="!props.currentUser">
                <v-btn
                    v-show="$page.url !== '/login'"
                    block
                    size="x-large"
                    @click="() => Inertia.visit('/login')"
                >
                    {{ t('generic.login') }}
                    <font-awesome-icon class="ml-5" :icon="['fas', 'right-to-bracket']"/>
                </v-btn>
                <v-btn
                    v-show="$page.url !== '/register'"
                    block
                    size="x-large"
                    @click="() => Inertia.visit('/register')"
                >
                    {{ t('generic.register') }}
                    <font-awesome-icon class="ml-5" :icon="['fas', 'right-to-bracket']"/>
                </v-btn>
            </template>
            <v-btn
                v-else
                block
                size="x-large"
                @click="() => Inertia.visit('/logout')"
            >
                {{ t('generic.logout') }}
                <font-awesome-icon class="ml-5" :icon="['fas', 'door-open']"/>
            </v-btn>
            <v-divider />
        </template>
    </v-navigation-drawer>

    <v-app-bar
        ref="navigationBar"
        id="main-navigation-bar"
        class="ghost-mode"
    >
        <template v-slot:prepend>
            <Link href="/" >
                <GuebbitLogo
                    :alt="t('generic.name')"
                    height="64"
                    class="pa-3"
                />
            </Link>
        </template>

        <v-toolbar-title>{{ t('website.title') }}</v-toolbar-title>

        <v-toolbar-items class="!hidden xl:!flex">
            <v-btn
                v-for="item in menuList"
                v-show="!item.authentication || (item.authentication && props.currentUser || !item.authentication && !props.currentUser)"
                @click="() => Inertia.visit(item.route)"
                :active="item.route === $page.url"
            >
                {{ item.label }}
                <font-awesome-icon class="ml-5" :icon="item.icon"/>
            </v-btn>
        </v-toolbar-items>

        <template v-slot:append>
            <template v-if="!props.currentUser">
                <v-btn
                    v-if="$page.url !== '/login'"
                    variant="outlined"
                    type="light"
                    class="!hidden xl:!flex mx-5"
                    @click="() => Inertia.visit('/login')"
                >
                    {{ t('generic.login') }}
                    <font-awesome-icon class="ml-5" :icon="['fas', 'right-to-bracket']"/>
                </v-btn>
                <v-btn
                    v-if="$page.url !== '/register'"
                    variant="outlined"
                    type="light"
                    class="!hidden xl:!flex mx-5"
                    @click="() => Inertia.visit('/register')"
                >
                    {{ t('generic.register') }}
                    <font-awesome-icon class="ml-5" :icon="['fas', 'right-to-bracket']"/>
                </v-btn>
            </template>
            <v-btn
                v-else
                variant="outlined"
                type="light"
                class="!hidden xl:!flex mx-5"
                @click="() => Inertia.visit('/logout')"
            >
                {{ t('generic.logout') }}
                <font-awesome-icon class="ml-5" :icon="['fas', 'door-open']"/>
            </v-btn>
            <v-divider />

            <v-btn
                class="button-toggle-drawer"
                size="x-large"
                color="secondary"
                icon
                @click="mobileMenuDrawer = !mobileMenuDrawer"
            >
                <font-awesome-icon size="xl" :icon="['fas', 'bars']"/>
            </v-btn>
        </template>
    </v-app-bar>
</template>

<script setup lang="ts">
import { Link } from '@inertiajs/inertia-vue3';
import { Inertia } from '@inertiajs/inertia';
import { defineProps, ref, onMounted, PropType } from "vue";
import { useI18n } from "vue-i18n";
import GuebbitLogo from "../../../public/images/guebbit-logo-colored.svg";
import type { ICurrentUser } from "@/types";

/**
 * Icons
 */
import {library} from "@fortawesome/fontawesome-svg-core";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {
    faBars,
    faHouse,
    faRightToBracket,
    faRightFromBracket,
    faDoorOpen,
    faBook,
    faBookOpen,
    faUser,
    faUsers
} from "@fortawesome/free-solid-svg-icons";
import { shyel, scrollClass } from "@guebbit/js-toolkit-scroll";
library.add(
    faBars,
    faHouse,
    faRightToBracket,
    faRightFromBracket,
    faDoorOpen,
    faBook,
    faBookOpen,
    faUser,
    faUsers
);

/**
 * Generics
 */
const { t } = useI18n();

/**
 * Props
 */
const props = defineProps({
    currentUser: {
        type: Object as PropType<ICurrentUser>,
        required: false
    },
})

/**
 * Menu drawers switch
 */
const mobileMenuDrawer = ref(false);

/**
 * Shy scroll for header
 */
const navigationBar = ref<{ $el: HTMLElement } | null>(null);
onMounted(() => {
    if(!navigationBar.value?.$el)
        return;
    shyel(navigationBar.value.$el, 100)
    scrollClass(navigationBar.value.$el, [
        {
            class: "ghost-mode",
            scroll: 400,
            remove: true
        }
    ])
});



/**
 * Menu
 */
const menuList = [
    {
        label: t('navigation.books-label'),
        route: "/books",
        icon: ['fas', 'book'],
    },
    {
        label: t('navigation.profile-label'),
        route: "/profile",
        icon: ['fas', 'user'],
        authentication: true
    },
    {
        label: t('navigation.admin-users-label'),
        route: "/users",
        icon: ['fas', 'users'],
        authentication: true,
        admin: true
    }
];
</script>

<style lang="scss">
#main-navigation-bar {
    transition: background 0.2s, top 0.2s;

    .inclined-button {
        margin-top: 0;
        margin-bottom: 0;
    }

    .button-toggle-drawer {
        margin-inline-end: 0;
    }

    .v-toolbar__prepend,
    .v-toolbar__append {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    &.ghost-mode {
        background: transparent !important;
        box-shadow: none !important;
    }

    @media (min-width: theme('screens.xl')) {
        .button-toggle-drawer {
            display: none;
        }
    }

    @media (max-width: theme('screens.xl')) {
        // mobile ghost mode
        background: transparent !important;
        box-shadow: none !important;
    }
}
</style>
