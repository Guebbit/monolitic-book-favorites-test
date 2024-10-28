<template>
    <Layout :currentUser="props.currentUser">
        <Head title="Book Details" />
        <BookDetailsPage
            v-if="props.book || editMode"
            class="md:text-center"
            :book="{
                ...formData.data(),
                id: props.book?.id || 0,
                price: parseFloat(formData.data()?.price),
            }"
            :currentUser="props.currentUser"
        >

            <SimpleCard
                v-show="editMode"
                class="max-w-[600px] mx-auto mt-10"
                :animated="false"
                variant="transparent blurred"
            >
                <v-form @submit.prevent="formSubmit">
                    <v-text-field
                        v-model="formData.name"
                        :rules="[vuetifyRules.required]"
                        label="Title of book"
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
                        v-model="formData.description"
                        label="Description"
                    />

                    <v-text-field
                        v-model="formData.image"
                        label="Image URL"
                        hide-details
                    />

                    <div class="flex items-center justify-between">
                        <div class="w-full mt-4">
                            <v-text-field
                                v-model="formData.price"
                                :rules="[vuetifyRules.required]"
                                label="Price of book"
                                type="text"
                                required
                            />
                            <v-messages v-if="formData.errors.price && formData.errors.price.length > 0">
                                <template
                                    v-for="(error, index) in formData.errors.price"
                                    :key="'error-' + index + getUuid()"
                                >
                                    <v-message color="error">
                                        {{ error }}
                                    </v-message>
                                </template>
                            </v-messages>
                        </div>

                        <div class="flex items-center justify-end">
                            <v-btn
                                type="submit"
                                color="secondary"
                                class="ms-4"
                                :disabled="formData.processing"
                            >
                                Save
                            </v-btn>

                            <v-btn
                                variant="plain"
                                class="ms-4"
                                :disabled="formData.processing"
                                @click="resetForm"
                            >
                                Reset
                            </v-btn>
                        </div>
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

            <template #actions>
                <v-btn
                    v-if="props.currentUser && !editMode"
                    color="primary"
                    variant="tonal"
                    class="rounded-full"
                >
                    {{ t("page-list-books.add-to-favorites") }}
                    <font-awesome-icon class="ml-3" :icon="['fas', 'heart']"/>
                </v-btn>

                <v-btn
                    variant="plain"
                    class="ma-2"
                    @click="() => Inertia.visit('/books/')"
                >
                    {{ t('navigation.book-list-label') }}
                    <font-awesome-icon class="ml-3" :icon="['fas', 'book']"/>
                </v-btn>

                <v-btn
                    v-show="props.currentUser && props.currentUser.admin && !props.create"
                    variant="plain"
                    class="ma-2"
                    @click="editMode = !editMode"
                >
                    {{ t("page-list-books.button-edit") }}
                    <font-awesome-icon class="ml-3" :icon="['fas', 'edit']" />
                </v-btn>

                <v-btn
                    v-show="props.currentUser && props.currentUser.admin && !props.create"
                    color="red"
                    variant="plain"
                    class="ma-2"
                    @click="deleteCurrentBook()"
                >
                    {{ t("page-list-books.button-delete") }}
                    <font-awesome-icon class="ml-3" :icon="['fas', 'trash']" />
                </v-btn>
            </template>
        </BookDetailsPage>

        <ErrorPanel v-else>
            {{ t('generic.not-found') }}
        </ErrorPanel>
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
import BookDetailsPage from "@/components/organisms/BookDetailsPage.vue";
import Layout from '@/layouts/DefaultLayout.vue'
import type {IBook, ICurrentUser} from "@/types";
import { getUuid } from "@guebbit/js-toolkit";
import { SimpleCard } from "@/guebbit_library";
import ErrorPanel from "@/components/organisms/ErrorPanel.vue";
import { z } from "zod";
import { updateBook, createBook, deleteBook } from "@/api";

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
    book: {
        type: Object as PropType<IBook | undefined>,
        required: false
    },
    create: {
        type: Boolean,
        default: () => false
    },
    edit: {
        type: Boolean,
        default: () => false
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
 * Edit mode, through API
 */
const editMode = ref(false);
onMounted(() => editMode.value = props.edit || props.create);

/**
 * Form data
 */
const formData = useForm({
    name: props.book?.name || '',
    description: props.book?.description || '',
    image: props.book?.image || '',
    genre: props.book?.genre || '',
    price: props.book?.price.toString() || '',
});

/**
 * Reset form
 */
const resetForm = () => formData.reset();

/**
 * Form regular rules (could've used zod here too)
 */
const vuetifyRules = {
    required: (value: string) => !!value || t('generic.field-is-required'),
};

/**
 * Zod
 */
const zodErrors = ref<string[]>([])
const zodSchema = z.object({
    name: z
        .string({
            required_error: t('generic.field-is-required', { field: 'Name' }),
        }).min(1),
    price: z
        .string({
            required_error: t('generic.field-is-required', { field: 'Price' }),
        }).min(1),
});


/**
 * Submit
 */
const formSubmit = () => {
    zodErrors.value = [];
    const parseResult = zodSchema.safeParse(formData);

    /**
     * Check for errors
     */
    if (!parseResult.success)
        zodErrors.value = parseResult.error.errors.reduce((errorArray, { message }) => {
            errorArray.push(message);
            return errorArray;
        }, [] as string[]);

    if(zodErrors.value.length > 0)
        return;

    const translateFormData = {
        ...formData.data(),
        price: parseFloat(formData.data().price)
    };

    /**
     * Send data through api
     */
    if(props.edit)
        updateBook(props.book?.id || "", translateFormData)
            .then(({ message }) => addMessage(message))
            .catch((error) => {
                resetForm();
                console.error(error)
            })

    else if(props.create)
        createBook(translateFormData)
            .then(({ id }) => addMessage("Created book with id: " + id))
            .catch((error) => console.error(error))
            // Ready to create new books
            .finally(resetForm)
}

/**
 * Delete book
 */
const deleteCurrentBook = () => {
    if(!props.book?.id)
        return;
    return deleteBook(props.book?.id)
        .then(({ message }) => Inertia.visit('/books/'))
        .catch((error) => console.error(error))
}
</script>

<style>
.comic-panel .g-vue-panel-content {
    min-height: 100vh;
}
</style>
