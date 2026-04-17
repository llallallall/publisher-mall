<script setup lang="ts">
const props = defineProps<{
  line: any
}>()

const { adjustQuantity, removeItem } = useCart()

const handleIncrease = () => adjustQuantity(props.line.id, props.line.quantity + 1)
const handleDecrease = () => {
  if (props.line.quantity > 1) {
    adjustQuantity(props.line.id, props.line.quantity - 1)
  } else {
    removeItem(props.line.id)
  }
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(price)
}
</script>

<template>
  <div class="flex items-center space-x-4 py-4 border-b border-slate-50 last:border-0">
    <!-- Image -->
    <div class="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
      <img 
        :src="line.productVariant.featuredAsset?.preview" 
        :alt="line.productVariant.name"
        class="w-full h-full object-cover"
      />
    </div>

    <!-- Info -->
    <div class="flex-grow">
      <h4 class="text-sm font-bold text-navy-900 line-clamp-1">{{ line.productVariant.name }}</h4>
      <p class="text-[10px] text-slate-400 font-mono">{{ formatPrice(line.linePriceWithTax / line.quantity) }}</p>
      
      <!-- Quantity Controls -->
      <div class="flex items-center space-x-3 mt-2">
        <button 
          @click="handleDecrease"
          class="w-6 h-6 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors"
        >
          <Icon name="ph:minus-bold" class="text-[10px] text-slate-600" />
        </button>
        <span class="text-xs font-bold text-navy-900 w-4 text-center">{{ line.quantity }}</span>
        <button 
          @click="handleIncrease"
          class="w-6 h-6 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors"
        >
          <Icon name="ph:plus-bold" class="text-[10px] text-slate-600" />
        </button>
      </div>
    </div>

    <!-- Subtotal & Remove -->
    <div class="text-right flex flex-col items-end">
      <span class="text-xs font-black text-navy-900">{{ formatPrice(line.linePriceWithTax) }}</span>
      <button 
        @click="removeItem(line.id)"
        class="mt-2 text-[10px] text-slate-300 hover:text-red-400 transition-colors"
      >
        Remove
      </button>
    </div>
  </div>
</template>
