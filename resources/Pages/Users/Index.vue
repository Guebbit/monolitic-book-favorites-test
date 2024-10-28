<template>
    <Layout :currentUser="props.currentUser">
        <Head title="User List" />
        <SimplePanel
            background="https://placedog.net/1200/1000"
            overlay
            :overlay-opacity="0.95"
            content-centered
        >
            <v-container>
                <v-data-table
                    :headers="tableHeaders"
                    :items="list"
                    :items-per-page="pageSize"
                    v-model:page="pageCurrent"
                    v-model:expanded="tableExpandedRecords"
                    item-value="id"
                    show-expand
                >
                    <template v-slot:top>
                        <v-toolbar
                            flat
                        >
                            <v-toolbar-title>Lista utenti</v-toolbar-title>
                            <v-spacer></v-spacer>


                            <v-dialog
                                v-model="userDialog"
                                max-width="500px"
                            >
                                <template v-slot:activator="{ props }">
                                    <v-btn
                                        color="primary"
                                        variant="elevated"
                                        class="mr-4"
                                        v-bind="props"
                                    >
                                        New User
                                    </v-btn>
                                </template>
                                <v-card>
                                    <v-card-title class="text-h5">
                                        {{ selectedIdentifier ? "EDIT USER" : "CREATE USER" }}
                                    </v-card-title>

                                    <v-card-text>
                                        <v-row>
                                            <v-col
                                                cols="12"
                                                md="6"
                                            >
                                                <v-text-field
                                                    v-model="editUser.name"
                                                    label="User name"
                                                ></v-text-field>
                                            </v-col>
                                            <v-col
                                                cols="12"
                                                md="6"
                                            >
                                                <v-text-field
                                                    v-model="editUser.email"
                                                    label="User email"
                                                ></v-text-field>
                                            </v-col>
                                        </v-row>
                                    </v-card-text>

                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn
                                            color="primary"
                                            variant="text"
                                            @click="selectedIdentifier ? updateThisUser(selectedIdentifier) : createThisUser(); userDialog = false;"
                                        >
                                            SAVE
                                        </v-btn>
                                        <v-btn
                                            variant="text"
                                            @click="userDialog = false; editUser = { name: '', email: '' }"
                                        >
                                            CANCEL
                                        </v-btn>
                                        <v-spacer></v-spacer>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                        </v-toolbar>
                    </template>

                    <template v-slot:item.admin="{ value }">
                        <v-btn
                            v-if="value"
                            color="secondary"
                            variant="plain"
                        >
                            <font-awesome-icon size="xl" :icon="['fas', 'user-astronaut']" />
                        </v-btn>
                        <v-btn
                            v-else
                            variant="plain"
                        >
                            <font-awesome-icon size="xl"  :icon="['fas', 'user']" />
                        </v-btn>
                    </template>

                    <template v-slot:item.actions="{ item }">
                        <v-btn
                            color="primary"
                            variant="plain"
                            @click="selectedIdentifier = item.id;  userDialog = true;"
                        >
                            <font-awesome-icon :icon="['fas', 'edit']" />
                        </v-btn>
                        <v-btn
                            color="red"
                            variant="plain"
                            @click="deleteThisUser(item.id)"
                        >
                            <font-awesome-icon :icon="['fas', 'trash']" />
                        </v-btn>
                    </template>

                    <template v-slot:expanded-row="{ columns, item }">
                        <tr>
                            <td :colspan="columns.length">
                                <div class="flex flex-wrap justify-start align-center">
                                    <SimpleCard
                                        v-for="fav in item.favorites"
                                        :key="'faves-' + fav.id"
                                        :background="fav.image"
                                        overlay
                                        class="!w-[300px] !h-[150px]"
                                    >
                                        <template #content>
                                            <div class="flex justify-center align-center flex-col">
                                                <p class="text-lg">{{ fav.name }}</p>
                                                <div class="flex justify-end">
                                                    <v-btn
                                                        color="primary"
                                                        variant="tonal"
                                                        @click="() => Inertia.visit('/books/details/' + fav.id)"
                                                    >
                                                        <font-awesome-icon :icon="['fas', 'arrow-right']" />
                                                    </v-btn>
                                                </div>
                                            </div>
                                        </template>
                                    </SimpleCard>
                                </div>
                            </td>
                        </tr>
                    </template>
                </v-data-table>
            </v-container>
        </SimplePanel>
    </Layout>
</template>
<script setup lang="ts">
import { defineProps, onMounted, ref, watch, type PropType } from "vue";
import { Inertia } from "@inertiajs/inertia";
import type { IUser, ICurrentUser, IUserFor } from "@/types";
import { useI18n } from "vue-i18n";
import { useToastStore } from "@/stores/toasts";
import { useItemListComposable } from "@/composables/itemList";
import { deleteUser, updateUser, createUser } from "@/api";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
    faEdit,
    faTrash,
    faUser,
    faUserAstronaut,
    faArrowRight
} from "@fortawesome/free-solid-svg-icons";
import { Head } from "@inertiajs/vue3";
import { SimplePanel, SimpleCard } from "@/guebbit_library";
import Layout from "@/layouts/DefaultLayout.vue";

library.add(
    faEdit,
    faTrash,
    faUser,
    faUserAstronaut,
    faArrowRight
);

/**
 * Props
 */
const props = defineProps({
    currentUser: {
        type: Object as PropType<ICurrentUser>,
        required: false
    },
    users: {
        type: Array as PropType<IUser[]>,
        default: () => []
    },
});

/**
 * Data table
 */
const tableHeaders = [
    {
        text: 'name',
        value: 'name',
        align: 'start',
        sortable: true,
    },
    {
        text: 'email',
        value: 'email',
        align: 'start',
        sortable: true,
    },
    {
        text: 'Admin',
        value: 'admin',
        align: 'start',
        sortable: true
    },
    {
        text: 'Actions',
        value: 'actions',
        align: 'end',
        sortable: false
    },
];

/**
 *
 */
const userDialog = ref(false);

/**
 * Generics
 */
const { t } = useI18n();

const {
    addMessage
} = useToastStore();

/**
 * Composable that will have most of the logic
 * of all this kind of pages
 */
const {
    itemList,
    selectedIdentifier,
    selectedRecord,
    pageCurrent,
    pageSize,
    editRecord,
    deleteRecord,
    list,
} = useItemListComposable<IUser>();

/**
 *
 */
pageSize.value = 10;

/**
 *
 */
const tableExpandedRecords = ref<number[]>([]);

/**
 * If I want to edit the user
 */
const editUser = ref<IUserFor>({
    name: '',
    email: ''
});
watch(selectedRecord, () =>
    editUser.value = {
        name: selectedRecord.value?.name || '',
        email: selectedRecord.value?.email || ''
    }
);

/**
 *
 */
onMounted(() => itemList.value = props.users);

/**
 *
 */
const updateThisUser = (id: number) => {
    if(!id)
        return;
    return updateUser(id, {
        name: editUser.value.name,
        email: editUser.value.email
    })
        .then(({ message }) => {
            editRecord(id, editUser.value);
            addMessage(message);
        })
        .catch((error) => console.error(error))
}


/**
 *
 */
const createThisUser = () => {
    return createUser( {
        name: editUser.value.name,
        email: editUser.value.email
    })
        .then(({ id }) => {
            itemList.value.push({
                id,
                name: editUser.value.name,
                email: editUser.value.email,
                admin: false
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any);
            addMessage("Created user with id: " + id)
        })
        .catch((error) => console.error(error))
}

/**
 *
 * @param id
 */
const deleteThisUser = (id?: number) => {
    if(!id)
        return;
    // Delete the record and let the user know, but proceed the navigation flawlessly
    deleteRecord(id);
    // true deletion
    return deleteUser(id)
        .then(({ message }) => addMessage(message))
        .catch((error) => {
            console.error(error);
            // Easy and fast way to "rollback" for the user
            Inertia.reload();
        })
}
</script>

<style>
.g-vue-simple-panel .g-vue-panel-content {
    min-height: 100vh;
}
</style>
