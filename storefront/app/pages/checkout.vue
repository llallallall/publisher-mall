<script setup lang="ts">
const { cart, loading: cartLoading, addPayment } = useCart()
const { payWithPortone } = usePayment()
const router = useRouter()

const isProcessing = ref(false)
const errorMessage = ref('')

const handlePayment = async () => {
  if (!cart.value) return
  
  isProcessing.value = true
  errorMessage.value = ''
  
  try {
    // 1. Trigger Portone Modal
    const rsp: any = await payWithPortone({
      orderCode: cart.value.code,
      amount: cart.value.totalWithTax,
      name: `Publisher Mall Order ${cart.value.code}`,
      buyer_email: 'test@example.com', // In real app, fetch from user profile
      buyer_name: '홍길동'
    })
    
    // 2. Add payment to Vendure Order
    const result = await addPayment(rsp.imp_uid)
    
    if (result.data?.addPaymentToOrder?.state === 'PaymentSettled' || result.data?.addPaymentToOrder?.state === 'ArrangingPayment') {
      router.push('/my-materials') // Success redirect
    } else {
      errorMessage.value = '결제 처리 중 오류가 발생했습니다. 잠시 후 보관함을 확인해주세요.'
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
  <div class="max-w-3xl mx-auto py-12 px-6 space-y-12">
    <!-- Header -->
    <div class="border-b border-slate-200 pb-8 text-center">
      <h1 class="text-4xl font-black text-navy-900 tracking-tight">Checkout</h1>
      <p class="text-slate-500 mt-2 font-light italic">최종 주문 내용을 확인하고 결제를 진행합니다.</p>
    </div>

    <!-- Loading State -->
    <div v-if="cartLoading" class="p-20 text-center animate-pulse">
      <Icon name="ph:spinner-gap-bold" class="text-5xl text-slate-300 animate-spin" />
    </div>

    <!-- Empty Cart -->
    <div v-else-if="!cart" class="text-center p-20 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
      <Icon name="ph:shopping-cart-light" class="text-6xl text-slate-300 mb-6" />
      <h2 class="text-2xl font-bold text-navy-900">결제할 주문이 없습니다.</h2>
      <NuxtLink to="/" class="inline-block mt-8">
        <CommonAppButton variant="primary">상품 둘러보기</CommonAppButton>
      </NuxtLink>
    </div>

    <!-- Order Details -->
    <div v-else class="space-y-8">
      <div class="bg-white border border-slate-100 rounded-[2rem] shadow-xl overflow-hidden">
        <div class="bg-navy-900 p-6 text-white flex justify-between items-center">
          <span class="text-xs font-bold tracking-widest uppercase opacity-70">Order Summary</span>
          <span class="font-mono text-gold-400">#{{ cart.code }}</span>
        </div>
        
        <div class="p-8 space-y-6">
          <!-- Item List -->
          <div v-for="line in cart.lines" :key="line.id" class="flex justify-between items-center py-4 border-b border-slate-50 last:border-0">
            <div>
              <p class="font-bold text-navy-900">{{ line.productVariant.name }}</p>
              <p class="text-xs text-slate-400">수량: {{ line.quantity }}개</p>
            </div>
            <p class="font-black text-navy-900">{{ formatPrice(line.linePriceWithTax) }}</p>
          </div>

          <!-- Total -->
          <div class="pt-6 flex justify-between items-center">
            <span class="text-xl font-bold text-navy-900">최종 결제 금액</span>
            <span class="text-3xl font-black text-gold-600 tracking-tighter">
              {{ formatPrice(cart.totalWithTax) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Action -->
      <div class="space-y-4">
        <CommonAppButton 
          variant="primary" 
          size="lg" 
          class="w-full h-16 text-lg shadow-2xl shadow-navy-900/20"
          :disabled="isProcessing"
          @click="handlePayment"
        >
          <Icon v-if="isProcessing" name="ph:spinner-gap-bold" class="animate-spin mr-2" />
          <span v-else>{{ formatPrice(cart.totalWithTax) }} 결제하기</span>
        </CommonAppButton>
        
        <p v-if="errorMessage" class="text-center text-sm font-bold text-red-500 animate-bounce">
          {{ errorMessage }}
        </p>
        
        <p class="text-center text-[10px] text-slate-400 font-light">
          결제 버튼을 클릭하면 <span class="underline">이용약관</span> 및 <span class="underline">개인정보 처리방침</span>에 동의하는 것으로 간주합니다.
        </p>
      </div>
    </div>
  </div>
</template>
