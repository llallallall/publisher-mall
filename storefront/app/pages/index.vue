<script setup lang="ts">
const { products, loading: productsLoading, error: productsError, refresh: productsRefresh } = await useProducts()
const { addItem, openCart } = useCart()

const handleRefresh = () => {
  productsRefresh()
}

const formatPrice = (price?: number) => {
  if (price === undefined) return '문의'
  return new Intl.NumberFormat('ko-KR').format(price) + '원'
}

const quickLinks = [
  { label: '공지사항', to: '/support/notice', icon: 'ph:megaphone-bold' },
  { label: '연계양상 분석', to: '/library/analysis', icon: 'ph:chart-line-up-bold' },
  { label: '혜택/이벤트', to: '/support/event', icon: 'ph:gift-bold' },
  { label: '자주 묻는 질문', to: '/support/faq', icon: 'ph:question-bold' },
]

useSeoMeta({
  title: '서담 (書湛) :: 지혜로운 책을 깊게 담다',
  ogTitle: '서담 (書湛) :: 프리미엄 학문 아카이브',
  description: '단순한 서점을 넘어선 지혜의 창고, 서담. 서담의 노하우가 집약된 독보적인 국어 학습 콘텐츠와 디지털 자료를 제공합니다.',
})
</script>

<template>
  <div class="bg-white">
    <!-- ===== SECTION 0: Premium Hero Banner ===== -->
    <section class="relative bg-charcoal-900 overflow-hidden min-h-[500px] md:h-[650px] flex items-center">
      <!-- Background Elements -->
      <div class="absolute inset-0 z-0">
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.08)_0%,transparent_70%)]"></div>
        <div class="absolute inset-0 opacity-[0.03] pointer-events-none" style="background-image: radial-gradient(#fff 0.5px, transparent 0.5px); background-size: 24px 24px;"></div>
      </div>

      <div class="relative z-10 mx-auto max-w-[1200px] px-4 w-full grid md:grid-cols-2 items-center gap-16 py-20">
        <div class="space-y-10">
          <div class="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
            <span class="w-1.5 h-1.5 rounded-full bg-safety-orange animate-pulse"></span>
            <span class="text-[11px] font-black text-white/50 uppercase tracking-[0.2em]">Premium Academic Archive</span>
          </div>
          <h1 class="text-5xl md:text-7xl font-black text-white leading-[1.05] tracking-tighter">
            지혜를 담는<br />
            깊고 푸른 창고,<br />
            <span class="text-safety-orange">서담 (書湛)</span>
          </h1>
          <p class="text-[16px] md:text-[19px] text-white/40 font-medium leading-relaxed max-w-lg">
            단순한 도서 판매를 넘어, 지식의 깊이를 더하는 아카이브 시스템.<br class="hidden md:block" />
            서담의 엄선된 국어 학습 콘텐츠를 만나보세요.
          </p>
          <div class="flex flex-wrap items-center gap-5 pt-4">
            <NuxtLink to="/products" class="h-16 px-10 flex items-center bg-white text-charcoal-900 rounded-2xl font-black text-[16px] hover:bg-safety-orange transition-all duration-300 transform hover:-translate-y-1 shadow-xl shadow-white/5">
              교재 리스트 보기
            </NuxtLink>
            <NuxtLink to="/about" class="h-16 px-10 flex items-center border border-white/20 text-white rounded-2xl font-bold text-[16px] hover:bg-white/5 transition-all">
              브랜드 이야기
            </NuxtLink>
          </div>
        </div>
        
        <!-- Hero Visual Object -->
        <div class="hidden md:block relative animate-float">
          <div class="relative w-full aspect-square max-w-[480px] ml-auto">
            <div class="absolute inset-0 bg-gradient-to-br from-charcoal-800 to-charcoal-900 rounded-[4rem] rotate-6 border border-white/10 shadow-2xl overflow-hidden glass-reflection">
              <div class="absolute inset-0 flex items-center justify-center p-12">
                <div class="text-center space-y-4">
                  <div class="text-[80px] font-black text-white/90 leading-none">書湛</div>
                  <div class="h-0.5 w-12 bg-safety-orange mx-auto"></div>
                  <div class="text-[14px] font-bold text-gray-500 tracking-[0.5em] uppercase">Archive</div>
                </div>
              </div>
            </div>
            <!-- Floating Badges -->
            <div class="absolute -top-6 -right-6 w-32 h-32 bg-white rounded-3xl shadow-2xl flex flex-col items-center justify-center -rotate-12 border border-gray-100">
              <span class="text-[24px] font-black text-charcoal-900">2026</span>
              <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Edition</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== SECTION 1: Strategic Quick Links ===== -->
    <section class="relative z-20 -mt-12 mx-auto max-w-[1200px] px-4">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <NuxtLink 
          v-for="link in quickLinks" :key="link.label" :to="link.to"
          class="group flex flex-col items-start gap-4 p-8 bg-white border border-gray-100 rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:border-safety-orange transition-all duration-500 hover:-translate-y-2"
        >
          <div class="w-12 h-12 rounded-2xl bg-charcoal-50 flex items-center justify-center text-charcoal-900 group-hover:bg-safety-orange group-hover:text-white transition-all duration-500">
            <Icon :name="link.icon" class="text-2xl" />
          </div>
          <span class="text-[16px] font-black text-charcoal-900 tracking-tight">{{ link.label }}</span>
        </NuxtLink>
      </div>
    </section>

    <!-- ===== SECTION 2: Best Sellers / Archive ===== -->
    <section class="mx-auto max-w-[1200px] px-4 py-32">
      <div class="flex items-end justify-between mb-16 px-2">
        <div>
          <h2 class="text-4xl font-black text-charcoal-900 tracking-tighter mb-4">Best Archive.</h2>
          <p class="text-[15px] text-gray-400 font-medium">수험생들이 가장 많이 찾는 서담의 시그니처 콘텐츠</p>
        </div>
        <NuxtLink to="/products" class="group flex items-center gap-2 text-[14px] font-bold text-gray-400 hover:text-charcoal-900 transition-colors">
          전체 보기
          <Icon name="ph:arrow-right-bold" class="group-hover:translate-x-1 transition-transform" />
        </NuxtLink>
      </div>

      <div v-if="productsLoading && products.length === 0" class="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div v-for="i in 4" :key="i" class="aspect-[3/4] bg-charcoal-50 rounded-[2.5rem] animate-pulse" />
      </div>
      
      <div v-else-if="products.length === 0" class="py-32 text-center bg-charcoal-50 rounded-[3rem] border border-dashed border-gray-200">
        <Icon name="ph:package-light" class="text-6xl text-gray-200 mb-6" />
        <p class="text-gray-400 font-bold text-lg">등록된 상품이 없습니다.</p>
        <button @click="handleRefresh" class="mt-4 px-6 py-2 bg-charcoal-900 text-white rounded-full text-[12px] font-bold">새로고침</button>
      </div>

      <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
        <NuxtLink 
          v-for="product in products.slice(0, 8)" :key="product.id"
          :to="`/products/${product.slug}`"
          class="group block"
        >
          <div class="relative aspect-[3/4.2] bg-charcoal-50 rounded-[2.5rem] overflow-hidden mb-6 border border-gray-100 group-hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] group-hover:border-transparent transition-all duration-500">
            <NuxtImg v-if="product.featuredAsset?.preview" :src="product.featuredAsset.preview" class="w-full h-full object-cover group-hover:scale-110 transition-all duration-1000" />
            <div v-else class="w-full h-full flex items-center justify-center bg-gray-50"><Icon name="ph:books-light" class="text-5xl text-gray-200" /></div>
            
            <!-- Quick Overlays -->
            <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6 text-center">
              <span class="text-white text-sm font-bold border border-white/30 px-4 py-2 rounded-full backdrop-blur-md">자세히 보기</span>
            </div>
          </div>
          <div class="space-y-2 px-2">
            <div class="flex gap-2 mb-2">
              <span class="text-[9px] font-black uppercase tracking-[0.2em] text-safety-orange px-2 py-0.5 bg-safety-orange/10 rounded-full">Best</span>
            </div>
            <h3 class="font-bold text-charcoal-900 text-lg group-hover:text-safety-orange transition-colors truncate tracking-tight">
              {{ product.name }}
            </h3>
            <p class="text-[17px] font-black text-charcoal-900 tracking-tighter">{{ formatPrice(product.variants?.[0]?.price) }}</p>
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- ===== SECTION 3: Knowledge / Columns ===== -->
    <section class="bg-charcoal-900 py-32 overflow-hidden relative">
      <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-safety-orange/5 blur-[120px] rounded-full"></div>
      
      <div class="max-w-[1200px] mx-auto px-4 relative z-10">
        <div class="flex items-end justify-between mb-16">
          <div class="text-white">
            <h2 class="text-4xl font-black tracking-tighter mb-4">학습 전문가의 시선.</h2>
            <p class="text-white/40 font-medium">단순 문제 풀이를 넘어선 깊이 있는 분석</p>
          </div>
          <NuxtLink to="/library/analysis" class="text-[14px] font-bold text-white/30 hover:text-white transition-colors">지식 센터 바로가기</NuxtLink>
        </div>
        
        <div class="grid md:grid-cols-2 gap-8">
          <div v-for="i in 2" :key="i" class="group p-10 bg-white/5 border border-white/10 rounded-[2.5rem] hover:bg-white/10 hover:border-white/20 transition-all duration-500 flex flex-col md:flex-row gap-8">
            <div class="w-24 h-24 bg-white/5 rounded-2xl flex-shrink-0 flex items-center justify-center border border-white/5 group-hover:scale-105 transition-transform">
              <Icon name="ph:article-black-bold" class="text-3xl text-white/20" />
            </div>
            <div class="space-y-4">
              <div class="flex items-center gap-2">
                <span class="w-1 h-1 rounded-full bg-safety-orange"></span>
                <span class="text-[11px] font-bold text-safety-orange uppercase tracking-widest">Premium Column</span>
              </div>
              <h4 class="text-xl font-bold text-white group-hover:text-safety-orange transition-colors">{{ i === 1 ? '2027 수능 국어 고득점 전략' : '바탕 모의고사 연계 분석 리포트' }}</h4>
              <p class="text-[14px] text-white/40 leading-relaxed line-clamp-2">서담의 분석위원들이 제안하는 이번 시즌 핵심 학습 키워드와 연계 양상을 분석합니다.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}
.animate-float {
  animation: float 6s ease-in-out infinite;
}
.glass-reflection::after {
  content: '';
  position: absolute;
  top: 0;
  left: -50%;
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, transparent, rgba(255,255,255,0.05), transparent);
  transform: skewX(-25deg);
  transition: 0.7s;
}
.group:hover .glass-reflection::after {
  left: 150%;
}
</style>
