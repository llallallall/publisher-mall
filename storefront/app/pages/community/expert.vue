<template>
  <div class="max-w-[1200px] mx-auto px-4 py-20">
    <div class="border-b-2 border-charcoal-900 pb-6 mb-10">
      <h1 class="text-[28px] font-bold text-charcoal-900">전문가 답변 문의게시판</h1>
      <p class="text-[14px] text-gray-400 mt-1">서담 소속 교과 전문가들이 수험생 여러분의 학습 질문에 직접 답변해 드립니다.</p>
    </div>
    
    <div class="py-20 text-center border border-dashed border-gray-200 rounded-lg">
      <Icon name="ph:student-bold" class="text-5xl text-gray-200 mb-4" />
      <p class="text-gray-400 mb-4">로그인 후 질문을 남기실 수 있습니다.</p>
      <NuxtLink to="/login" class="px-6 py-2 bg-charcoal-900 text-white font-bold text-[13px] rounded-lg">로그인 하기</NuxtLink>
    </div>
  </div>
</template>
