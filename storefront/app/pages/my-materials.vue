<script setup lang="ts">
const { materials, loading, error, refresh } = useMyMaterials()

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date))
}

const getFileIcon = (url: string) => {
  if (url.endsWith('.pdf')) return 'ph:file-pdf-bold'
  if (url.endsWith('.mp3')) return 'ph:file-audio-bold'
  return 'ph:file-bold'
}

const downloadFile = (url: string) => {
  // In a real app, this might trigger a secure download or open a new tab
  window.open(url, '_blank')
}
</script>

<template>
  <div class="space-y-12">
    <!-- Header -->
    <div class="border-b border-slate-200 pb-8">
      <h1 class="text-4xl font-extrabold text-navy-900 tracking-tight">지식 보관함</h1>
      <p class="text-lg text-slate-500 mt-2 font-light italic">구매하신 디지털 자료 및 학습 콘텐츠를 관리합니다.</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div v-for="i in 2" :key="i" class="h-48 rounded-[2rem] bg-slate-50 animate-pulse border border-slate-100"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 p-12 rounded-[2rem] text-center border border-red-100">
      <Icon name="ph:warning-circle-bold" class="text-5xl text-red-500 mb-4" />
      <h3 class="text-xl font-bold text-navy-900">자료를 불러오지 못했습니다.</h3>
      <p class="text-slate-600 mb-6">로그인 상태를 확인하거나 네트워크를 점검해 주세요.</p>
      <CommonAppButton variant="primary" @click="refresh">다시 시도</CommonAppButton>
    </div>

    <!-- Empty State -->
    <div v-else-if="materials.length === 0" class="bg-slate-50/50 p-20 rounded-[3rem] text-center border border-dashed border-slate-200">
      <div class="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
        <Icon name="ph:folder-open-light" class="text-4xl text-slate-300" />
      </div>
      <h3 class="text-xl font-bold text-navy-900">아직 등록된 자료가 없습니다.</h3>
      <p class="text-slate-500 mt-2 font-light">모의고사 구매 후 디지털 부록을 여기서 확인하실 수 있습니다.</p>
      <NuxtLink to="/products" class="inline-block mt-8">
        <CommonAppButton variant="outline">아카이브 탐색하기</CommonAppButton>
      </NuxtLink>
    </div>

    <!-- Materials Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div 
        v-for="item in materials" 
        :key="item.id"
        class="group bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-gold-200 transition-all duration-500 overflow-hidden relative"
      >
        <!-- Blueprint Grid Accent -->
        <div class="absolute top-0 right-0 w-32 h-32 bg-slate-50 opacity-0 group-hover:opacity-100 transition-opacity -mr-16 -mt-16 rounded-full"></div>
        
        <div class="relative z-10 flex items-start space-x-4">
          <div class="w-12 h-12 rounded-xl bg-navy-50 flex items-center justify-center text-navy-600 shrink-0 group-hover:bg-gold-500 group-hover:text-white transition-colors">
            <Icon :name="getFileIcon(item.productVariant.customFields.digitalMaterialUrl)" class="text-2xl" />
          </div>
          <div class="space-y-1">
            <h3 class="font-bold text-navy-900 line-clamp-1 group-hover:text-gold-700 transition-colors">
              {{ item.productVariant.product.name }}
            </h3>
            <p class="text-xs text-slate-400 font-medium tracking-widest uppercase">
              {{ item.productVariant.name }}
            </p>
          </div>
        </div>

        <div class="mt-8 pt-6 border-t border-slate-50 flex items-end justify-between">
          <div class="space-y-1">
            <p class="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">Activated On</p>
            <p class="text-sm font-medium text-slate-600">{{ formatDate(item.activationDate) }}</p>
          </div>
          <CommonAppButton 
            variant="secondary" 
            size="sm" 
            @click="downloadFile(item.productVariant.customFields.digitalMaterialUrl)"
          >
            내려받기
          </CommonAppButton>
        </div>
      </div>
    </div>
  </div>
</template>
