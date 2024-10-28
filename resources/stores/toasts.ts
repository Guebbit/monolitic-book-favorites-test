import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useToastStore = defineStore('toast', () => {
    /**
     * Settings
     */
    // Messages array
    const messages = ref([] as string[]);
    // Show the toast component if there are messages
    const show = computed(() => messages.value.length > 0);
    // Time to live
    const timeout = 3000;

    /**
     * Add a message then after a timeout and then remove it (FIFO)
     *
     * @param msg
     */
    function addMessage(msg: string) {
        messages.value.push(msg);

        setTimeout(() => {
            messages.value.shift();
        }, timeout);
    }

    return {
        messages,
        show,
        addMessage,
    };
});
