<script setup lang="ts">
defineProps<{
  description: string
}>()
</script>

<template>
  <div class="space-y-12 animate-in fade-in duration-700">
    <div class="bg-charcoal-50 p-8 md:p-10 rounded-2xl border border-gray-100">
      <h4 class="text-lg font-bold text-charcoal-900 mb-6 flex items-center gap-2">
        <Icon name="ph:info-bold" class="text-safety-orange" />
        상품 상세 소개
      </h4>
      <div 
        class="prose prose-slate max-w-none text-[15px] text-gray-600 leading-relaxed font-medium" 
        v-html="description"
      />
    </div>
    
    <div 
      v-if="!description?.includes('<img')" 
      class="w-full aspect-video bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center space-y-4"
    >
      <div class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm">
        <Icon name="ph:image-square-light" class="text-3xl text-gray-200" />
      </div>
      <p class="text-[14px] text-gray-400 font-bold">상세 이미지 준비 중입니다.</p>
    </div>
  </div>
</template>
