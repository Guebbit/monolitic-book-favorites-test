<template>
    <Layout>
        <Head title="Log in" />
        <SimplePanel
            background="https://placedog.net/1000/1000"
            height="100vh"
            overlay
            :overlay-opacity="0.95"
            content-centered
        >
            <SimpleCard
                class="max-w-[600px]"
                :animated="false"
                variant="flat plain"
            >
                <div v-if="status" class="mb-4 text-sm font-medium text-green-600">
                    {{ status }}
                </div>

                <v-form @submit.prevent="formSubmit">
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
                        :rules="[vuetifyRules.required]"
                        label="Password"
                        type="password"
                        required
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

                    <label class="flex items-center mt-4">
                        <v-checkbox v-model="formData.remember" label="Remember me" />
                    </label>

                    <div class="mt-4 flex items-center justify-end">
                        <v-btn
                            type="submit"
                            color="secondary"
                            class="ms-4"
                            :disabled="formData.processing"
                        >
                            Log in
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
        </SimplePanel>
    </Layout>
</template>

<script setup lang="ts">
import Layout from '@/layouts/DefaultLayout.vue'
import { ref } from "vue";
import { Head, useForm } from '@inertiajs/vue3';
import { useI18n } from 'vue-i18n'
import { SimplePanel, SimpleCard } from "@/guebbit_library";
import { z } from "zod";
import { getUuid } from "@guebbit/js-toolkit";

defineProps<{
    canResetPassword?: boolean;
    status?: string;
}>();


/**
 * Login form data
 */
const formData = useForm({
    email: 'admin@example.com',
    password: 'admin',
    remember: false,
});



/**
 * Use translation
 */
const { t } = useI18n()

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

    formData.post(route('send-login'), {
        onFinish: () => formData.reset('password'),
    });
    // Alternative method:
    // loginRequest(formData.email, formData.password)
    //     .then(() => Inertia.visit(route('book-list')))
    //     .catch((error) => console.error(error))
}
</script>
