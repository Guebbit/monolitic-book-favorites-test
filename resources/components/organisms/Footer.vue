<template>
    <footer class="event-footer bg-primary-600" style="color: rgb(var(--on-primary-600))">
        <div class="footer-copyright">
            <v-container class="flex justify-between">
                <p>
                    Copyright © 2024 All rights reserved
                    <br/>
                    <b>
                        Made with by
                        <a
                            target="_blank"
                            class="text-inherit font-bold"
                            href="https://guebbit.com/"
                        >
                            Guebbit
                        </a>
                    </b>
                </p>
                <a href="https://guebbit.com/" class="logo hover:bg-transparent">
                    <GuebbitLogo class="h-full w-[60px]" style="fill: white"/>
                </a>
            </v-container>
        </div>
    </footer>
</template>

<script setup lang="ts">
import GuebbitLogo from "../../../public/images/guebbit-logo.svg";
</script>
