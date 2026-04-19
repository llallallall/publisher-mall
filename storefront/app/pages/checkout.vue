<script setup lang="ts">
const { user, isAuthenticated } = useAuth()
const { cart, loading: cartLoading, addPayment } = useCart()
const { payWithPortone } = usePayment()
const router = useRouter()

const isProcessing = ref(false)
const errorMessage = ref('')

const handlePayment = async () => {
  if (!cart.value) return
  if (!isAuthenticated.value) {
    errorMessage.value = '결제를 위해 로그인이 필요합니다.'
    router.push('/login?redirect=/checkout')
    return
  }
  
  isProcessing.value = true
  errorMessage.value = ''
  
  try {
    const rsp: any = await payWithPortone({
      orderCode: cart.value.code,
      amount: cart.value.totalWithTax,
      name: `서담 교재 결제 [${cart.value.code}]`,
      buyer_email: user.value?.emailAddress || '',
      buyer_name: `${user.value?.firstName || ''} ${user.value?.lastName || ''}`.trim() || '구매자'
    })
    
    const result = await addPayment(rsp.imp_uid)
    
    if (result.data?.addPaymentToOrder?.state === 'PaymentSettled' || result.data?.addPaymentToOrder?.state === 'ArrangingPayment') {
      router.push('/my-materials')
    } else {
      errorMessage.value = '결제 처리 중 지연이 발생했습니다. 마이페이지를 확인해 주세요.'
    }
  } catch (err: any) {
    errorMessage.value = err.message || '결제에 실패했습니다.'
  } finally {
    isProcessing.value = false
  }
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(price)
}
</script>

<template>
  <div class="max-w-[1200px] mx-auto py-16 md:py-24 px-4">
    <!-- Header -->
    <header class="max-w-3xl mx-auto space-y-6 text-center mb-16">
      <div class="inline-flex items-center space-x-3 px-4 py-1.5 bg-charcoal-50 border border-gray-100 rounded-full">
        <Icon name="ph:shield-check-bold" class="text-safety-orange text-sm" />
        <span class="text-[11px] font-black uppercase tracking-widest text-charcoal-900">Secure Payment Gateway</span>
      </div>
      <h1 class="text-[34px] md:text-[42px] font-black text-charcoal-900 tracking-tighter leading-tight">최종 결제 확인</h1>
      <p class="text-gray-400 font-medium text-[15px]">주문 내용을 확인하신 후 결제를 진행해 주세요.</p>
    </header>

    <div class="max-w-5xl mx-auto grid md:grid-cols-[1fr_380px] gap-12 items-start">
      <!-- Loading & Empty States -->
      <div v-if="cartLoading" class="md:col-span-2 py-32 text-center bg-charcoal-50 rounded-[2.5rem] border border-gray-100">
        <Icon name="ph:spinner-gap-bold" class="text-5xl text-charcoal-900 animate-spin" />
      </div>

      <div v-else-if="!cart || cart.lines.length === 0" class="md:col-span-2 py-32 text-center bg-charcoal-50 rounded-[2.5rem] border border-gray-100 space-y-8">
        <Icon name="ph:shopping-cart-light" class="text-7xl text-gray-200 mx-auto" />
        <h2 class="text-2xl font-bold text-charcoal-900">장바구니가 비어 있습니다.</h2>
        <NuxtLink to="/products" class="inline-flex h-14 px-8 items-center bg-charcoal-900 text-white rounded-xl font-bold hover:bg-safety-orange transition-all">
          교재 보러 가기
        </NuxtLink>
      </div>

      <!-- Main Workout -->
      <template v-else>
        <!-- Left: Order Summary -->
        <div class="space-y-8">
          <div class="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.02)]">
            <div class="bg-charcoal-900 p-8 text-white flex justify-between items-center group">
              <div class="space-y-1">
                <span class="text-[10px] font-bold tracking-[0.2em] uppercase text-white/40">Order Code</span>
                <p class="font-mono text-xl tracking-tighter">{{ cart.code }}</p>
              </div>
              <div class="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                <Icon name="ph:receipt-bold" class="text-2xl text-white/40" />
              </div>
            </div>
            
            <div class="p-8 md:p-10">
              <h3 class="text-lg font-bold text-charcoal-900 mb-8 flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-safety-orange"></span>
                주문 상품 목록
              </h3>
              
              <div class="space-y-10">
                <div v-for="line in cart.lines" :key="line.id" class="flex gap-6 group">
                  <div class="w-20 h-24 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0 border border-gray-100">
                    <img v-if="line.productVariant.product.featuredAsset?.preview" :src="line.productVariant.product.featuredAsset.preview" class="w-full h-full object-cover" />
                    <div v-else class="w-full h-full flex items-center justify-center"><Icon name="ph:book-light" class="text-2xl text-gray-200" /></div>
                  </div>
                  <div class="flex-1 flex flex-col justify-center">
                    <h4 class="font-bold text-charcoal-900 text-[16px] mb-1 leading-tight">{{ line.productVariant.name }}</h4>
                    <div class="flex items-center gap-3">
                      <span class="text-[12px] font-bold text-gray-400 capitalize">수량: {{ line.quantity }}개</span>
                      <span class="w-1 h-1 bg-gray-200 rounded-full"></span>
                      <span class="text-[14px] font-black text-charcoal-900">{{ formatPrice(line.linePriceWithTax) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Shipping Notice -->
          <div class="p-8 bg-safety-orange/5 border border-safety-orange/10 rounded-3xl">
            <div class="flex gap-4">
              <Icon name="ph:info-bold" class="text-2xl text-safety-orange shrink-0" />
              <div>
                <p class="font-bold text-safety-orange text-[15px] mb-1">디지털 콘텐츠 구매 시 주의사항</p>
                <p class="text-[13px] text-safety-orange/70 leading-relaxed">
                  디지털콘텐츠(PDF, MP3 등)는 결제 완료 후 [마이페이지 > 내 학습 자료]에서 즉시 이용 가능합니다. 
                  디지털 자료를 다운로드하거나 콘텐츠를 열람한 경우 전자상거래법에 따라 환불이 제한됩니다.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Settlement Card -->
        <div class="sticky top-8 space-y-6">
          <div class="bg-charcoal-50 rounded-[2.5rem] p-8 md:p-10 border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
            <h3 class="text-[15px] font-black text-gray-400 uppercase tracking-widest mb-10">Payment Summary</h3>
            
            <div class="space-y-6 mb-10">
              <div class="flex justify-between items-center text-[15px]">
                <span class="font-bold text-gray-500">상품 총 금액</span>
                <span class="font-black text-charcoal-900">{{ formatPrice(cart.totalWithTax) }}</span>
              </div>
              <div class="flex justify-between items-center text-[15px]">
                <span class="font-bold text-gray-500">배송비</span>
                <span class="font-black text-charcoal-900">₩0</span>
              </div>
              <div class="h-px bg-gray-200 my-2"></div>
              <div class="flex justify-between items-end">
                <span class="font-black text-charcoal-900 text-lg tracking-tight">최종 결제 금액</span>
                <span class="text-3xl font-black text-safety-orange tracking-tighter leading-none">
                  {{ formatPrice(cart.totalWithTax) }}
                </span>
              </div>
            </div>

            <button 
              @click="handlePayment"
              :disabled="isProcessing"
              class="w-full h-18 bg-charcoal-900 text-white rounded-2xl font-black text-lg hover:bg-safety-orange transition-all duration-300 transform active:scale-95 shadow-xl shadow-charcoal-900/10 disabled:opacity-50 flex items-center justify-center gap-3"
            >
              <Icon v-if="isProcessing" name="ph:spinner-gap-bold" class="animate-spin text-2xl" />
              <span v-else>결제하기</span>
            </button>
            
            <p v-if="errorMessage" class="mt-4 text-center p-4 bg-red-50 text-red-500 rounded-xl text-[12px] font-bold border border-red-100">
              <Icon name="ph:warning-circle-bold" class="mr-1 mt-0.5" />
              {{ errorMessage }}
            </p>
            
            <p class="mt-8 text-[11px] text-gray-400 font-medium text-center leading-relaxed">
              위 주문 내용을 확인하였으며,<br />결제 진행에 동의합니다.
            </p>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.h-18 { height: 4.5rem; }
</style>
