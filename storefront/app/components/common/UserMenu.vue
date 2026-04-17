<script setup lang="ts">
const { user, logout } = useAuth()
const isOpen = ref(false)

// Close on outside click could be added with a utility or @vueuse
const handleLogout = async () => {
  await logout()
  isOpen.value = false
}

const initials = computed(() => {
  if (!user.value) return '??'
  const f = user.value.firstName?.[0] || ''
  const l = user.value.lastName?.[0] || ''
  return (l + f).toUpperCase() || user.value.emailAddress[0].toUpperCase()
})
</script>

<template>
  <div class="relative">
    <button 
      @click="isOpen = !isOpen" 
      class="flex items-center space-x-3 group outline-none"
    >
      <div class="w-10 h-10 bg-navy-900 rounded-xl flex items-center justify-center border border-navy-800 shadow-lg group-hover:shadow-gold-400/20 group-hover:-translate-y-0.5 transition-all">
        <span class="text-[10px] font-black text-gold-400 tracking-widest">{{ initials }}</span>
      </div>
    </button>

    <div 
      v-if="isOpen" 
      class="absolute right-0 mt-4 w-64 bg-white border border-slate-100 rounded-3xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-300"
    >
      <div class="px-8 py-6 bg-slate-50/50 border-b border-slate-100">
        <p class="text-[10px] font-black text-gold-600 uppercase tracking-widest mb-1">Authenticated User</p>
        <p class="text-sm font-bold text-navy-900">{{ user?.lastName }}{{ user?.firstName }}</p>
        <p class="text-xs text-slate-400 truncate">{{ user?.emailAddress }}</p>
      </div>
      
      <div class="p-2">
        <NuxtLink 
          to="/my-materials" 
          class="flex items-center space-x-3 px-6 py-4 rounded-2xl hover:bg-slate-50 transition-colors group"
          @click="isOpen = false"
        >
          <Icon name="ph:books-bold" class="text-lg text-slate-300 group-hover:text-navy-900 transition-colors" />
          <span class="text-xs font-bold text-navy-900">내 지식 보관함</span>
        </NuxtLink>

        <button 
          @click="handleLogout" 
          class="w-full flex items-center space-x-3 px-6 py-4 rounded-2xl hover:bg-red-50 transition-colors group"
        >
          <Icon name="ph:sign-out-bold" class="text-lg text-slate-300 group-hover:text-red-500 transition-colors" />
          <span class="text-xs font-bold text-navy-900">로그아웃</span>
        </button>
      </div>
    </div>
  </div>
</template>
