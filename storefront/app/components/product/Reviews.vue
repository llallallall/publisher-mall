<script setup lang="ts">
const props = defineProps<{
  reviews: any[]
  loading: boolean
}>()

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'short', day: 'numeric', year: 'numeric'
  }).format(new Date(date))
}

const getSourceStyle = (source: string) => {
  switch (source) {
    case 'INTERNAL': return 'bg-safety-orange/10 text-safety-orange border-safety-orange/20'
    case 'NAVER': return 'bg-[#03C75A]/10 text-[#03C75A] border-[#03C75A]/20'
    case 'COUPANG': return 'bg-[#EF6123]/10 text-[#EF6123] border-[#EF6123]/20'
    default: return 'bg-charcoal-900/5 text-charcoal-400 border-charcoal-900/10'
  }
}
</script>

<template>
  <div class="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <div class="flex flex-col md:flex-row items-center gap-10 bg-charcoal-900 text-white p-10 rounded-[2.5rem] shadow-xl overflow-hidden relative">
      <div class="absolute top-0 right-0 w-40 h-40 bg-safety-orange/10 blur-[60px] rounded-full -mr-20 -mt-20"></div>
      <div class="text-center md:border-r border-white/10 md:pr-12 relative z-10">
        <p class="text-[11px] font-black text-white/40 uppercase tracking-[0.2em] mb-2">평균 만족도</p>
        <p class="text-6xl font-black tracking-tighter">4.9</p>
        <div class="flex items-center justify-center gap-1 mt-3"><Icon v-for="i in 5" :key="i" name="ph:star-fill" class="text-safety-orange text-xl" /></div>
      </div>
      <div class="flex-1 w-full space-y-3 relative z-10">
        <div v-for="i in [5, 4, 3, 2, 1]" :key="i" class="flex items-center gap-4">
          <span class="text-[11px] font-black text-white/30 w-4">{{ i }}점</span>
          <div class="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div class="h-full bg-safety-orange transition-all duration-1000" :style="{ width: i === 5 ? '92%' : i === 4 ? '6%' : '1%' }"></div>
          </div>
          <span class="text-[11px] font-bold text-white/40 w-8 text-right">{{ i === 5 ? '92' : i === 4 ? '6' : '1' }}%</span>
        </div>
      </div>
    </div>

    <div v-if="reviews?.length" class="space-y-8">
      <div v-for="review in reviews" :key="review.id" class="group">
        <div class="flex flex-col gap-5 p-8 bg-white border border-gray-100 rounded-[2rem] hover:border-safety-orange/30 hover:shadow-premium transition-all duration-500">
          <div class="flex justify-between items-start">
            <div class="space-y-2">
              <div class="flex items-center gap-3">
                <div class="flex text-safety-orange"><Icon v-for="i in 5" :key="i" :name="i <= review.rating ? 'ph:star-fill' : 'ph:star-light'" class="text-[14px]" /></div>
                <span class="text-[15px] font-black text-charcoal-900 tracking-tight">{{ review.authorName }}</span>
                <span v-if="review.source" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-wider" :class="getSourceStyle(review.source)">
                  <Icon :name="review.source === 'INTERNAL' ? 'ph:seal-check-fill' : 'ph:link-bold'" />
                  {{ review.source === 'INTERNAL' ? '서담 공식' : review.source }}
                </span>
              </div>
              <p class="text-[12px] text-gray-400 font-bold">{{ formatDate(review.createdAt) }}</p>
            </div>
          </div>
          <p class="text-[16px] text-gray-600 leading-relaxed font-medium whitespace-pre-wrap">{{ review.body }}</p>
        </div>
      </div>
    </div>
    <div v-else class="py-24 text-center bg-charcoal-50 rounded-[3rem] border border-dashed border-gray-200">
      <Icon name="ph:chat-circle-dots-light" class="text-6xl text-gray-200 mb-4" />
      <p class="text-gray-400 font-black text-lg">아직 작성된 후기가 없습니다.</p>
    </div>
  </div>
</template>
