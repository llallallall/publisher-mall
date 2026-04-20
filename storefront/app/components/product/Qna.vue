<script setup lang="ts">
const { success } = useToast()
</script>

<template>
  <div class="space-y-10 animate-in fade-in duration-700">
    <div class="flex items-center justify-between">
      <div class="space-y-1">
        <h4 class="text-2xl font-black text-charcoal-900 tracking-tight">상품 문의</h4>
        <p class="text-sm text-gray-400 font-medium">배송, 상품 구성 등 궁금한 점을 남겨주시면 답변 드립니다.</p>
      </div>
      <button @click="success('문의 기능은 현재 준비 중입니다.')" class="h-12 px-8 bg-charcoal-900 text-white rounded-xl font-bold text-[14px] hover:bg-safety-orange transition-all shadow-lg shadow-charcoal-900/10">문의하기</button>
    </div>
    
    <div class="divide-y divide-gray-100 border-t border-gray-100">
      <div v-for="i in 2" :key="i" class="py-10 space-y-6">
        <div class="flex items-start gap-4">
          <div class="w-10 h-10 bg-charcoal-50 rounded-xl flex items-center justify-center shrink-0"><span class="text-[10px] font-black text-gray-400">Q</span></div>
          <div class="space-y-1">
            <p class="text-[16px] font-black text-charcoal-900">{{ i === 1 ? '배송일정 관련 문의드립니다.' : 'PDF 파일 다운로드 횟수 제한이 있나요?' }}</p>
            <div class="flex items-center gap-2 text-[12px] font-bold text-gray-300"><span>test***</span><span class="w-1 h-1 bg-gray-200 rounded-full"></span><span>2026.04.18</span></div>
          </div>
        </div>
        <div class="pl-14">
          <div class="p-6 bg-charcoal-50 rounded-2xl border border-gray-100/50 space-y-3">
            <div class="flex items-center gap-2">
              <span class="text-[10px] font-black px-2 py-0.5 bg-safety-orange text-white rounded">ADMIN</span>
              <span class="text-[13px] font-black text-charcoal-900">서담 학습지원센터</span>
            </div>
            <p class="text-[14px] text-gray-600 leading-relaxed font-medium">
              {{ i === 1 ? '안녕하세요! 주문하신 상품은 익일 출고 예정입니다. 보통 결제 완료 후 1~2영업일 이내 수령 가능합니다.' : '서담의 디지털 자료는 평생 소장이 원칙이며, 다운로드 횟수에는 제한이 없습니다.' }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
