import { computed, ref } from 'vue'
import { useItemStructureComposable } from '@/composables/itemStructure'

export type ISortOrder = '' | 'ASC' | 'DESC' | 'asc' | 'desc';

export const useItemListComposable = <T = unknown>(
    itemIdentifier = "id"
) => {

    /**
     *
     */
    const {
        itemList,
        itemsLength,
        listToDictionary,
        itemDictionary,
        getRecord,
        editRecord,
        deleteRecord,
        selectedIdentifier,
        selectedRecord,

        startLoading,
        stopLoading,
        loading,
    } = useItemStructureComposable<T>(itemIdentifier);

    /**
     * Filter data
     */
    const filters = ref({} as Record<keyof T, string>);

    /**
     * Number of filtered items
     */
    const itemsFilteredLength = computed(() => Object.keys(itemList.value).length);

    /**
     * Dictionary of items
     */
    const itemDictionaryFiltered = computed<Record<string, T>>(() =>
        listToDictionary(itemList.value as T[], itemIdentifier as keyof T)
    );

    /**
     * Sort data
     */
    const sorters = ref({} as Record<keyof T, ISortOrder>);

    /**
     * @param data
     * @param sortFields
     */
    const sortItems = <T>(
        data: T[],
        sortFields = {} as Record<keyof T, ISortOrder>
    ): T[] => {
        if(Object.keys(sortFields).length < 1)
            return data;
        return data.sort((a, b) => {
            for (const field in sortFields) {
                if (!Object.prototype.hasOwnProperty.call(sortFields, field))
                    continue;
                // Compare the field values...
                const comparison = (a[field] < b[field] ? -1 : a[field] > b[field] ? 1 : 0);
                // ...and choose the order
                if (comparison !== 0) {
                    return sortFields[field].toLowerCase() === 'asc' ? comparison : (
                        sortFields[field].toLowerCase() === 'desc' ? -comparison: 0
                    );
                }
            }
            // All compared fields are equal
            return 0;
        })
    }

    /**
     * List of all items sorted
     */
    const itemListSorted = computed(() => sortItems(itemList.value as T[], sorters.value));

    /**
     * Resert filters
     */
    function resetFilters(){
        filters.value = {};
    }

    /**
     * Reset sorters
     */
    function resetSort() {
        sorters.value.value = {};
    }


    /**
     * ---------------------------------- PAGINATION ------------------------------------
     * TODO infinite pagination
     */

    /**
     * PAGINATION
     * Current selected page (start with 1)
     */
    const pageCurrent = ref(1);

    /**
     * PAGINATION
     * How many items in page
     */
    const pageSize = ref(10);

    /**
     * PAGINATION
     * How many pages exist
     */
    const pageTotal = computed(() => Math.ceil(itemsFilteredLength.value / pageSize.value));

    /**
     * PAGINATION
     * First item of the current page
     */
    const pageOffset = computed(() => pageSize.value * (pageCurrent.value - 1));

    /**
     * PAGINATION
     * Items shown in current page
     */
    const pageItemList = computed(() => itemListSorted.value.slice(pageOffset.value, pageOffset.value + pageSize.value))

    return {
        // Selections
        itemList,
        itemsLength,
        listToDictionary,
        itemDictionary,
        getRecord,
        editRecord,
        deleteRecord,
        selectedIdentifier,
        selectedRecord,

        // Search & Sort
        filters,
        itemsFilteredLength,
        itemDictionaryFiltered,
        sorters,
        sortItems,
        itemListSorted,
        resetFilters,
        resetSort,

        // Pagination
        pageCurrent,
        pageSize,
        pageTotal,
        pageOffset,
        pageItemList,

        // Url
        // fromObjectToUrl,
        // fromUrlToObject,
        // encodeURIObject,
        // decodeURIObject,

        // Generics
        startLoading,
        stopLoading,
        loading,

        // better names
        list: pageItemList,
        total: itemsFilteredLength,
    }
};
