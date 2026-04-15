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
  <div class="basalt-card group relative overflow-hidden flex flex-col h-full bg-white">
    <!-- Image Layer with Soft Transition -->
    <div v-if="props.image" class="aspect-[16/11] w-full overflow-hidden bg-slate-100 relative">
      <NuxtImg
        :src="props.image"
        class="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        alt="Product Image"
      />
      <!-- Academic Overlay -->
      <div v-if="props.badge" class="absolute top-4 left-4 z-10">
        <span class="academic-badge shadow-sm bg-white/90 backdrop-blur-sm">
          {{ props.badge }}
        </span>
      </div>
    </div>
    
    <!-- Content Area -->
    <div class="p-8 flex-1 flex flex-col">
      <slot name="header">
        <h3 v-if="props.title" class="text-2xl font-bold leading-tight text-navy-900 mb-3 group-hover:text-navy-800 transition-colors">
          {{ props.title }}
        </h3>
        <p v-if="props.description" class="text-sm text-slate-500 mb-6 line-clamp-2 leading-relaxed font-light">
          {{ props.description }}
        </p>
      </slot>
      
      <div class="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
        <slot />
      </div>
    </div>
    
    <!-- Hover Border Accent -->
    <div class="absolute bottom-0 left-0 h-1 w-0 bg-gold-500 transition-all duration-500 group-hover:w-full" />
  </div>
</template>
