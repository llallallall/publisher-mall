<script setup lang="ts">
const { visible, message, type } = useToast();
</script>

<template>
  <Transition
    enter-active-class="transition duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
    enter-from-class="translate-y-full opacity-0 scale-95"
    enter-to-class="translate-y-0 opacity-100 scale-100"
    leave-active-class="transition duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-95"
  >
    <div
      v-if="visible"
      class="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] min-w-[320px]"
    >
      <div
        class="glass-panel p-6 rounded-[2rem] flex items-center space-x-4 border-white/50 shadow-[0_30px_60px_-15px_rgba(15,23,42,0.2)]"
        :class="{ 'border-gold-400/30': type === 'success', 'border-red-400/30': type === 'error' }"
      >
        <div 
          class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          :class="{ 'bg-gold-500 text-white': type === 'success', 'bg-red-500 text-white': type === 'error' }"
        >
          <Icon :name="type === 'success' ? 'ph:check-bold' : 'ph:warning-circle-bold'" class="text-xl" />
        </div>
        
        <div class="space-y-0.5">
          <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">
            {{ type === 'success' ? 'System Notification' : 'Attention Required' }}
          </p>
          <p class="text-sm font-bold text-navy-900 leading-tight">
            {{ message }}
          </p>
        </div>
      </div>
    </div>
  </Transition>
</template>
