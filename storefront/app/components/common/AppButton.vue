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
  primary: 'bg-navy-900 text-white hover:bg-navy-800 shadow-lg shadow-navy-900/10',
  secondary: 'bg-gold-500 text-white hover:bg-gold-600 shadow-lg shadow-gold-500/20',
  outline: 'bg-transparent border-2 border-navy-900 text-navy-900 hover:bg-navy-50',
  ghost: 'bg-transparent text-slate-600 hover:bg-slate-100/50',
};

const sizes = {
  sm: 'px-5 py-2 text-xs tracking-wider',
  md: 'px-7 py-2.5 text-sm tracking-wide',
  lg: 'px-10 py-4 text-base tracking-widest uppercase',
};
</script>

<template>
  <button
    class="relative inline-flex items-center justify-center font-bold transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none rounded-full"
    :class="[variants[props.variant], sizes[props.size]]"
    :disabled="props.loading"
  >
    <!-- Ripple/Hover Layer -->
    <span class="absolute inset-0 rounded-full bg-white opacity-0 transition-opacity hover:opacity-10 pointer-events-none" />
    
    <span v-if="props.loading" class="mr-3 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
    <span class="relative z-10">
      <slot />
    </span>
  </button>
</template>
