<script setup lang="ts">
const { cart, isCartOpen, closeCart } = useCart()
const router = useRouter()

const handleCheckout = () => {
  closeCart()
  router.push('/checkout')
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(price)
}
</script>

<template>
  <Teleport to="body">
    <Transition name="drawer">
      <div v-if="isCartOpen" class="fixed inset-0 z-[100]">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-navy-900/40 backdrop-blur-sm" @click="closeCart"></div>
        
        <!-- Panel -->
        <div class="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-2xl flex flex-col overflow-hidden">
          <!-- Header -->
          <div class="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
            <h2 class="text-xl font-black text-navy-900 flex items-center space-x-2">
              <Icon name="ph:shopping-cart-bold" />
              <span>장바구니</span>
              <span v-if="cart?.totalItems" class="ml-2 px-2 py-0.5 bg-navy-900 text-[10px] text-white rounded-full">
                {{ cart.totalItems }}
              </span>
            </h2>
            <button @click="closeCart" class="p-2 hover:bg-slate-50 rounded-full transition-colors">
              <Icon name="ph:x-bold" class="text-xl text-slate-400" />
            </button>
          </div>

          <!-- List -->
          <div class="flex-grow overflow-y-auto px-6 bg-white">
            <div v-if="cart?.lines?.length" class="divide-y divide-slate-50">
              <CartItem v-for="line in cart.lines" :key="line.id" :line="line" />
            </div>
            <div v-else class="h-full flex flex-col items-center justify-center text-center py-20 opacity-30 select-none">
              <Icon name="ph:shopping-cart-light" class="text-6xl mb-4" />
              <p class="text-sm font-medium">장바구니가 비어 있습니다.</p>
            </div>
          </div>

          <!-- Footer -->
          <div v-if="cart?.lines?.length" class="p-8 bg-slate-50 border-t border-slate-100 space-y-6">
            <div class="flex justify-between items-end">
              <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Total</span>
              <span class="text-2xl font-black text-navy-900">{{ formatPrice(cart.totalWithTax) }}</span>
            </div>
            <CommonAppButton variant="primary" size="lg" class="w-full h-14" @click="handleCheckout">
              결제하기
            </CommonAppButton>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.drawer-enter-active, .drawer-leave-active { 
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1); 
}
.drawer-enter-from, .drawer-leave-to { 
  opacity: 0; 
}
.drawer-enter-from .absolute.right-0 { 
  transform: translateX(100%); 
}
.drawer-leave-to .absolute.right-0 { 
  transform: translateX(100%); 
}
</style>
