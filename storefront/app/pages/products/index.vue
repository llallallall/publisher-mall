<script setup lang="ts">
const route = useRoute()
const { products, loading, error } = await useProducts()

const searchQuery = ref('')
const activeGrade = ref<string>('전체')
const activeType = ref<'ALL' | 'PHYSICAL' | 'DIGITAL' | 'BUNDLE' | 'PACKAGE'>('ALL')
const activeMaterialType = ref<string>('전체')
const activeSort = ref<'NEW' | 'PRICE_ASC' | 'PRICE_DESC'>('NEW')

const grades = ['전체', '고3/N수', '고2', '고1', '공통']
const types = [
  { label: '전체상품', value: 'ALL' },
  { label: '시그니처 패키지', value: 'BUNDLE' },
  { label: '디지털 단행본', value: 'DIGITAL' },
]
const materialTypes = ['전체', '문서', '음성', '영상']
const sortOptions = [
  { label: '최신순', value: 'NEW' },
  { label: '낮은 가격순', value: 'PRICE_ASC' },
  { label: '높은 가격순', value: 'PRICE_DESC' },
]

// 동기화: URL 쿼리 파라미터 -> 상태 반영
const syncFilters = () => {
  if (route.query.type) {
    const qType = route.query.type as string
    activeType.value = (qType === 'PACKAGE' ? 'BUNDLE' : qType) as any
  } else {
    activeType.value = 'ALL'
  }

  if (route.query.grade) {
    activeGrade.value = route.query.grade as string
  } else {
    activeGrade.value = '전체'
  }
}

onMounted(syncFilters)
watch(() => route.query, syncFilters)

const filteredProducts = computed(() => {
  let list = products.value.filter((p: any) => {
    // Search
    const matchesSearch = p.name.includes(searchQuery.value) || p.description?.includes(searchQuery.value)
    // Grade Filter
    const matchesGrade = activeGrade.value === '전체' || p.customFields?.targetGrade === activeGrade.value
    // Type Filter
    const pType = p.variants?.[0]?.customFields?.productType
    const matchesType = activeType.value === 'ALL' || pType === activeType.value
    // Material Type Filter (only for Grade-based view or common)
    const matchesMaterial = activeMaterialType.value === '전체' || p.customFields?.materialType === activeMaterialType.value
    
    return matchesSearch && matchesGrade && matchesType && matchesMaterial
  })

  // Sorting
  if (activeSort.value === 'PRICE_ASC') {
    list.sort((a, b) => (a.variants[0]?.price || 0) - (b.variants[0]?.price || 0))
  } else if (activeSort.value === 'PRICE_DESC') {
    list.sort((a, b) => (b.variants[0]?.price || 0) - (a.variants[0]?.price || 0))
  } else {
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  return list
})

const formatPrice = (price?: number) => {
  if (price === undefined) return '문의'
  return new Intl.NumberFormat('ko-KR').format(price) + '원'
}
</script>

<template>
  <div class="mx-auto max-w-[1200px] px-4 py-12">
    <!-- ===== PAGE HEADER ===== -->
    <div class="border-b-2 border-charcoal-900 pb-6 mb-8">
      <h1 class="text-[32px] font-bold text-charcoal-900">
        {{ activeType === 'BUNDLE' ? '시그니처 패키지' : activeType === 'DIGITAL' ? '디지털 단행본' : '학년별 자료' }}
      </h1>
      <p class="text-[15px] text-gray-400 mt-2">서담의 엄선된 콘텐츠를 직접 확인하고 구매하세요.</p>
    </div>

    <!-- ===== FILTERS & SEARCH ===== -->
    <div class="bg-charcoal-50 p-7 rounded-2xl mb-12 space-y-8 border border-gray-100">
      <!-- Grade Logic Filter (학년별 자료에서만 보임) -->
      <div v-if="activeType === 'ALL'" class="space-y-6">
        <div class="flex items-start gap-6">
          <span class="text-[15px] font-bold text-charcoal-900 w-24 pt-1.5 flex-shrink-0">학년 선택</span>
          <div class="flex flex-wrap gap-3">
            <button 
              v-for="grade in grades" :key="grade"
              @click="activeGrade = grade"
              class="px-6 py-2 text-[14px] font-medium rounded-lg border transition-all"
              :class="activeGrade === grade ? 'bg-charcoal-900 text-white border-charcoal-900 shadow-lg shadow-charcoal-900/10' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'"
            >
              {{ grade }}
            </button>
          </div>
        </div>

        <div class="flex items-start gap-6 border-t border-dashed border-gray-200 pt-6">
          <span class="text-[15px] font-bold text-charcoal-900 w-24 pt-1.5 flex-shrink-0">자료 유형</span>
          <div class="flex flex-wrap gap-3">
            <button 
              v-for="mType in materialTypes" :key="mType"
              @click="activeMaterialType = mType"
              class="px-6 py-2 text-[14px] font-medium rounded-lg border transition-all"
              :class="activeMaterialType === mType ? 'bg-safety-orange text-white border-safety-orange shadow-lg shadow-safety-orange/10' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'"
            >
              {{ mType }}
            </button>
          </div>
        </div>
      </div>

      <!-- Search & Sort Row -->
      <div class="flex flex-col md:flex-row items-center justify-between gap-6 pt-2">
        <!-- Search bar -->
        <div class="relative w-full md:max-w-md">
          <Icon name="ph:magnifying-glass-bold" class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="상품 제목 또는 키워드를 입력해 주세요"
            class="w-full h-12 pl-12 pr-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-safety-orange text-[14px] shadow-sm transition-all focus:ring-4 focus:ring-safety-orange/5"
          />
        </div>

        <!-- Sort Select -->
        <div class="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <button 
            v-for="opt in sortOptions" :key="opt.value"
            @click="activeSort = opt.value as any"
            class="whitespace-nowrap text-[13px] font-bold transition-colors"
            :class="activeSort === opt.value ? 'text-safety-orange' : 'text-gray-400 hover:text-charcoal-900'"
          >
            {{ opt.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- ===== PRODUCT GRID ===== -->
    <div v-if="loading" class="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-16">
      <div v-for="i in 8" :key="i" class="animate-pulse space-y-4">
        <div class="aspect-[3/4.2] bg-gray-100 rounded-2xl"></div>
        <div class="h-5 bg-gray-100 rounded w-3/4"></div>
        <div class="h-4 bg-gray-100 rounded w-1/2"></div>
      </div>
    </div>

    <div v-else-if="filteredProducts.length === 0" class="py-40 text-center border-2 border-dashed border-gray-100 rounded-[2rem] flex flex-col items-center">
      <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
        <Icon name="ph:magnifying-glass-light" class="text-4xl text-gray-200" />
      </div>
      <p class="text-gray-400 font-medium text-lg">찾으시는 자료가 현재 창고에 없습니다.</p>
      <button @click="searchQuery = ''; activeGrade = '전체'; activeMaterialType = '전체'" class="mt-4 text-safety-orange text-[14px] font-bold underline">필터 초기화</button>
    </div>

    <div v-else class="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-16">
      <NuxtLink 
        v-for="product in filteredProducts" 
        :key="product.id"
        :to="`/products/${product.slug}`"
        class="group flex flex-col"
      >
        <!-- Product Card Image -->
        <div class="relative aspect-[3/4.2] rounded-2xl overflow-hidden mb-6 bg-charcoal-50 border border-transparent group-hover:border-safety-orange/20 transition-all duration-500 shadow-sm group-hover:shadow-xl group-hover:shadow-safety-orange/5 group-hover:-translate-y-1">
          <NuxtImg 
            v-if="product.featuredAsset?.preview"
            :src="product.featuredAsset.preview" 
            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
          />
          <div v-else class="w-full h-full flex items-center justify-center">
            <Icon name="ph:books-light" class="text-5xl text-gray-200" />
          </div>
          
          <!-- Type Badge -->
          <div class="absolute top-4 left-4 flex gap-1.5">
            <span v-if="product.variants[0]?.customFields?.productType === 'BUNDLE'" class="px-3 py-1 bg-safety-orange text-white text-[10px] font-black italic rounded-lg shadow-lg">PACKAGE</span>
            <span v-if="product.variants[0]?.customFields?.productType === 'DIGITAL'" class="px-3 py-1 bg-charcoal-900 text-white text-[10px] font-black italic rounded-lg shadow-lg">DIGITAL</span>
          </div>
          
          <!-- Hover Overlay -->
          <div class="absolute inset-0 bg-charcoal-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
            <span class="px-6 py-2.5 bg-white text-charcoal-900 text-[13px] font-bold rounded-full shadow-2xl">자료 상세보기</span>
          </div>
        </div>

        <!-- Product Details -->
        <div class="space-y-4 px-1">
          <div class="flex items-center gap-2">
            <span class="text-[10px] font-black text-safety-orange uppercase tracking-widest">{{ product.customFields?.targetGrade || '공통' }}</span>
            <div class="h-px w-4 bg-gray-200"></div>
            <span class="text-[10px] font-bold text-gray-400">{{ product.customFields?.materialType || '일반' }}</span>
          </div>
          
          <h3 class="text-[17px] font-bold text-charcoal-900 leading-snug line-clamp-2 h-12 group-hover:text-safety-orange transition-colors">
            {{ product.name }}
          </h3>
          
          <div class="pt-2 flex flex-col justify-end">
            <span v-if="product.variants[0]?.price === 0" class="text-[18px] font-black text-blue-500">FREE</span>
            <span v-else class="text-[20px] font-black text-charcoal-900">{{ formatPrice(product.variants[0]?.price) }}</span>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
