<script setup lang="ts">
interface Props {
  title?: string;
  description?: string;
  image?: string;
  badge?: string;
}

const props = defineProps<Props>();
</script>

<template>
  <div class="relative group rounded-basalt bg-white border border-slate-100 shadow-premium transition-all duration-700 cubic-bezier(0.25, 1, 0.5, 1) hover:shadow-[0_40px_80px_-20px_rgba(15,23,42,0.12)] hover:-translate-y-3 overflow-hidden flex flex-col h-full">
    
    <!-- Image Layer with Perspective Warp simulation -->
    <div v-if="props.image" class="aspect-[16/10] w-full overflow-hidden bg-navy-50 relative">
      <NuxtImg
        :src="props.image"
        class="h-full w-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
        alt="Product Image"
      />
      <!-- Glass Badge Overlay -->
      <div v-if="props.badge" class="absolute top-6 left-6 z-10">
        <span class="px-4 py-1.5 bg-white/80 backdrop-blur-md rounded-full text-[10px] font-black text-navy-900 uppercase tracking-[0.2em] shadow-sm border border-white/50">
          {{ props.badge }}
        </span>
      </div>
      
      <!-- Hover Overlay Glow -->
      <div class="absolute inset-0 bg-gradient-to-t from-navy-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    </div>
    
    <!-- Content Area -->
    <div class="p-10 flex-1 flex flex-col">
      <slot name="header">
        <h3 v-if="props.title" class="text-3xl font-serif text-navy-900 mb-4 tracking-tight group-hover:text-gold-600 transition-colors duration-500">
          {{ props.title }}
        </h3>
        <p v-if="props.description" class="text-sm text-slate-400 mb-8 line-clamp-2 leading-relaxed font-light">
          {{ props.description }}
        </p>
      </slot>
      
      <div class="mt-auto pt-8 border-t border-slate-50 flex items-center justify-between">
        <slot />
      </div>
    </div>
    
    <!-- Subtle Bottom Accent -->
    <div class="absolute bottom-0 left-0 h-1.5 w-0 bg-gold-400 transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1) group-hover:w-full" />
  </div>
</template>

