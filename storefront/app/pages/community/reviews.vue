<script setup lang="ts">
const reviews = [
  { 
    id: 1, 
    author: '김*수 (서울대 의예과 합격)', 
    title: '서담 연간 패키지만으로 국어 1등급 달성', 
    body: '타 플랫폼의 수많은 교재 중 서담을 선택한 건 자료의 깊이 때문이었습니다. 특히 시그니처 패키지에 포함된 분석 PDF는 수능 당일까지 정말 큰 도움이 되었습니다.',
    grade: '고3/N수' 
  },
  { 
    id: 2, 
    author: '이*영 (고려대 국어교육과 합격)', 
    title: '간쓸개 루틴이 가져온 변화', 
    body: '매일 아침 서담의 간쓸개 팩으로 훈련한 결과, 흔들리지 않는 국어 실력을 갖추게 되었습니다. 수기에서 추천하는 학습법을 꼭 확인해보세요.',
    grade: '고3/N수' 
  },
  { 
    id: 3, 
    author: '최*민 (고2 학부모)', 
    title: '아이의 국어 기초, 서담으로 잡았습니다', 
    body: '고1부터 서담 기초 패키지를 구독했습니다. 단순히 문제만 푸는 게 아니라 아카이브의 해설 영상을 보며 학습하는 습관이 생겼어요.',
    grade: '고1/고2' 
  }
]

useSeoMeta({
  title: '합격의 기록 :: 서담 (書湛)',
  description: '서담과 함께 꿈을 이룬 수험생들의 생생한 학습 수기입니다.'
})
</script>

<template>
  <div class="mx-auto max-w-[1200px] px-4 py-20">
    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
      <div class="space-y-4">
        <h1 class="text-4xl font-bold text-charcoal-900 tracking-tight">합격의 기록</h1>
        <p class="text-gray-500 max-w-lg leading-relaxed">
          서담의 전문적인 커리큘럼을 통해 목표를 달성한 수험생들의 이야기입니다.
          성실한 노력과 서담의 깊이가 만나 이룩한 결과를 확인하세요.
        </p>
      </div>
      <NuxtLink to="/support/qa" class="inline-flex items-center gap-2 px-6 py-3 bg-safety-orange text-white rounded-xl font-bold text-sm hover:brightness-110 transition-all">
        나의 합격 수기 작성하기
        <Icon name="ph:pencil-line-bold" />
      </NuxtLink>
    </div>

    <!-- Review Grid -->
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div 
        v-for="review in reviews" 
        :key="review.id"
        class="bg-white border border-gray-200 rounded-3xl p-8 hover:border-safety-orange/30 hover:shadow-premium transition-all group cursor-pointer"
      >
        <div class="text-[11px] font-bold text-safety-orange mb-4 px-2 py-0.5 bg-safety-orange/5 inline-block rounded-md tracking-widest uppercase">
          {{ review.grade }}
        </div>
        <h3 class="text-xl font-bold text-charcoal-900 mb-4 group-hover:text-safety-orange transition-colors">
          "{{ review.title }}"
        </h3>
        <p class="text-gray-500 text-[14px] leading-relaxed mb-8 line-clamp-4">
          {{ review.body }}
        </p>
        <div class="flex items-center justify-between pt-6 border-t border-gray-100">
          <span class="text-[13px] font-bold text-charcoal-900">{{ review.author }}</span>
          <div class="flex text-yellow-400 gap-0.5">
            <Icon v-for="i in 5" :key="i" name="ph:star-fill" class="w-3 h-3" />
          </div>
        </div>
      </div>
    </div>

    <!-- Strategy Banner -->
    <div class="mt-24 p-12 bg-charcoal-50 rounded-[3rem] text-center space-y-6 border border-gray-200">
      <h2 class="text-2xl font-bold text-charcoal-900">당신의 성공 스토리도 서담의 자산이 됩니다</h2>
      <p class="text-gray-500">합격 수기 작성 시 모든 디지털 자료 이용권 및 서담 포인트 50,000점 증정</p>
      <NuxtLink to="/register" class="inline-flex px-8 py-4 bg-charcoal-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-all">
        지금 서담 시작하기
      </NuxtLink>
    </div>
  </div>
</template>
