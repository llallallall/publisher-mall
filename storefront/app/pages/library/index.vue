<script setup lang="ts">
const menus = [
  { title: '연계양상 및 등급컷', desc: '연계 양상 분석 및 실전 등급컷 정보', to: '/library/analysis', icon: 'ph:chart-line-up-bold', tags: ['무료', '회원전용'] },
  { title: '정답 및 해설', desc: '모의고사 정답표 및 상세 해설 PDF', to: '/library/answers', icon: 'ph:file-pdf-bold', tags: ['무료', '회원전용'] },
  { title: '영상 자료', desc: '주요 문항 해설 및 학습 전략 가이드 영상', to: '/library/video', icon: 'ph:video-camera-bold', tags: ['회원전용'] },
  { title: '파일 자료', desc: '학습 보충 자료 및 시크릿 압축 정리본', to: '/library/files', icon: 'ph:folder-open-bold', tags: ['무료', '회원전용'] },
]
</script>

<template>
  <div class="max-w-[1200px] mx-auto px-4 py-20">
    <div class="border-b-2 border-charcoal-900 pb-6 mb-12">
      <h1 class="text-[32px] font-bold text-charcoal-900 italic serif">Learning Archive.</h1>
      <p class="text-[15px] text-gray-400 mt-2">이감의 분석 노하우가 담긴 방대한 학습 데이터베이스입니다.</p>
    </div>

    <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      <NuxtLink v-for="menu in menus" :key="menu.title" :to="menu.to" class="group p-8 bg-charcoal-50 rounded-2xl border border-gray-100 hover:border-safety-orange transition-all hover:shadow-xl hover:shadow-safety-orange/5 hover:-translate-y-1">
        <div class="w-14 h-14 bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-safety-orange transition-colors">
          <Icon :name="menu.icon" class="text-2xl text-gray-400 group-hover:text-white" />
        </div>
        <div class="flex flex-wrap gap-1 mb-3">
          <span v-for="tag in menu.tags" :key="tag" class="text-[9px] font-bold px-1.5 py-0.5 rounded" :class="tag === '무료' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'">{{ tag }}</span>
        </div>
        <h3 class="text-[17px] font-bold text-charcoal-900 mb-2 group-hover:text-safety-orange">{{ menu.title }}</h3>
        <p class="text-[13px] text-gray-500 leading-relaxed">{{ menu.desc }}</p>
      </NuxtLink>
    </div>
  </div>
</template>
