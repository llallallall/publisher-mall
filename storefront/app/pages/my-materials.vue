<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

const { materials, loading: lockerLoading, error: lockerError, refresh: refreshLocker } = useMyMaterials()
const { myDownloads, loading: libraryLoading, fetchMyDownloads, error: libraryError } = useLibrary()

const activeTab = ref<'locker' | 'activity'>('locker')

onMounted(() => {
  fetchMyDownloads()
})

const loading = computed(() => lockerLoading.value || (activeTab.value === 'activity' && libraryLoading.value))

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(date))
}

const getFileIcon = (url: string | null) => {
  if (!url) return 'ph:file-bold'
  if (url.toLowerCase().includes('pdf')) return 'ph:file-pdf-duotone'
  if (url.toLowerCase().includes('mp3')) return 'ph:file-audio-duotone'
  return 'ph:file-text-duotone'
}

const downloadFile = (url: string) => {
  window.open(url, '_blank')
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-6 py-12 space-y-16">
    <!-- Header Area -->
    <header class="space-y-6">
      <div class="inline-flex items-center space-x-3 px-4 py-2 bg-charcoal-900/5 rounded-full">
        <div class="w-2 h-2 rounded-full bg-accent-blue animate-pulse"></div>
        <span class="text-[11px] font-bold uppercase tracking-widest text-charcoal-900">Digital Archive Access</span>
      </div>
      <h1 class="text-5xl font-semibold text-charcoal-900 tracking-tight leading-tight">
        Personal Knowledge Storage
      </h1>
      <p class="max-w-xl text-slate-500 font-light text-lg italic">
        Manage your authenticated research materials and digital academic assets.
      </p>

      <!-- Tabs -->
      <div class="flex items-center space-x-12 pt-12 border-b border-charcoal-900/5">
        <button 
          @click="activeTab = 'locker'"
          class="relative pb-6 text-[11px] font-bold uppercase tracking-widest transition-all"
          :class="activeTab === 'locker' ? 'text-charcoal-900' : 'text-slate-300 hover:text-charcoal-900/60'"
        >
          Archive Contents
          <span v-if="activeTab === 'locker'" class="absolute bottom-0 left-0 w-full h-[2px] bg-accent-blue"></span>
        </button>
        <button 
          @click="activeTab = 'activity'"
          class="relative pb-6 text-[11px] font-bold uppercase tracking-widest transition-all"
          :class="activeTab === 'activity' ? 'text-charcoal-900' : 'text-slate-300 hover:text-charcoal-900/60'"
        >
          Reference History
          <span v-if="activeTab === 'activity'" class="absolute bottom-0 left-0 w-full h-[2px] bg-accent-blue"></span>
        </button>
      </div>
    </header>

    <!-- Content Area -->
    <div class="min-h-[60vh]">
      <!-- Loading State -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="i in 3" :key="i" class="h-64 rounded-antigravity-card bg-charcoal-50 animate-pulse border border-charcoal-900/5"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="lockerError || libraryError" class="glass-panel p-20 text-center rounded-antigravity-card space-y-8">
        <div class="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
          <Icon name="ph:warning-circle-light" class="text-4xl" />
        </div>
        <h3 class="text-2xl font-semibold text-charcoal-900">Archive Synchronization Failed</h3>
        <p class="text-slate-500 max-w-sm mx-auto">Unable to verify your archive permissions. Please ensure your session is active.</p>
        <CommonAppButton variant="outline" @click="activeTab === 'locker' ? refreshLocker() : fetchMyDownloads()">Retry Connection</CommonAppButton>
      </div>

      <!-- Empty State (Locker) -->
      <div v-else-if="activeTab === 'locker' && materials.length === 0" class="glass-panel p-24 text-center rounded-antigravity-card space-y-10">
        <div class="w-24 h-24 bg-charcoal-900/5 rounded-[2rem] flex items-center justify-center mx-auto blueprint-grid opacity-40">
          <Icon name="ph:archive-light" class="text-5xl text-charcoal-900" />
        </div>
        <div class="space-y-4">
          <h3 class="text-3xl font-semibold text-charcoal-900 tracking-tight">Archive Empty</h3>
          <p class="text-slate-500 font-light max-w-md mx-auto">Your knowledge storage is currently inactive. Authentic materials will appear here after acquisition.</p>
        </div>
        <NuxtLink to="/">
          <CommonAppButton variant="primary">Explore Collection</CommonAppButton>
        </NuxtLink>
      </div>

      <!-- Empty State (Activity) -->
      <div v-else-if="activeTab === 'activity' && myDownloads.length === 0" class="glass-panel p-24 text-center rounded-antigravity-card space-y-10">
        <div class="w-24 h-24 bg-charcoal-900/5 rounded-[2rem] flex items-center justify-center mx-auto blueprint-grid opacity-40">
          <Icon name="ph:hash-straight-light" class="text-5xl text-charcoal-900" />
        </div>
        <div class="space-y-4">
          <h3 class="text-3xl font-semibold text-charcoal-900 tracking-tight">No Activity Logged</h3>
          <p class="text-slate-500 font-light max-w-md mx-auto">You haven't accessed any reference materials yet. Visit the library to start building your history.</p>
        </div>
        <NuxtLink to="/library">
          <CommonAppButton variant="primary">Visit Library</CommonAppButton>
        </NuxtLink>
      </div>

      <!-- Materials Grid (Locker) -->
      <div v-else-if="activeTab === 'locker'" class="space-y-4">
        <div 
          v-for="item in materials" 
          :key="item.id"
          class="group relative flex flex-col md:flex-row items-center gap-12 p-10 bg-white border-t border-charcoal-900/5 hover:bg-accent-soft transition-all duration-700 first:border-t-0"
        >
          <div class="flex-1 space-y-6">
            <div class="flex items-center space-x-4">
              <span class="text-[10px] font-bold text-accent-blue uppercase tracking-[0.2em]">
                {{ item.productVariant.customFields?.productType || 'ASSET' }}
              </span>
              <div class="h-px w-8 bg-charcoal-900/10"></div>
              <span class="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                Acquired {{ formatDate(item.activationDate) }}
              </span>
            </div>

            <div class="space-y-2">
              <h3 class="text-3xl font-semibold text-charcoal-900 tracking-tight group-hover:translate-x-1 transition-transform duration-700">
                {{ item.productVariant.product.name }}
              </h3>
              <p class="text-[13px] text-slate-400 font-medium uppercase tracking-tight">
                {{ item.productVariant.name }}
              </p>
            </div>

            <div class="pt-4">
              <button 
                @click="downloadFile(item.downloadUrl)"
                v-if="item.downloadUrl"
                class="flex items-center space-x-3 px-8 py-3 bg-charcoal-900 text-white rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-accent-blue transition-all duration-500 shadow-xl shadow-charcoal-900/5"
              >
                <Icon :name="getFileIcon(item.downloadUrl)" class="text-lg" />
                <span>Launch Resource</span>
              </button>
            </div>
          </div>

          <div class="w-full md:w-64 aspect-video overflow-hidden rounded-2xl bg-charcoal-50 shadow-sm border border-charcoal-900/5">
            <img 
              :src="item.productVariant.product.featuredAsset?.preview || 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=400'" 
              class="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000"
            />
          </div>
        </div>
      </div>

      <!-- Activity List (Library Downloads) -->
      <div v-else-if="activeTab === 'activity'" class="space-y-6">
        <div v-if="myDownloads.length === 0" class="py-20 text-center border-charcoal-900/5 rounded-antigravity-card">
           <p class="text-slate-300 italic">No reference activity recorded.</p>
        </div>
        <div 
          v-for="log in myDownloads" 
          :key="log.id"
          class="flex items-center justify-between p-6 bg-white border border-charcoal-900/5 rounded-2xl hover:shadow-sm transition-all"
        >
           <div class="flex items-center space-x-6">
             <div class="w-12 h-12 rounded-xl bg-charcoal-50 flex items-center justify-center text-slate-300">
               <Icon name="ph:hash-straight-bold" />
             </div>
             <div>
               <h4 class="text-sm font-semibold text-charcoal-900">{{ log.material.title }}</h4>
               <p class="text-[10px] text-slate-400 font-medium uppercase tracking-tight">{{ formatDate(log.createdAt) }}</p>
             </div>
           </div>
           <button 
             @click="downloadFile(log.material.fileUrl)"
             class="text-[10px] font-bold text-accent-blue uppercase tracking-widest hover:underline"
           >
             Access Again
           </button>
        </div>
      </div>
    </div>

    <!-- Security Note -->
    <div class="text-center pt-20">
      <p class="text-[10px] text-slate-300 font-medium uppercase tracking-[0.3em]">
        Verified Secure Archive Access • 2026.04 Session
      </p>
    </div>
  </div>
</template>

<style scoped>
.glass-panel {
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(14.65px);
  -webkit-backdrop-filter: blur(14.65px);
  border: 1px solid rgba(18, 19, 23, 0.05);
}
</style>
