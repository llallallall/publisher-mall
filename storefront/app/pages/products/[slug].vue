<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const slug = route.params.slug as string
const { product, loading, error } = useProduct(slug)
const { addItem, openCart } = useCart()
const { success } = useToast()

const activeTab = ref<'info' | 'reviews' | 'qna' | 'shipping' | 'returns'>('info')
const isAdding = ref(false)
const { reviews, loading: reviewsLoading, addReview, refresh: refreshReviews } = useReviews(product.value?.id || '')

const newReview = ref({
  authorName: '',
  rating: 5,
  body: ''
})
const isSubmittingReview = ref(false)

const handleAddReview = async () => {
  if (!newReview.value.body || !newReview.value.authorName) return
  isSubmittingReview.value = true
  await addReview(newReview.value.authorName, newReview.value.rating, newReview.value.body)
  success('Review submitted for approval.')
  newReview.value = { authorName: '', rating: 5, body: '' }
  isSubmittingReview.value = false
}

const formatPrice = (price?: number) => {
  if (price === undefined) return '문의'
  return new Intl.NumberFormat('ko-KR').format(price) + '원'
}

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(date))
}

const handleAddToCart = async () => {
  const variantId = product.value?.variants?.[0]?.id
  if (!variantId) return
  
  isAdding.value = true
  try {
    await addItem(variantId, quantity.value)
    success(`장바구니에 ${quantity.value}개 담았습니다.`)
    openCart()
  } catch (e) {
    console.error('장바구니 추가 실패:', e)
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
  } catch (e) {
    console.error('구매 처리 실패:', e)
  } finally {
    isBuying.value = false
  }
}

const previewUrl = computed(() => {
  return product.value?.variants?.[0]?.customFields?.digitalMaterialUrl || '/assets/placeholder-preview.pdf'
})

const quantity = ref(1)
const increaseQty = () => { quantity.value++ }
const decreaseQty = () => { if (quantity.value > 1) quantity.value-- }

const totalPrice = computed(() => {
  const unitPrice = product.value?.variants?.[0]?.price
  if (!unitPrice) return 0
  return unitPrice * quantity.value
})

const tabs = [
  { id: 'info', name: '상품정보' },
  { id: 'reviews', name: '상품후기' },
  { id: 'qna', name: '상품문의' },
  { id: 'shipping', name: '배송정보' },
  { id: 'returns', name: '교환/반품' },
]
</script>

<template>
  <div class="min-h-screen">
    <!-- Breadcrumb -->
    <div class="max-w-[1200px] mx-auto px-4 pt-6 pb-2">
      <nav class="flex items-center gap-2 text-[12px] font-medium text-gray-400">
        <NuxtLink to="/" class="hover:text-charcoal-900 transition-colors">홈</NuxtLink>
        <Icon name="ph:caret-right" class="text-[9px] opacity-40" />
        <NuxtLink to="/products" class="hover:text-charcoal-900 transition-colors">온라인 서점</NuxtLink>
        <Icon name="ph:caret-right" class="text-[9px] opacity-40" />
        <span class="text-charcoal-900 font-bold">상세정보</span>
      </nav>
    </div>

    <!-- Loading Skeleton -->
    <div v-if="loading" class="max-w-[1200px] mx-auto px-4 py-10">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div class="animate-pulse bg-charcoal-50 rounded-2xl aspect-[4/5]" />
        <div class="animate-pulse space-y-6 pt-4">
          <div class="h-6 bg-charcoal-50 rounded-lg w-32" />
          <div class="h-10 bg-charcoal-50 rounded-lg w-3/4" />
          <div class="h-5 bg-charcoal-50 rounded-lg w-1/2" />
          <div class="h-12 bg-charcoal-50 rounded-lg w-48 mt-8" />
          <div class="h-14 bg-charcoal-50 rounded-xl w-full mt-8" />
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error || !product" class="max-w-[1200px] mx-auto px-4 py-24">
      <div class="text-center py-24 space-y-6 bg-charcoal-50 rounded-2xl">
        <Icon name="ph:warning-circle-light" class="text-5xl text-gray-300" />
        <h1 class="text-xl font-bold text-charcoal-900">상품을 찾을 수 없습니다.</h1>
        <NuxtLink to="/products">
          <CommonAppButton variant="outline">온라인 서점으로 돌아가기</CommonAppButton>
        </NuxtLink>
      </div>
    </div>

    <!-- Product Detail -->
    <div v-else>
      <!-- --- 상품 상단 영역 (이미지 + 구매정보) --- -->
      <div class="max-w-[1200px] mx-auto px-4 py-8">
        <div class="grid grid-cols-1 lg:grid-cols-[520px_1fr] gap-10 lg:gap-16 items-start">
          
          <!-- 상품 이미지 -->
          <div class="lg:sticky lg:top-[180px]">
            <div class="relative rounded-2xl overflow-hidden bg-charcoal-50 border border-gray-100 aspect-[4/5] shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
              <NuxtImg 
                v-if="product.featuredAsset?.preview"
                :src="product.featuredAsset.preview" 
                :alt="product.name"
                class="w-full h-full object-cover hover:scale-[1.03] transition-transform duration-[1500ms]" 
              />
              <div v-else class="w-full h-full flex flex-col items-center justify-center text-gray-300">
                <Icon name="ph:book-open-light" class="text-7xl mb-3" />
                <span class="text-sm font-medium">이미지 준비중</span>
              </div>
            </div>
          </div>

          <!-- 구매정보 패널 -->
          <div class="space-y-8 pt-2">
            <!-- 뱃지 -->
            <div class="flex items-center gap-2">
              <span v-if="product.variants[0]?.customFields?.productType" class="px-3 py-1 bg-charcoal-900 text-white text-[11px] font-bold rounded-md">
                {{ product.variants[0]?.customFields?.productType === 'DIGITAL' ? '디지털' : product.variants[0]?.customFields?.productType === 'PACKAGE' ? '패키지' : '실물 교재' }}
              </span>
              <span v-if="product.customFields?.targetGrade" class="px-3 py-1 bg-safety-orange text-white text-[11px] font-bold rounded-md">
                {{ product.customFields.targetGrade }}
              </span>
            </div>

            <!-- 상품명 -->
            <div class="space-y-3">
              <h1 class="text-[28px] md:text-[36px] font-black text-charcoal-900 tracking-tight leading-[1.2]">
                {{ product.name }}
              </h1>
              <p v-if="product.variants[0]?.sku" class="text-[14px] text-gray-400 font-medium">
                {{ product.variants[0].sku }}
              </p>
            </div>

            <!-- 가격 -->
            <div class="border-t border-b border-gray-100 py-6 space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-[14px] font-bold text-gray-400">판매가</span>
                <span class="text-[32px] md:text-[38px] font-black text-charcoal-900 tracking-tighter leading-none">
                  {{ formatPrice(product.variants[0]?.price) }}
                </span>
              </div>
            </div>

            <!-- 상품 정보 요약 -->
            <div class="bg-charcoal-50 rounded-xl p-6 space-y-4 border border-gray-100">
              <div class="flex items-start justify-between text-[13px]">
                <span class="font-bold text-gray-400 w-20 shrink-0">배송안내</span>
                <span class="font-medium text-charcoal-900 text-right">
                  {{ product.variants[0]?.customFields?.productType === 'PHYSICAL' 
                    ? '택배배송 (평일 14시 이전 주문 시 당일 발송)' 
                    : '온라인 전용 (마이페이지에서 즉시 다운로드)' }}
                </span>
              </div>
              <div class="flex items-start justify-between text-[13px]">
                <span class="font-bold text-gray-400 w-20 shrink-0">구성</span>
                <span class="font-medium text-charcoal-900 text-right">
                  {{ product.customFields?.materialType || '학습용' }} 자료
                </span>
              </div>
            </div>

            <!-- 수량 선택 -->
            <div class="flex items-center justify-between py-4 border-b border-gray-100">
              <span class="text-[14px] font-bold text-gray-400">수량</span>
              <div class="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <button @click="decreaseQty" class="w-10 h-10 flex items-center justify-center text-gray-400 hover:bg-charcoal-50 transition-colors active:scale-95">
                  <Icon name="ph:minus-bold" class="text-xs" />
                </button>
                <span class="w-12 h-10 flex items-center justify-center text-[14px] font-bold text-charcoal-900 border-x border-gray-200">
                  {{ quantity }}
                </span>
                <button @click="increaseQty" class="w-10 h-10 flex items-center justify-center text-gray-400 hover:bg-charcoal-50 transition-colors active:scale-95">
                  <Icon name="ph:plus-bold" class="text-xs" />
                </button>
              </div>
            </div>

            <!-- 총 금액 -->
            <div class="flex items-center justify-between">
              <span class="text-[15px] font-bold text-charcoal-900">총 상품 금액</span>
              <span class="text-[28px] font-black text-safety-orange tracking-tighter">
                {{ formatPrice(totalPrice) }}
              </span>
            </div>

            <!-- 구매 버튼 -->
            <div class="flex gap-3 pt-2">
              <button 
                @click="handleAddToCart" 
                :disabled="isAdding"
                class="flex-1 h-14 border-2 border-charcoal-900 text-charcoal-900 rounded-xl font-bold text-[15px] hover:bg-charcoal-900 hover:text-white transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Icon name="ph:shopping-cart-bold" class="text-lg" />
                장바구니
              </button>
              <button 
                @click="handleBuyNow"
                :disabled="isBuying"
                class="flex-1 h-14 bg-charcoal-900 text-white rounded-xl font-bold text-[15px] hover:bg-safety-orange transition-all duration-300 active:scale-[0.98] shadow-lg shadow-charcoal-900/10 disabled:opacity-50"
              >
                <span v-if="isBuying" class="flex items-center justify-center gap-2">
                  <Icon name="ph:spinner" class="text-lg animate-spin" />
                  처리 중...
                </span>
                <span v-else>바로 구매하기</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- --- 탭 콘텐츠 영역 --- -->
      <div class="mt-12 border-t border-gray-100">
        <!-- Sticky Tab Bar -->
        <div class="sticky top-0 bg-white border-b border-gray-200 z-30">
          <div class="max-w-[1200px] mx-auto px-4">
            <div class="flex items-center h-14 overflow-x-auto scrollbar-hide">
              <button 
                v-for="tab in tabs" 
                :key="tab.id" 
                @click="activeTab = tab.id as any" 
                class="relative h-full px-6 md:px-8 text-[14px] font-bold transition-colors whitespace-nowrap shrink-0"
                :class="activeTab === tab.id 
                  ? 'text-charcoal-900' 
                  : 'text-gray-300 hover:text-gray-500'"
              >
                {{ tab.name }}
                <span 
                  v-if="activeTab === tab.id" 
                  class="absolute bottom-0 left-2 right-2 h-[3px] bg-charcoal-900 rounded-full"
                />
              </button>
            </div>
          </div>
        </div>

        <!-- Tab Content -->
        <div class="max-w-[1200px] mx-auto px-4 py-16 pb-32">
          <!-- 상품정보 -->
          <div v-if="activeTab === 'info'" class="max-w-3xl mx-auto space-y-12">
            <div class="bg-charcoal-50 p-8 md:p-10 rounded-2xl border border-gray-100">
              <h4 class="text-lg font-bold text-charcoal-900 mb-4">상품 소개</h4>
              <div 
                class="prose prose-slate max-w-none text-[15px] text-gray-500 leading-relaxed" 
                v-html="product.description"
              />
            </div>
            <div 
              v-if="!product.description?.includes('<img')" 
              class="w-full aspect-[16/9] bg-gray-50 rounded-2xl border border-dashed border-gray-200 flex flex-col items-center justify-center"
            >
              <Icon name="ph:image-light" class="text-5xl text-gray-200 mb-3" />
              <p class="text-sm text-gray-400 font-medium">상세 이미지 준비 중입니다.</p>
            </div>
          </div>

          <!-- 상품후기 -->
          <div v-else-if="activeTab === 'reviews'" class="max-w-3xl mx-auto">
            <!-- 후기 요약 헤더 -->
            <div class="flex flex-col md:flex-row items-center gap-8 bg-charcoal-50 rounded-2xl p-8 mb-10 border border-gray-100">
              <div class="text-center md:border-r border-gray-200 md:pr-12">
                <p class="text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-1">평균 별점</p>
                <p class="text-5xl font-black text-charcoal-900 tracking-tighter">4.9</p>
                <div class="flex items-center justify-center gap-0.5 mt-2">
                  <Icon v-for="i in 5" :key="i" name="ph:star-fill" class="text-safety-orange text-lg" />
                </div>
              </div>
              <div class="flex-1 space-y-2 w-full">
                <div v-for="i in [5, 4, 3, 2, 1]" :key="i" class="flex items-center gap-3">
                  <span class="text-[11px] font-bold text-gray-500 w-4">{{ i }}</span>
                  <div class="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div class="h-full bg-charcoal-900 rounded-full" :style="{ width: i === 5 ? '85%' : i === 4 ? '10%' : '2%' }"></div>
                  </div>
                  <span class="text-[11px] font-medium text-gray-400 w-8">{{ i === 5 ? '85' : i === 4 ? '10' : '2' }}%</span>
                </div>
              </div>
            </div>

            <!-- 후기 작성 섹션 (아코디언 형태 또는 간단한 버튼) -->
            <div class="mb-12">
              <button 
                @click="success('로그인 후 후기를 작성할 수 있습니다.')"
                class="w-full h-14 border border-dashed border-gray-300 rounded-xl text-gray-400 font-medium hover:border-charcoal-900 hover:text-charcoal-900 transition-all flex items-center justify-center gap-2"
              >
                <Icon name="ph:pencil-line" class="text-lg" />
                상품 후기 작성하기
              </button>
            </div>

            <!-- 후기 목록 -->
            <div v-if="reviews && reviews.length > 0" class="space-y-8">
              <div v-for="review in reviews" :key="review.id" class="border-b border-gray-100 pb-8 last:border-0">
                <div class="flex justify-between items-start mb-4">
                  <div>
                    <div class="flex items-center gap-2 mb-1">
                      <div class="flex text-safety-orange">
                        <Icon v-for="i in 5" :key="i" :name="i <= review.rating ? 'ph:star-fill' : 'ph:star-light'" class="text-sm" />
                      </div>
                      <span class="text-[14px] font-bold text-charcoal-900">{{ review.authorName }}</span>
                      <!-- 외부 소스 뱃지 -->
                      <span v-if="review.source && review.source !== 'INTERNAL'" class="px-2 py-0.5 bg-gray-100 text-[10px] text-gray-400 rounded-full flex items-center gap-1">
                        <Icon name="ph:link-bold" />
                        {{ review.source }}
                      </span>
                    </div>
                    <p class="text-[12px] text-gray-400">{{ formatDate(review.createdAt) }}</p>
                  </div>
                </div>
                <p class="text-[15px] text-gray-600 leading-relaxed whitespace-pre-wrap">{{ review.body }}</p>
              </div>
            </div>
            <div v-else class="text-center py-16 text-gray-300">
              <Icon name="ph:chat-circle-dots-light" class="text-5xl mb-3" />
              <p class="text-sm font-medium">등록된 후기가 없습니다. 첫 번째 후기를 남겨주세요!</p>
            </div>
          </div>

          <!-- 상품문의 -->
          <div v-else-if="activeTab === 'qna'" class="max-w-3xl mx-auto">
            <div class="text-center py-16 text-gray-300">
              <Icon name="ph:question-light" class="text-5xl mb-3" />
              <p class="text-sm font-medium">등록된 문의가 없습니다.</p>
            </div>
          </div>

          <!-- 배송정보 -->
          <div v-else-if="activeTab === 'shipping'" class="max-w-3xl mx-auto">
            <div class="bg-charcoal-50 rounded-2xl p-8 md:p-10 border border-gray-100 space-y-6">
              <h4 class="text-lg font-bold text-charcoal-900">배송 안내</h4>
              <div class="space-y-4 text-[14px] text-gray-500 leading-relaxed">
                <div class="flex gap-3">
                  <Icon name="ph:truck-light" class="text-xl text-safety-orange shrink-0 mt-0.5" />
                  <div>
                    <p class="font-bold text-charcoal-900 mb-1">택배 배송</p>
                    <p>평일(월~금) 오후 2시 이전 결제 완료 건은 당일 발송됩니다.</p>
                    <p>주말/공휴일 주문 건은 다음 영업일에 발송됩니다.</p>
                  </div>
                </div>
                <div class="flex gap-3">
                  <Icon name="ph:download-simple-light" class="text-xl text-safety-orange shrink-0 mt-0.5" />
                  <div>
                    <p class="font-bold text-charcoal-900 mb-1">디지털 자료</p>
                    <p>결제 완료 후 마이페이지 > 내 학습 자료에서 즉시 다운로드 가능합니다.</p>
                  </div>
                </div>
                <div class="flex gap-3">
                  <Icon name="ph:currency-krw-light" class="text-xl text-safety-orange shrink-0 mt-0.5" />
                  <div>
                    <p class="font-bold text-charcoal-900 mb-1">배송비</p>
                    <p>3만원 이상 구매 시 무료배송 / 3만원 미만 시 2,500원</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 교환/반품 -->
          <div v-else-if="activeTab === 'returns'" class="max-w-3xl mx-auto">
            <div class="bg-charcoal-50 rounded-2xl p-8 md:p-10 border border-gray-100 space-y-6">
              <h4 class="text-lg font-bold text-charcoal-900">교환/반품 안내</h4>
              <div class="space-y-4 text-[14px] text-gray-500 leading-relaxed">
                <div class="flex gap-3">
                  <Icon name="ph:arrow-counter-clockwise-light" class="text-xl text-safety-orange shrink-0 mt-0.5" />
                  <div>
                    <p class="font-bold text-charcoal-900 mb-1">교환/반품 가능 기간</p>
                    <p>상품 수령일로부터 7일 이내 교환 및 반품이 가능합니다.</p>
                  </div>
                </div>
                <div class="flex gap-3">
                  <Icon name="ph:x-circle-light" class="text-xl text-safety-orange shrink-0 mt-0.5" />
                  <div>
                    <p class="font-bold text-charcoal-900 mb-1">교환/반품 불가 사유</p>
                    <p>고객 사유로 인한 훼손 또는 디지털 콘텐츠 다운로드 완료 시 교환/반품이 불가합니다.</p>
                  </div>
                </div>
                <div class="flex gap-3">
                  <Icon name="ph:phone-light" class="text-xl text-safety-orange shrink-0 mt-0.5" />
                  <div>
                    <p class="font-bold text-charcoal-900 mb-1">교환/반품 접수</p>
                    <p>고객센터(1588-0000)로 연락 후 반품 접수를 진행해 주세요.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
