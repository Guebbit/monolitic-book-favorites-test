<template>
  <Layout
    id="book-list-page"
    :currentUser="props.currentUser"
  >
    <Head title="Book List" />
    <v-container class="page-controls apply-content-padding">
      <v-row align="center">

        <v-col cols="12" lg="4" xl="3">
          <v-text-field
            v-model="searchByTitle"
            :label="t('generic.search', { field: 'titolo' })"
            variant="solo"
            hide-details
            @keydown.enter="performSearch"
          >

            <template v-slot:prepend-inner>
              <font-awesome-icon
                class="v-icon v-icon--size-default v-icon--start cursor-pointer"
                :icon="['fas', 'magnifying-glass']"
              />
            </template>

            <template v-slot:append-inner>
              <v-btn
                color="secondary"
                v-if="searchByTitle.length > 2"
                variant="outlined"
                @click="performSearch"
              >
                <font-awesome-icon :icon="['fas', 'play']" />
              </v-btn>
            </template>

          </v-text-field>
        </v-col>

        <v-col cols="12" lg="4" xl="3">
          <v-text-field
            v-model="searchByText"
            :label="t('generic.search', { field: 'descrizione' })"
            variant="solo"
            hide-details
            @keydown.enter="performSearch"
          >

            <template v-slot:prepend-inner>
              <font-awesome-icon
                class="v-icon v-icon--size-default v-icon--start cursor-pointer"
                :icon="['fas', 'magnifying-glass']"
              />
            </template>

            <template v-slot:append-inner>
              <v-btn
                color="secondary"
                v-if="searchByText.length > 2"
                variant="outlined"
                @click="performSearch"
              >
                <font-awesome-icon :icon="['fas', 'play']" />
              </v-btn>
            </template>

          </v-text-field>
        </v-col>

        <v-col cols="12" lg="4" xl="6">
          <v-select
            v-model="searchByGenres"
            :items="props.genres"
            :label="t('page-list-books.filter-label-genre')"
            multiple
            hide-details
          >
            <template v-slot:prepend-inner>
              <font-awesome-icon
                class="v-icon v-icon--size-default v-icon--start cursor-pointer"
                :icon="['fas', 'tags']"
              />
            </template>
            <template v-slot:append-inner>
              <v-btn
                color="secondary"
                v-if="searchByGenres.length > 0"
                variant="outlined"
                @click="performSearch"
              >
                <font-awesome-icon :icon="['fas', 'play']" />
              </v-btn>
            </template>
          </v-select>
        </v-col>

        <v-col cols="12" class="flex justify-between align-center">
          <v-btn
            variant="flat"
            size="x-large"
            @click="toggleSort"
          >
            <font-awesome-icon
              :icon="sortersNameMode === 0 ?
											['fas', 'sort'] :
											sortersNameMode === 1 ?
											['fas', 'sort-up'] :
											['fas', 'sort-down']"
            />
            <span class="hidden lg:block ml-3">Nome</span>
          </v-btn>

          <div class="flex justify-center">
            <v-btn-toggle
              v-model="searchByGenres"
              class="flex-wrap justify-end"
              selected-class="bg-primary"
              multiple
            >
              <v-btn
                v-for="genre in props.genres"
                :key="genre + '-button'"
                :value="genre"
                class="px-6 py-4 rounded-0"
              >
                <span class="hidden-md-and-down mr-3">
                  {{ genre }}
                </span>
                <!-- TODO personalized icon -->
                <font-awesome-icon size="xl" :icon="['fas', 'book-open']" />
              </v-btn>
            </v-btn-toggle>
          </div>

          <v-btn
            variant="flat"
            size="x-large"
            @click="resetFilters()"
          >
            <font-awesome-icon
              :icon="['fas', 'eraser']"
            />
            <span class="hidden lg:block ml-3">{{ t("generic.reset") }}</span>
          </v-btn>
        </v-col>
      </v-row>

      <v-row align="center">
        <v-col cols="12" lg="8" xl="10" class="flex">
          <v-pagination
            v-show="pageTotal > 1"
            v-model="pageCurrent"
            :length="pageTotal"
          />
        </v-col>

        <v-col cols="12" lg="4" xl="2">
          <v-card
            class="d-flex align-center pa-3"
            variant="outlined"
            @click="modeVisualization === undefined ?
										modeVisualization = 2 :
											modeVisualization >= 3 ?
												modeVisualization = 1 :
												modeVisualization++"
          >
            <div class="flex-grow-1 text-center">
              <font-awesome-icon
                size="2x"
                :icon="!modeVisualization || modeVisualization === 1 ?
											['fas', 'panorama'] :
											modeVisualization === 2 ?
											['fas', 'grip'] :
											['fas', 'list']"
              />
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <template v-if="list.length > 0">
      <div v-if="modeVisualization === 1"
           class="book-list-details"
      >
        <BookDetailsPage
          v-for="book in list"
          :key="'book-panel-' + book.id"
          :book="book"
          :currentUser="props.currentUser"
        >
          <template #actions>
            <v-btn
              v-show="props.currentUser"
              :color="favoriteList.includes(book.id) ? 'secondary' : 'primary'"
              variant="tonal"
              class="rounded-full"
              :active="favoriteList.includes(book.id)"
              @click="toggleFavorite(book.id)"
            >
              {{ favoriteList.includes(book.id) ? t("page-list-books.remove-from-favorites") : t("page-list-books.add-to-favorites") }}
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

            <v-btn
              v-show="props.currentUser && props.currentUser.admin"
              variant="plain"
              class="ma-2"
              @click="() => Inertia.visit('/books/edit/' + book.id)"
            >
              {{ t("page-list-books.button-edit") }}
              <font-awesome-icon class="ml-3" :icon="['fas', 'edit']" />
            </v-btn>

            <v-btn
              v-show="props.currentUser && props.currentUser.admin"
              color="red"
              variant="plain"
              class="ma-2"
              @click="deleteThisBook(book.id)"
            >
              {{ t("page-list-books.button-delete") }}
              <font-awesome-icon class="ml-3" :icon="['fas', 'trash']" />
            </v-btn>
          </template>
        </BookDetailsPage>
      </div>

      <v-container v-if="modeVisualization === 2">
        <v-row
          class="book-list-masonry"
          justify="center"
          align="center"
        >

          <v-col
            v-for="book in list"
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
                :color="favoriteList.includes(book.id) ? 'secondary' : 'primary'"
                variant="tonal"
                class="rounded-full"
                :active="favoriteList.includes(book.id)"
                @click="toggleFavorite(book.id)"
              >
                {{ favoriteList.includes(book.id) ? t("page-list-books.remove-from-favorites") : t("page-list-books.add-to-favorites") }}
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

              <div>
                <v-btn
                  v-show="props.currentUser && props.currentUser.admin"
                  variant="plain"
                  class="ma-2"
                  @click="() => Inertia.visit('/books/edit/' + book.id)"
                >
                  <font-awesome-icon class="ml-3" :icon="['fas', 'edit']" />
                </v-btn>

                <v-btn
                  v-show="props.currentUser && props.currentUser.admin"
                  color="red"
                  variant="plain"
                  class="ma-2"
                  @click="deleteThisBook(book.id)"
                >
                  <font-awesome-icon :icon="['fas', 'trash']" />
                </v-btn>
              </div>
            </div>
          </v-col>

        </v-row>
      </v-container>

      <v-container v-if="modeVisualization === 3">
        <v-list class="book-list-simple bg-transparent">
          <v-list-item
            v-for="book in list"
            :key="'book-list-' + book.id"
            class="py-5"
          >
            <template v-slot:prepend>
              <v-avatar
                size="100"
                rounded
              >
                <v-img
                  :src="book.image"
                />
              </v-avatar>
            </template>
            <v-list-item-title>
              <b>{{ book.name }}</b>
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ book.genre }}
            </v-list-item-subtitle>
            <v-list-item-content>
              <small>{{ book.description }}</small>

              <div class="flex flex-wrap align-center justify-center">
                <v-btn
                  v-show="props.currentUser"
                  :color="favoriteList.includes(book.id) ? 'secondary' : 'primary'"
                  variant="tonal"
                  class="rounded-full"
                  :active="favoriteList.includes(book.id)"
                  @click="toggleFavorite(book.id)"
                >
                  <font-awesome-icon :icon="['fas', 'heart']" />
                </v-btn>

                <v-btn
                  variant="plain"
                  class="ma-2"
                  @click="() => Inertia.visit('/books/details/' + book.id)"
                >
                  <font-awesome-icon :icon="['fas', 'arrow-right']" />
                </v-btn>

                <v-btn
                  v-show="props.currentUser && props.currentUser.admin"
                  variant="plain"
                  class="ma-2"
                  @click="() => Inertia.visit('/books/edit/' + book.id)"
                >
                  <font-awesome-icon :icon="['fas', 'edit']" />
                </v-btn>

                <v-btn
                  v-show="props.currentUser && props.currentUser.admin"
                  color="red"
                  variant="plain"
                  class="ma-2"
                  @click="deleteThisBook(book.id)"
                >
                  <font-awesome-icon :icon="['fas', 'trash']" />
                </v-btn>
              </div>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-container>
    </template>
    <ErrorPanel class="h-75" v-else>
      {{ t('generic.not-found') }}
    </ErrorPanel>

  </Layout>
</template>


<script lang="ts">
export default {
  name: "BookPage"
};
</script>


<script setup lang="ts">
import { Inertia } from "@inertiajs/inertia";
import { Head } from '@inertiajs/vue3';
import { defineProps, ref, watch, onMounted, type PropType } from "vue";
import { useI18n } from "vue-i18n";
import { useToastStore } from "@/stores/toasts";
import { useItemListComposable, type ISortOrder } from "@/composables/itemList";
import { BookCard } from "@/guebbit_library";
import { deleteBook, putToggleFavorite } from "@/api/index";
import BookDetailsPage from "@/components/organisms/BookDetailsPage.vue";
import ErrorPanel from "@/components/organisms/ErrorPanel.vue";

import Layout from "@/layouts/DefaultLayout.vue";
import type { IBook, ICurrentUser } from "@/types";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faHeart,
  faEdit,
  faBook,
  faArrowRight,
  faMagnifyingGlass,
  faTags,
  faEraser,
  faPanorama,
  faGrip,
  faList,
  faBookOpen,
  faBookOpenReader,
  faSort,
  faSortDown,
  faSortUp,
  faSearch,
  faPlay,
  faTrash
} from "@fortawesome/free-solid-svg-icons";

library.add(
  faHeart,
  faEdit,
  faBook,
  faArrowRight,
  faMagnifyingGlass,
  faTags,
  faEraser,
  faPanorama,
  faList,
  faGrip,
  faBookOpen,
  faBookOpenReader,
  faSort,
  faSortDown,
  faSortUp,
  faSearch,
  faPlay,
  faTrash
);


/**
 * Props
 */
const props = defineProps({
  currentUser: {
    type: Object as PropType<ICurrentUser>,
    required: false
  },
  books: {
    type: Array as PropType<IBook[]>,
    default: () => []
  },
  favorites: {
    type: Array as PropType<IBook[]>,
    default: () => []
  },
  genres: {
    type: Array as PropType<string[]>,
    default: () => []
  },
});


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
  pageCurrent,
  pageSize,
  pageTotal,
  sorters,
  list,
  deleteRecord
} = useItemListComposable<IBook>();


/**
 * Settings
 */
pageSize.value = 6;
sorters.value = {
  name: ""
} as Record<keyof IBook, ISortOrder>;
const sortersNameMode = ref(0);
const toggleSort = () => {
  if (sortersNameMode.value < 2) {
    sortersNameMode.value++;
    sorters.value.name = sortersNameMode.value === 1 ? "asc" : "desc";
  } else {
    sortersNameMode.value = 0;
    sorters.value.name = "";
  }
};

/**
 * Visualization mode
 */
const defaultModeVisualization = 2;
const modeVisualization = ref(defaultModeVisualization);
watch(modeVisualization, (val) =>
  pageSize.value = !val || val === 1 ? 4 : 8
);

/**
 * Toggle favorite books.
 * There is no need for the server to be reloaded to update the favorite list.
 * (TODO connection error = rollback)
 */
const favoriteList = ref<number[]>([]);
const toggleFavorite = (id: number) => {
  if (favoriteList.value.includes(id))
    favoriteList.value.splice(favoriteList.value.indexOf(id), 1);
  else
    favoriteList.value.push(id);
    return putToggleFavorite(id)
      .then(({ message }) => addMessage(message))
      .catch((error) => addMessage("An error occurred, retry"))
};

/**
 * Make online search
 */
const searchByTitle = ref("");
const searchByText = ref("");
const searchByGenres = ref<string[]>([]);
const performSearch = () => {
  const data: Record<string, string> = {};

  if (searchByTitle.value && searchByTitle.value.length > 0)
    data.name = searchByTitle.value;
  if (searchByText.value && searchByText.value.length > 0)
    data.description = searchByText.value;
  if (searchByGenres.value && searchByGenres.value.length > 0)
    data.genres = searchByGenres.value.join(",");

  Inertia.visit('/books/search', { data });
}

/**
 * Reset filters
 */
const resetFilters = () => {
  searchByTitle.value = "";
  searchByText.value = "";
  searchByGenres.value = [];
  performSearch();
};

/**
 *
 */
onMounted(() => {
  /**
   * Pre-fill search parameters based on query string
   */
  const queryParams = new URLSearchParams(window.location.search);
  searchByTitle.value = queryParams.get("name") || "";
  searchByText.value = queryParams.get("description") || "";
  searchByGenres.value = queryParams.get("genres")?.split(",") || [];

  /**
   * favorite books id only
   */
  favoriteList.value = props.favorites.reduce((acc: number[], { id }) => {
    acc.push(id);
    return acc;
  }, [] as number[]);

  /**
   * props.books will be the initial list
   */
  itemList.value = props.books;
});


/**
 *
 */
const deleteThisBook = (id?: number) => {
  if(!id)
    return;
  // Delete the record and let the user know, but proceed the navigation flawlessly
  deleteRecord(id);
  // true deletion
  return deleteBook(id)
    .then(({ message }) => {
      addMessage(message);
      Inertia.visit('/books/');
    })
    .catch((error) => {
      console.error(error);
      // Easy and fast way to "rollback" for the user
      Inertia.reload();
    })
}
</script>

<style lang="scss">
#book-list-page {
  .page-controls {
    .v-btn-group {
      height: auto;

      .v-btn {
        text-align: center;
        font-size: 0.75em;
      }
    }

    .v-item-group {
      .v-card {
        padding: 24px 12px;

        svg {
          font-size: 2em;
        }

        p {
          font-size: 1.2em;
        }
      }
    }

    .filter-by-station-section {
      .v-card {
        width: 120px;
        height: 120px;

        svg {
          fill: rgb(var(--v-theme-on-surface));
          max-width: 80%;
          max-height: 80%;
        }
      }
    }

    .filter-by-tag-section {
      font-size: 0.7em;

      .v-card {
        width: 100px;
        height: 100px;
      }
    }
  }

  .book-list-details {
    &-shadow {
      margin-top: 24px;
      height: 5vh;
      background: linear-gradient(0deg, #000000 0%, transparent 100%);
    }
  }

  .book-list-masonry {
    .image-hover-up-card {
      cursor: pointer;
      transition: box-shadow 0.2s;
    }
  }

  .book-list-simple {
    &.v-list {
      .v-list-item {
        & + .v-list-item {
          border-top: 1px solid rgb(var(--v-theme-on-surface));
        }
      }
    }
  }
}
</style>
