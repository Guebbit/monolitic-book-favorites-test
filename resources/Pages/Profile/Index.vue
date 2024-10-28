<template>
    <Layout :currentUser="props.currentUser">
        <Head title="Profile" />
        <SimplePanel
            background="https://placedog.net/1000/1000"
            overlay
            :overlay-opacity="0.95"
            content-centered
        >
            <v-container class="!py-64">
                <h1 class="theme-page-title mb-10">Profilo</h1>
                <SimpleCard
                    class="max-w-[600px] mx-auto mb-64"
                    :animated="false"
                    variant="flat plain"
                >
                    <v-form @submit.prevent="formSubmit">
                        <v-text-field
                            v-model="formData.name"
                            :rules="[vuetifyRules.required]"
                            label="Username"
                            required
                        />

                        <v-messages v-if="formData.errors.name && formData.errors.name.length > 0">
                            <template
                                v-for="(error, index) in formData.errors.name"
                                :key="'error-' + index + getUuid()"
                            >
                                <v-message color="error">
                                    {{ error }}
                                </v-message>
                            </template>
                        </v-messages>


                        <v-text-field
                            v-model="formData.email"
                            :rules="[vuetifyRules.required]"
                            label="Email"
                            type="email"
                            required
                        />

                        <v-messages v-if="formData.errors.email && formData.errors.email.length > 0">
                            <template
                                v-for="(error, index) in formData.errors.email"
                                :key="'error-' + index + getUuid()"
                            >
                                <v-message color="error">
                                    {{ error }}
                                </v-message>
                            </template>
                        </v-messages>

                        <v-text-field
                            class="mt-5"
                            v-model="formData.password"
                            label="Password"
                            type="password"
                        />

                        <v-messages v-if="formData.errors.password && formData.errors.password.length > 0">
                            <template
                                v-for="(error, index) in formData.errors.password"
                                :key="'error-' + index + getUuid()"
                            >
                                <v-message color="error">
                                    {{ error }}
                                </v-message>
                            </template>
                        </v-messages>

                        <div class="mt-4 flex items-center justify-between">
                            <v-btn
                                variant="elevated"
                                color="red"
                                class="ms-4"
                                :disabled="formData.processing"
                                @click="deleteProfile"
                            >
                                Delete profile
                            </v-btn>
                            <v-btn
                                type="submit"
                                color="secondary"
                                class="ms-4"
                                :disabled="formData.processing"
                            >
                                Save data
                            </v-btn>
                        </div>
                    </v-form>

                    <v-alert
                        v-for="(error, index) in zodErrors"
                        :key="'zod-' + index + getUuid()"
                        color="red"
                        shaped
                        type="error"
                    >
                        {{ error }}
                    </v-alert>
                </SimpleCard>


                <h1 v-show="favoriteList.length > 0" class="theme-page-title with-border mb-10">Lista preferiti</h1>
                <v-row
                    v-show="favoriteList.length > 0"
                    class="w-100"
                    justify="center"
                    align="center"
                >
                    <v-col
                        v-for="book in favoriteList"
                        :key="'book-card-' + book.id"
                        cols="6" lg="4" xl="3"
                        class="pa-10"
                    >
                        <BookCard
                            :title="book.name"
                            :cover="book.image"
                            :spine="book.image"
                            ratio="4/6"
                        >
                            <template #title>
                                <v-btn color="secondary">{{ book.genre }}</v-btn>
                                <h3 class="g-vue-card-title">{{ book.name }}</h3>
                            </template>
                        </BookCard>
                        <div class="flex flex-wrap align-center justify-center">
                            <v-btn
                                v-show="props.currentUser"
                                color="secondary"
                                variant="tonal"
                                class="rounded-full"
                                :active="true"
                                @click="removeFavorite(book.id)"
                            >
                                {{ t("page-list-books.remove-from-favorites") }}
                                <font-awesome-icon class="ml-3" :icon="['fas', 'heart']" />
                            </v-btn>

                            <v-btn
                                variant="plain"
                                class="ma-2"
                                @click="() => Inertia.visit('/books/details/' + book.id)"
                            >
                                {{ t("generic.more-info") }}
                                <font-awesome-icon class="ml-3" :icon="['fas', 'arrow-right']" />
                            </v-btn>
                        </div>
                    </v-col>

                </v-row>
            </v-container>
        </SimplePanel>
    </Layout>
</template>


<script lang="ts">
export default {
    name: 'BookPage'
}
</script>


<script setup lang="ts">
import { Inertia } from '@inertiajs/inertia';
import { Head, useForm } from '@inertiajs/vue3';
import {defineProps, onMounted, ref, type PropType} from "vue";
import {useI18n} from "vue-i18n";
import { useToastStore } from "@/stores/toasts";
import Layout from '@/layouts/DefaultLayout.vue'
import type { IBook, ICurrentUser } from "@/types";
import { getUuid } from "@guebbit/js-toolkit";
import { BookCard, SimpleCard, SimplePanel } from "@/guebbit_library";
import { z } from "zod";
import { putToggleFavorite, updateUser, deleteUser } from "@/api";

import {library} from "@fortawesome/fontawesome-svg-core";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {
    faHeart,
    faEdit,
    faBook,
    faArrowRight,
    faTrash,
} from "@fortawesome/free-solid-svg-icons";
library.add(
    faHeart,
    faEdit,
    faBook,
    faArrowRight,
    faTrash,
);

/**
 * Props
 */
const props = defineProps({
    currentUser: {
        type: Object as PropType<ICurrentUser>,
        required: false
    },
    favorites: {
        type: Array as PropType<IBook[]>,
        default: () => []
    },
})

/**
 * Generics
 */
const { t } = useI18n();

const {
    addMessage
} = useToastStore();


/**
 * Remove book from favorites.
 * There is no need for the server to be reloaded to update the favorite list.
 * (TODO connection error = rollback)
 */
const favoriteList = ref<IBook[]>([]);
const removeFavorite = (id: number) => {
    favoriteList.value = favoriteList.value
        .filter(favorite => favorite.id !== id);
    return putToggleFavorite(id)
        .then(({ message }) => addMessage(message))
        .catch((error) => addMessage("An error occurred, retry"))
};


/**
 * User form data
 */
const formData = useForm({
    name: props.currentUser?.name || '',
    email: props.currentUser?.email || '',
    password: '',
});

/**
 * Form regular rules (could've used zod here too)
 */
const vuetifyRules = {
    required: (value: string) => !!value || t('generic.field-is-required'),
    email: (value: string) => /.+@.+\..+/.test(value) || t('generic.field-is-required'),
};

/**
 * Zod
 */
const zodErrors = ref<string[]>([])
const zodSchema = z.object({
    email: z
        .string({
            required_error: t('generic.field-is-required', { field: 'Email' }),
        })
        .email("Email non valida"),
    password: z
        .string({
            required_error: t('generic.field-is-required', { field: 'Password' }),
        })
        .min(5, "Password di almeno 5 caratteri"),
});


/**
 * Submit
 */
const formSubmit = () => {
    zodErrors.value = [];
    const parseResult = zodSchema.safeParse(formData);
    if (!parseResult.success)
        zodErrors.value = parseResult.error.errors.reduce((errorArray, { message }) => {
            errorArray.push(message);
            return errorArray;
        }, [] as string[]);

    if(zodErrors.value.length > 0)
        return;

    updateUser(props.currentUser?.id || "", formData.data())
        .then(({ message }) => addMessage(message))
        .catch((error) => {
            resetForm();
            console.error(error)
        })
}

/**
 * Reset form
 */
const resetForm = () => formData.reset();

/**
 *
 */
const deleteProfile = () => {
    if(!props.currentUser?.id)
        return;
    return deleteUser(props.currentUser?.id)
        .then(() => Inertia.visit('/logout'))
        .catch((error) => console.error(error))
}

/**
 *
 */
onMounted(() => favoriteList.value = [...props.favorites]);
</script>

<style>
.g-vue-simple-panel .g-vue-panel-content {
    min-height: 100vh;
}
</style>
