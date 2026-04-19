<script setup lang="ts">
const items = [
  { id: 1, title: '문학 필수 개념어 요약집 (PDF)', type: 'FREE', size: '2.4MB' },
  { id: 2, title: '2026학년도 수능특강 시크릿 압축 정리본', type: 'MEMBER', size: '15.1MB' },
]
</script>

<template>
  <div class="max-w-[1200px] mx-auto px-4 py-20">
    <div class="border-b-2 border-charcoal-900 pb-6 mb-10 flex items-end justify-between">
      <div>
        <h1 class="text-[28px] font-bold text-charcoal-900">파일 자료</h1>
        <p class="text-[14px] text-gray-400 mt-1">학습에 도움이 되는 다양한 보충 자료 및 워크북 PDF를 제공합니다.</p>
      </div>
      <div class="flex gap-3 text-[12px] font-bold">
        <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-blue-500"></span> 무료</span>
        <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-safety-orange"></span> 회원전용</span>
      </div>
    </div>
    
    <div class="space-y-4">
      <div v-for="item in items" :key="item.id" class="flex items-center justify-between p-5 bg-charcoal-50 rounded-xl hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-gray-200 cursor-pointer">
        <div class="flex items-center gap-4">
          <span :class="item.type === 'FREE' ? 'bg-blue-500' : 'bg-safety-orange'" class="text-white text-[10px] font-bold px-2 py-1 rounded">{{ item.type === 'FREE' ? '무료' : '회원전용' }}</span>
          <div class="flex items-center gap-2">
            <Icon name="ph:file-pdf-light" class="text-xl text-red-500" />
            <h3 class="font-bold text-charcoal-900">{{ item.title }}</h3>
          </div>
        </div>
        <div class="flex items-center gap-4">
          <span class="text-[11px] text-gray-400 font-serif">{{ item.size }}</span>
          <button class="flex items-center gap-2 text-[13px] font-bold text-gray-500 hover:text-safety-orange transition-colors">
            <Icon name="ph:download-simple-bold" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
