<script setup lang="ts">
const { cart, isCartOpen, closeCart, loading } = useCart()
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
        <div class="absolute inset-0 bg-charcoal-900/10 backdrop-blur-[6px]" @click="closeCart"></div>
        
        <!-- Panel -->
        <div class="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-deep flex flex-col overflow-hidden border-l border-charcoal-900/5">
          <!-- Header -->
          <div class="p-6 border-b border-charcoal-900/5 flex justify-between items-center bg-white">
            <h2 class="text-lg font-bold text-charcoal-900 flex items-center space-x-2 uppercase tracking-tighter">
              <Icon name="ph:shopping-bag-bold" />
              <span>Cart</span>
              <span v-if="cart?.totalQuantity" class="ml-2 px-2 py-0.5 bg-charcoal-900 text-[10px] text-white rounded-full">
                {{ cart.totalQuantity }}
              </span>
            </h2>
            <button @click="closeCart" class="p-2 hover:bg-charcoal-50 rounded-full transition-colors text-slate-400 hover:text-charcoal-900">
              <Icon name="ph:x-bold" class="text-lg" />
            </button>
          </div>

          <!-- List -->
          <div class="flex-grow overflow-y-auto px-6 bg-white relative">
            <!-- Loading Overlay -->
            <div v-if="loading && !cart" class="absolute inset-0 flex items-center justify-center bg-white z-10 transition-opacity">
              <Icon name="ph:spinner-gap-bold" class="text-3xl text-charcoal-400 animate-spin" />
            </div>

            <div v-if="cart?.lines?.length" class="divide-y divide-charcoal-900/5">
              <CartItem v-for="line in cart.lines" :key="line.id" :line="line" />
            </div>
            <div v-else-if="!loading" class="h-full flex flex-col items-center justify-center text-center py-20 opacity-20 select-none">
              <Icon name="ph:shopping-bag-light" class="text-6xl mb-4" />
              <p class="text-sm font-medium tracking-tight">Your archive is empty.</p>
            </div>
          </div>

          <!-- Footer -->
          <div v-if="cart?.lines?.length" class="p-8 bg-charcoal-50 border-t border-charcoal-900/5 space-y-6">
            <div class="flex justify-between items-baseline">
              <span class="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Total</span>
              <span class="text-2xl font-bold text-charcoal-900 tracking-tighter">{{ formatPrice(cart.totalWithTax) }}</span>
            </div>
            <CommonAppButton variant="primary" size="lg" class="w-full h-14" @click="handleCheckout">
              Checkout
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
