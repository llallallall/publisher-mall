<script setup lang="ts">
const props = defineProps<{
  url: string
  title?: string
}>()

const isLoading = ref(true)

const handleLoad = () => {
  isLoading.value = false
}
</script>

<template>
  <div class="relative w-full aspect-[3/4] rounded-3xl overflow-hidden bg-charcoal-50 border border-charcoal-900/5 shadow-sm">
    <!-- Loading State -->
    <div v-if="isLoading" class="absolute inset-0 flex flex-col items-center justify-center space-y-4 z-10 bg-charcoal-50">
      <div class="w-12 h-12 border-4 border-charcoal-900/10 border-t-safety-orange rounded-full animate-spin"></div>
      <p class="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Loading Academic Content...</p>
    </div>

    <!-- PDF Iframe -->
    <iframe 
      :src="url"
      class="w-full h-full border-0"
      :title="title || 'Document Preview'"
      @load="handleLoad"
    ></iframe>
    
    <!-- Blueprint Overlay (If no URL) -->
    <div v-if="!url" class="absolute inset-0 blueprint-grid flex items-center justify-center opacity-30">
      <p class="text-[10px] font-bold uppercase tracking-tight text-slate-300">Preview Data Offline</p>
    </div>
  </div>
</template>
