<script setup lang="ts">
const menus = [
  { title: '전문가 답변 문의게시판', desc: '학습 전문가들이 직접 답변해 주는 고퀄리티 Q&A', to: '/community/expert', icon: 'ph:student-bold' },
  { title: '수험생 자유게시판', desc: '함께 달리는 동료들과 나누는 수험 생활 이야기', to: '/community/board', icon: 'ph:users-three-bold' },
]
</script>

<template>
  <div class="max-w-[1200px] mx-auto px-4 py-20">
    <div class="border-b-2 border-charcoal-900 pb-6 mb-12">
      <h1 class="text-[32px] font-bold text-charcoal-900 italic serif">Archive Community.</h1>
      <p class="text-[15px] text-gray-400 mt-2">지혜를 나누고 함께 성장하는 공간, 서담 소통실입니다.</p>
    </div>

    <div class="grid md:grid-cols-2 gap-6">
      <NuxtLink v-for="menu in menus" :key="menu.title" :to="menu.to" class="group p-8 bg-charcoal-50 rounded-2xl border border-gray-100 hover:border-safety-orange transition-all hover:shadow-xl hover:shadow-safety-orange/5 hover:-translate-y-1">
        <div class="w-14 h-14 bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-safety-orange transition-colors">
          <Icon :name="menu.icon" class="text-2xl text-gray-400 group-hover:text-white" />
        </div>
        <h3 class="text-xl font-bold text-charcoal-900 mb-2 group-hover:text-safety-orange">{{ menu.title }}</h3>
        <p class="text-[14px] text-gray-500 leading-relaxed">{{ menu.desc }}</p>
      </NuxtLink>
    </div>
  </div>
</template>
