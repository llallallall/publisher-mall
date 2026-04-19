<script setup lang="ts">
interface Props {
  title?: string;
  description?: string;
  image?: string;
  badge?: string;
  hover?: boolean;
  glass?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  hover: true,
  glass: true,
});
</script>

<template>
  <div
    class="relative rounded-[32px] border border-charcoal-900/5 transition-all duration-700 antigravity-ease overflow-hidden flex flex-col h-full bg-white"
    :class="[
      props.glass ? 'bg-white/85 backdrop-blur-[14.65px] shadow-premium' : 'shadow-premium',
      props.hover ? 'hover:shadow-deep hover:-translate-y-2 hover:border-accent-blue/10' : ''
    ]"
  >
    <!-- Background Blueprint Hint (Very subtle) -->
    <div v-if="props.glass" class="absolute inset-0 opacity-[0.01] blueprint-grid pointer-events-none"></div>

    <!-- Image Section -->
    <div v-if="props.image" class="relative w-full aspect-[16/10] overflow-hidden bg-charcoal-50">
       <img 
        :src="props.image" 
        :alt="props.title" 
        class="w-full h-full object-cover transition-transform duration-700 antigravity-ease group-hover:scale-110"
      />
      <div v-if="props.badge" class="absolute top-4 left-4">
        <span class="px-3 py-1 bg-charcoal-900/80 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-widest rounded-full">
          {{ props.badge }}
        </span>
      </div>
    </div>

    <div class="relative z-10 p-8 flex-1 flex flex-col">
      <div v-if="props.title || props.description" class="mb-6 space-y-2">
        <h3 v-if="props.title" class="text-2xl font-semibold tracking-tight text-charcoal-900">
          {{ props.title }}
        </h3>
        <p v-if="props.description" class="text-sm text-slate-500 line-clamp-2 font-light leading-relaxed">
          {{ props.description }}
        </p>
      </div>
      
      <div class="flex-1">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.antigravity-ease {
  transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
}
.blueprint-grid {
  background-image: 
    linear-gradient(rgba(18, 19, 23, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(18, 19, 23, 0.1) 1px, transparent 1px);
  background-size: 20px 20px;
}
</style>
