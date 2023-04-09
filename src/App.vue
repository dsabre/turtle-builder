<script setup lang="ts">
import AppBuilder from '@/components/AppBuilder.vue';
import AppHeader from '@/components/AppHeader.vue';
import AppSidebar from './components/AppSidebar.vue';
import AppFooter from './components/AppFooter.vue';
</script>

<template>
    <div>
        <AppHeader/>
        
        <div class="flex">
            <div>
                <AppBuilder/>
            </div>
            <div class="w-[260px]">
                <AppSidebar/>
            </div>
        </div>

        <AppFooter/>
    </div>
</template>
