<script setup>
    import {VCard} from 'vuetify/components';
</script>
<template>
    <VCard v-bind="$attrs" class="rounded-xl p-1">
        <slot/>
    </VCard>
</template>