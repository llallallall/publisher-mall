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
  primary: 'bg-navy-900 text-white hover:bg-navy-950 shadow-premium hover:shadow-navy-900/20',
  secondary: 'bg-gold-400 text-navy-950 hover:bg-gold-500 shadow-premium hover:shadow-gold-400/30',
  outline: 'bg-transparent border border-navy-900/20 text-navy-900 hover:border-navy-900 hover:bg-navy-50/50',
  ghost: 'bg-transparent text-slate-500 hover:bg-slate-50 hover:text-navy-900',
};

const sizes = {
  sm: 'px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em]',
  md: 'px-8 py-3 text-xs font-bold tracking-widest uppercase',
  lg: 'px-12 py-5 text-sm font-black tracking-[0.25em] uppercase',
};
</script>

<template>
  <button
    class="relative inline-flex items-center justify-center transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) active:scale-[0.97] active:duration-100 disabled:opacity-40 disabled:cursor-not-allowed rounded-full group overflow-hidden"
    :class="[variants[props.variant], sizes[props.size]]"
    :disabled="props.loading"
  >
    <!-- Refined Hover Overlay -->
    <span class="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none" />
    
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

