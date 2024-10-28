<template>
	<SimplePanel
        class="comic-panel"
        :background="props.book?.image"
        overlay
        content-centered
	>
        <v-container>
            <v-row align="center" justify="center">
                <v-col cols="12" md="12" lg="5" xl="3">

                    <BookCard
                        style="max-width: 400px"
                        :title="props.book?.name"
                        :cover="props.book?.image || 'https://placehold.co/800x800'"
                        :spine="props.book?.image || 'https://placehold.co/800x800'"
                        ratio="4/6"
                    />

                </v-col>
                <v-col cols="12" md="12" lg="6" offset-lg="1" xl="4" offset-xl="1">

                    <div class="max-w-2xl mx-auto my-10 text-left">
                        <h3 v-if="props.book?.name" class="text-4xl font-bold mb-6">
                            {{ props.book.name }}
                        </h3>
                        <h4 v-if="props.book?.genre" class="text-2xl mb-4 flex align-center">
                            <v-icon icon="mdi-label" start></v-icon>
                            {{ props.book.genre }}
                        </h4>
                        <h4 v-if="props.book?.price" class="text-2xl mb-4 flex align-center">
                            <v-icon icon="mdi-currency-usd" start></v-icon>
                            {{ props.book.price }}
                        </h4>
                        <p v-if="props.book?.description" class="text-lg mb-10">
                            {{ props.book.description }}
                        </p>
                    </div>

                    <slot name="actions" />
                </v-col>
            </v-row>
            <slot />
        </v-container>
	</SimplePanel>
</template>

<script setup lang="ts">
import {defineProps, type PropType} from "vue";
import {BookCard, SimplePanel} from "@/guebbit_library";
import type {
    IBook,
    ICurrentUser
} from "@/types";


const props = defineProps({
    book: {
        type: Object as PropType<IBook>,
        required: false
    },
    currentUser: {
        type: Object as PropType<ICurrentUser>,
        required: false
    },
})
</script>

<style lang="scss">
.comic-panel{
    .g-vue-panel-content{
        padding: 60px 0;
        background: linear-gradient(to bottom,
            rgb(0 0 0),
            rgba(0 0 0 / 0.8),
            rgba(0 0 0 / 0.7),
            rgba(0 0 0 / 0.8),
            rgb(0 0 0)
        );
    }

	.panel-station-icons{
		.v-btn{
			font-size: 5em;
			height: auto;
			width: auto;
		}
	}

	.v-chip{
		background: rgb(var(--v-theme-primary));
	}
	.image-hover-up-card{
		max-width: 300px;
		margin: 0 auto;
	}
	.panel-info-icons{
		font-size: 0.9em;
		margin-top: 24px;

		.simple-text-icon{
			color: rgb(var(--v-theme-on-surface));
			max-width: 6em;
		}

        @media (max-width: theme('screens.xl')) {
			text-align: center;
		}
	}
}
</style>
