<template>
    <div class="flex justify-center align-center">
        <v-container>
            <v-alert
                outlined
                type="error"
            >
                <slot />
            </v-alert>
        </v-container>
    </div>
</template>
<script setup></script>
