<script setup lang="ts">
const items = [
  { id: 1, title: '2026학년도 등급컷 예측 및 분석 스페셜 영상', type: 'FREE', duration: '12:40' },
  { id: 2, title: '제1차 바탕 모의고사 독서 영역 해설강의', type: 'MEMBER', duration: '45:15' },
]
</script>

<template>
  <div class="max-w-[1200px] mx-auto px-4 py-20">
    <div class="border-b-2 border-charcoal-900 pb-6 mb-10 flex items-end justify-between">
      <div>
        <h1 class="text-[28px] font-bold text-charcoal-900">영상 자료</h1>
        <p class="text-[14px] text-gray-400 mt-1">서담 연구원들이 직접 진행하는 기출 및 모의고사 해설 영상입니다.</p>
      </div>
      <div class="flex gap-3 text-[12px] font-bold">
        <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-blue-500"></span> 무료</span>
        <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-safety-orange"></span> 회원전용</span>
      </div>
    </div>
    
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="item in items" :key="item.id" class="group cursor-pointer">
        <div class="relative aspect-video bg-charcoal-900 rounded-xl overflow-hidden mb-3">
          <div class="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
            <div class="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
              <Icon name="ph:play-fill" class="text-white text-xl ml-1" />
            </div>
          </div>
          <span class="absolute bottom-2 right-2 px-2 py-1 bg-black/60 text-white text-[10px] font-bold rounded backdrop-blur-md">{{ item.duration }}</span>
          <span class="absolute top-2 left-2 px-2 py-1 text-white text-[10px] font-bold rounded backdrop-blur-md" :class="item.type === 'FREE' ? 'bg-blue-500' : 'bg-safety-orange'">{{ item.type === 'FREE' ? '무료' : '회원전용' }}</span>
        </div>
        <h3 class="font-bold text-charcoal-900 group-hover:text-safety-orange transition-colors truncate">{{ item.title }}</h3>
      </div>
    </div>
  </div>
</template>
