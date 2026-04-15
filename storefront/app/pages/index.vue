<script setup lang="ts">
const { products, loading, error } = useProducts()

// Currency formatter for academic elegance
const formatPrice = (price?: number) => {
  if (price === undefined) return '문의'
  return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(price)
}
</script>

<template>
  <div class="pb-24 space-y-24">
    <!-- Archival Hero Section -->
    <section class="relative pt-32 pb-24 px-8 overflow-hidden rounded-[3rem] bg-navy-900 text-white min-h-[500px] flex items-center shadow-2xl">
      <!-- Blueprint Grid Overlay -->
      <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
      <div class="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-gold-500/10 to-transparent pointer-events-none"></div>
      
      <div class="relative z-10 max-w-5xl mx-auto text-left space-y-10">
        <div class="inline-flex items-center space-x-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
          <span class="w-2 h-2 bg-gold-500 rounded-full animate-pulse shadow-[0_0_10px_#f59e0b]"></span>
          <span class="text-xs font-bold tracking-widest uppercase text-gold-400">2026 Academic Archive Launched</span>
        </div>
        
        <h1 class="text-6xl md:text-8xl font-black leading-[1.1] tracking-tighter">
          지성의 깊이,<br />
          <span class="text-gold-500 italic">Pre-Mock</span> 권위.
        </h1>
        
        <p class="text-xl md:text-2xl text-slate-300 max-w-2xl leading-relaxed font-light">
          최상위권을 향한 단 하나의 궤적. 검증된 전문가 그룹이 설계한 <br class="hidden md:block" />
          독보적인 수험 솔루션으로 학문적 성취를 완성하십시오.
        </p>
        
        <div class="flex flex-wrap gap-6 pt-4">
          <CommonAppButton variant="secondary" size="lg">컬렉션 탐기</CommonAppButton>
          <CommonAppButton variant="outline" size="lg" class="border-white text-white hover:bg-white hover:text-navy-900">문의하기</CommonAppButton>
        </div>
      </div>
    </section>

    <!-- Product Grid Section -->
    <section class="max-w-7xl mx-auto px-6 space-y-16">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-slate-200 pb-12">
        <div class="space-y-4">
          <h2 class="text-4xl md:text-5xl font-extrabold text-navy-900 tracking-tight">Essential Documents</h2>
          <p class="text-lg text-slate-500 font-light">지금 이 순간 가장 권위 있는 수험 자료들을 선별했습니다.</p>
        </div>
        <NuxtLink to="/products" class="group flex items-center space-x-2 text-navy-900 font-bold hover:text-gold-600 transition-colors">
          <span>아카이브 전체보기</span>
          <span class="transform transition-transform group-hover:translate-x-1">&rarr;</span>
        </NuxtLink>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div v-for="i in 3" :key="i" class="basalt-card h-[500px] animate-pulse bg-slate-100/50"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="p-20 text-center bg-white border border-red-100 rounded-[3rem] shadow-xl">
        <div class="inline-flex p-4 bg-red-50 rounded-full mb-6 text-red-600">
          <Icon name="mdi:alert-circle" size="48" />
        </div>
        <p class="text-xl text-slate-900 font-bold">오류가 발생했습니다.</p>
        <p class="text-slate-500 mt-2 mb-8">데이터를 안정적으로 가져오지 못했습니다. 다시 시도해 주세요.</p>
        <CommonAppButton variant="primary" @click="products.refresh">다시 시도</CommonAppButton>
      </div>

      <!-- Data Display -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
        <CommonAppCard 
          v-for="product in products" 
          :key="product.id"
          :title="product.name"
          :description="product.description"
          :image="product.featuredAsset?.preview || 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6'"
          badge="In-Stock"
        >
          <div class="w-full flex items-center justify-between">
            <span class="text-2xl font-black text-navy-900 tracking-tight">
              {{ formatPrice(product.variants[0]?.price) }}
            </span>
            <CommonAppButton variant="primary" size="sm">구매하기</CommonAppButton>
          </div>
        </CommonAppCard>
      </div>
    </section>

    <!-- Global Trust Bar -->
    <section class="max-w-7xl mx-auto px-6 pt-12">
      <div class="p-12 bg-white rounded-[3rem] border border-slate-100 shadow-xl flex flex-wrap justify-between items-center gap-12 opacity-80">
        <div v-for="i in 4" :key="i" class="flex flex-col items-center space-y-2 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
          <span class="text-3xl font-black text-navy-900 italic">PUBLISHER.</span>
          <span class="text-[10px] font-bold tracking-[0.3em] uppercase text-slate-400">Institutional Partner</span>
        </div>
      </div>
    </section>
  </div>
</template>
