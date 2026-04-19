<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  loading: false,
});

const variants = {
  primary: 'bg-charcoal-900 text-white hover:bg-charcoal-950 shadow-md border border-charcoal-900',
  secondary: 'bg-accent-soft backdrop-blur-[5.8px] text-charcoal-900 border border-charcoal-900/5 hover:bg-charcoal-900/5',
  outline: 'bg-transparent border border-charcoal-900/10 text-charcoal-900 hover:border-charcoal-900 hover:bg-charcoal-50/50',
  ghost: 'bg-transparent text-charcoal-400 hover:bg-charcoal-50 hover:text-charcoal-900',
};

const sizes = {
  sm: 'px-6 py-2 text-[12px] font-semibold tracking-tight',
  md: 'px-8 py-3 text-[14px] font-semibold tracking-tight',
  lg: 'px-12 py-5 text-base font-semibold tracking-tight',
};
</script>

<template>
  <button
    class="relative inline-flex items-center justify-center transition-all duration-500 antigravity-ease active:scale-[0.96] disabled:opacity-40 disabled:cursor-not-allowed rounded-antigravity-pill group overflow-hidden whitespace-nowrap"
    :class="[variants[props.variant], sizes[props.size]]"
    :disabled="props.loading"
  >
    <!-- Light Reflection Overlay on hover -->
    <span class="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none" />
    
    <div class="relative z-10 flex items-center justify-center">
      <Icon 
        v-if="props.loading" 
        name="ph:spinner-gap-bold" 
        class="mr-2 h-4 w-4 animate-spin" 
      />
      <slot />
    </div>
  </button>
</template>

<style scoped>
.antigravity-ease {
  transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
}
</style>
