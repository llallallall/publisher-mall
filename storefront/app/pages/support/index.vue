<script setup lang="ts">
const menus = [
  { title: '공지사항', desc: '서담의 새로운 소식을 전해드립니다.', to: '/support/notice', icon: 'ph:megaphone-bold' },
  { title: '혜택/이벤트', desc: '수험생을 위한 특별한 혜택을 확인하세요.', to: '/support/event', icon: 'ph:gift-bold' },
  { title: '자주 묻는 질문', desc: '궁금한 점을 빠르게 해결해 드립니다.', to: '/support/faq', icon: 'ph:question-bold' },
]
</script>

<template>
  <div class="max-w-[1200px] mx-auto px-4 py-20">
    <div class="border-b-2 border-charcoal-900 pb-6 mb-12">
      <h1 class="text-[32px] font-bold text-charcoal-900 italic serif">Customer Support.</h1>
      <p class="text-[15px] text-gray-400 mt-2">지혜를 담는 창고, 서담의 고객 지원 센터입니다.</p>
    </div>

    <div class="grid md:grid-cols-3 gap-6">
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
