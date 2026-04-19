<script setup lang="ts">
const { materials, loading, error, trackDownload } = useLibrary('ANALYSIS')

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date(date))
}

const handleDownload = async (item: any) => {
  if (item.requireLogin) {
    // 실제로는 useAuth 등을 통해 체크해야 함
    alert('회원 전용 자료입니다. 로그인 후 이용해 주세요.')
    return
  }
  
  await trackDownload(item.id)
  window.open(item.fileUrl, '_blank')
}
</script>

<template>
  <div class="max-w-[1200px] mx-auto px-4 py-16 md:py-24">
    <!-- Header -->
    <div class="border-b-2 border-charcoal-900 pb-10 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <div class="flex items-center gap-2 mb-3">
          <span class="w-2 h-2 rounded-full bg-safety-orange"></span>
          <span class="text-[12px] font-bold text-gray-400 uppercase tracking-widest">Library / Analysis</span>
        </div>
        <h1 class="text-[32px] md:text-[40px] font-black text-charcoal-900 tracking-tighter leading-none">
          연계양상 및 등급컷
        </h1>
        <p class="text-[15px] text-gray-400 mt-4 max-w-2xl leading-relaxed">
          서담 연구소의 분석 전문가들이 제공하는 최신 수능 트렌드 분석 보고서와 
          실시간 예측 등급컷 정보를 통해 학습 전략을 수립하세요.
        </p>
      </div>
      <div class="flex gap-4 p-4 bg-charcoal-50 rounded-xl border border-gray-100">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
          <span class="text-[13px] font-bold text-gray-600">무료</span>
        </div>
        <div class="flex items-center gap-2 border-l border-gray-200 pl-4">
          <span class="w-2.5 h-2.5 rounded-full bg-safety-orange"></span>
          <span class="text-[13px] font-bold text-gray-600">회원전용</span>
        </div>
      </div>
    </div>
    
    <!-- Content List -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-32 space-y-4">
      <Icon name="ph:spinner-gap-bold" class="text-4xl text-charcoal-900 animate-spin" />
      <p class="text-sm font-bold text-gray-400">데이터를 불러오는 중입니다...</p>
    </div>

    <div v-else-if="materials && materials.length > 0" class="grid gap-4">
      <div 
        v-for="item in materials" 
        :key="item.id" 
        @click="handleDownload(item)"
        class="group relative flex items-center justify-between p-6 bg-white rounded-2xl border border-gray-100 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-charcoal-900 hover:-translate-y-1 cursor-pointer"
      >
        <div class="flex items-center gap-6">
          <div :class="item.requireLogin ? 'bg-safety-orange/10 text-safety-orange' : 'bg-blue-500/10 text-blue-500'" class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
            <Icon :name="item.requireLogin ? 'ph:lock-key-bold' : 'ph:file-pdf-bold'" class="text-2xl" />
          </div>
          <div>
            <div class="flex items-center gap-3 mb-1">
              <span :class="item.requireLogin ? 'text-safety-orange' : 'text-blue-500'" class="text-[11px] font-black uppercase tracking-widest">
                {{ item.requireLogin ? 'Member Only' : 'Free Access' }}
              </span>
              <span class="text-[11px] text-gray-300 font-mono">{{ formatDate(item.createdAt) }}</span>
            </div>
            <h3 class="text-lg font-bold text-charcoal-900 group-hover:text-charcoal-900 transition-colors">
              {{ item.title }}
            </h3>
            <p v-if="item.description" class="text-[13px] text-gray-400 mt-1 line-clamp-1">
              {{ item.description }}
            </p>
          </div>
        </div>
        
        <div class="flex items-center gap-8">
          <div class="hidden md:flex flex-col items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <span class="text-[10px] font-bold text-gray-300 uppercase tracking-tighter">Downloads</span>
            <span class="text-[14px] font-black text-charcoal-900">{{ item.downloadCount }}</span>
          </div>
          <div class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-charcoal-900 group-hover:text-white transition-all">
            <Icon name="ph:arrow-right-bold" class="text-lg" />
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-32 bg-charcoal-50 rounded-3xl border border-dashed border-gray-200">
      <div class="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
        <Icon name="ph:files-light" class="text-4xl text-gray-200" />
      </div>
      <h3 class="text-xl font-bold text-charcoal-900 mb-2">등록된 자료가 없습니다.</h3>
      <p class="text-[14px] text-gray-400">학습 아카이브가 준비 중입니다. 잠시만 기다려 주세요.</p>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
