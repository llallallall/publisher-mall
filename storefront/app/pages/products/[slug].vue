<script setup lang="ts">
const route = useRoute()
// Force refresh for component resolution
const router = useRouter()
const slug = route.params.slug as string
const { product, loading, error } = useProduct(slug)
const { addItem, openCart } = useCart()
const { success } = useToast()

const activeTab = ref<'info' | 'reviews' | 'qna' | 'shipping' | 'returns'>('info')
const isAdding = ref(false)

// 후기 데이터 로드
const { reviews, loading: reviewsLoading } = useReviews(computed(() => product.value?.id || ''))

const changeTab = (tabId: typeof activeTab.value) => {
  activeTab.value = tabId
  if (import.meta.client) {
    const el = document.getElementById('product-tabs-content')
    if (el) {
      window.scrollTo({ 
        top: el.offsetTop - 100, 
        behavior: 'smooth' 
      })
    }
  }
}

const formatPrice = (price?: number) => {
  if (price === undefined) return '문의'
  return new Intl.NumberFormat('ko-KR').format(price) + '원'
}

const handleAddToCart = async () => {
  const variantId = product.value?.variants?.[0]?.id
  if (!variantId) return
  isAdding.value = true
  try {
    await addItem(variantId, quantity.value)
    success(`장바구니에 ${quantity.value}개 담았습니다.`)
    openCart()
  } finally {
    isAdding.value = false
  }
}

const isBuying = ref(false)
const handleBuyNow = async () => {
  const variantId = product.value?.variants?.[0]?.id
  if (!variantId) return
  isBuying.value = true
  try {
    await addItem(variantId, quantity.value)
    router.push('/checkout')
  } finally {
    isBuying.value = false
  }
}

const quantity = ref(1)
const increaseQty = () => { quantity.value++ }
const decreaseQty = () => { if (quantity.value > 1) quantity.value-- }

const totalPrice = computed(() => {
  const unitPrice = product.value?.variants?.[0]?.price || 0
  return unitPrice * quantity.value
})

const tabs = [
  { id: 'info', name: '상품정보' },
  { id: 'reviews', name: '상품후기' },
  { id: 'qna', name: '상품문의' },
  { id: 'shipping', name: '배송/환불' },
]
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- Breadcrumb -->
    <div class="max-w-[1200px] mx-auto px-4 pt-8 pb-4 text-[12px] font-bold text-gray-300">
      <nav class="flex items-center gap-2">
        <NuxtLink to="/" class="hover:text-charcoal-900 transition-colors">HOME</NuxtLink>
        <span class="opacity-30">/</span>
        <NuxtLink to="/products" class="hover:text-charcoal-900 transition-colors">BOOKSTORE</NuxtLink>
        <span class="opacity-30">/</span>
        <span class="text-charcoal-900">DETAIL</span>
      </nav>
    </div>

    <!-- Loading / Error States -->
    <div v-if="loading" class="max-w-[1200px] mx-auto px-4 py-20 text-center">
      <div class="animate-pulse space-y-10">
        <div class="h-96 bg-gray-50 rounded-[3rem]" />
      </div>
    </div>
    
    <div v-else-if="error || !product" class="max-w-[1200px] mx-auto px-4 py-32 text-center space-y-8">
      <Icon name="ph:seal-warning-light" class="text-7xl text-gray-200 mx-auto" />
      <h1 class="text-2xl font-black text-charcoal-900">상품 정보를 불러올 수 없습니다.</h1>
      <NuxtLink to="/products" class="inline-flex h-14 px-10 items-center bg-charcoal-900 text-white rounded-2xl font-bold">서점으로 돌아가기</NuxtLink>
    </div>

    <!-- Product Main -->
    <div v-else>
      <div class="max-w-[1200px] mx-auto px-4 grid lg:grid-cols-[1fr_480px] gap-20 py-10">
        <!-- Gallery -->
        <div class="space-y-6">
          <div class="rounded-[3rem] overflow-hidden bg-charcoal-50 aspect-[4/5] shadow-premium group border border-gray-100">
            <NuxtImg 
              v-if="product.featuredAsset" 
              :src="product.featuredAsset.preview" 
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]" 
            />
          </div>
        </div>

        <!-- Order Panel -->
        <div class="space-y-10 lg:sticky lg:top-32 h-fit">
          <div class="space-y-4">
            <div class="flex gap-2">
              <span v-if="product.customFields?.targetGrade" class="px-2 py-1 bg-safety-orange/10 text-safety-orange text-[10px] font-black rounded uppercase tracking-widest">{{ product.customFields.targetGrade }}</span>
              <span class="px-2 py-1 bg-charcoal-900/5 text-charcoal-400 text-[10px] font-black rounded uppercase tracking-widest">{{ product.variants[0]?.sku }}</span>
            </div>
            <h1 class="text-4xl font-black text-charcoal-900 tracking-tighter leading-tight">{{ product.name }}</h1>
            <p class="text-3xl font-black text-charcoal-900 tracking-tighter">{{ formatPrice(product.variants[0]?.price) }}</p>
          </div>

          <div class="p-8 bg-charcoal-50 rounded-[2.5rem] border border-gray-100 space-y-4 font-bold text-sm">
            <div class="flex justify-between"><span class="text-gray-400">배송구분</span><span class="text-charcoal-900">전국 택배 배송 (평일 기준 익일 출고)</span></div>
            <div class="flex justify-between"><span class="text-gray-400">교재유형</span><span class="text-charcoal-900">{{ product.customFields?.materialType || '학습 자료' }}</span></div>
            <div class="flex justify-between"><span class="text-gray-400">수량 선택</span>
              <div class="flex items-center bg-white rounded-lg border border-gray-100 overflow-hidden">
                <button @click="decreaseQty" class="p-2 hover:bg-gray-50"><Icon name="ph:minus-fill" class="text-xs" /></button>
                <span class="w-10 text-center font-black">{{ quantity }}</span>
                <button @click="increaseQty" class="p-2 hover:bg-gray-50"><Icon name="ph:plus-fill" class="text-xs" /></button>
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <div class="flex items-end justify-between px-2">
              <span class="font-black text-charcoal-900">최종 합계</span>
              <span class="text-4xl font-black text-safety-orange tracking-tighter">{{ formatPrice(totalPrice) }}</span>
            </div>
            <div class="flex gap-4">
              <button @click="handleAddToCart" :disabled="isAdding" class="flex-1 h-16 border-2 border-charcoal-900 text-charcoal-900 rounded-2xl font-black hover:bg-charcoal-900 hover:text-white transition-all flex items-center justify-center gap-2">
                <Icon name="ph:shopping-cart-bold" class="text-xl" /> CART
              </button>
              <button @click="handleBuyNow" :disabled="isBuying" class="flex-1 h-16 bg-charcoal-900 text-white rounded-2xl font-black hover:bg-safety-orange transition-all shadow-xl shadow-charcoal-900/20">BUY NOW</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabbed Area -->
      <div id="product-tabs" class="mt-20 border-t border-gray-100">
        <div class="sticky top-0 bg-white/90 backdrop-blur-xl border-b border-gray-100 z-40">
          <div class="max-w-[1200px] mx-auto px-4 flex justify-center space-x-10 md:space-x-16">
            <button v-for="tab in tabs" :key="tab.id" @click="changeTab(tab.id as any)" :class="activeTab === tab.id ? 'text-charcoal-900 after:w-full' : 'text-gray-300 after:w-0 hover:text-gray-400'" class="relative h-20 font-black text-[15px] tracking-tighter flex items-center after:absolute after:bottom-0 after:left-0 after:h-1.5 after:bg-safety-orange after:transition-all after:duration-500">
              {{ tab.name }}
            </button>
          </div>
        </div>

        <div id="product-tabs-content" class="max-w-[1200px] mx-auto px-4 py-24 pb-48">
          <div class="max-w-4xl mx-auto">
            <ProductDescription v-if="activeTab === 'info'" :description="product.description" />
            <ProductReviews v-else-if="activeTab === 'reviews'" :reviews="reviews" :loading="reviewsLoading" />
            <ProductQna v-else-if="activeTab === 'qna'" />
            <ProductPolicies v-else-if="activeTab === 'shipping'" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.shadow-premium { box-shadow: 0 40px 80px -20px rgba(0,0,0,0.08); }
</style>
