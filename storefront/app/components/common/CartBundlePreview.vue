<script setup lang="ts">
interface Props {
  componentIdsString?: string
}

const props = defineProps<Props>()

const componentIds = computed(() => {
  try {
    return props.componentIdsString ? JSON.parse(props.componentIdsString) : []
  } catch {
    return []
  }
})

// In a real app, we would fetch the details of these components via a dedicated query
// For now, we show a simplified "Included Items" list
</script>

<template>
  <div v-if="componentIds.length > 0" class="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
    <div class="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
      <Icon name="ph:package-bold" />
      <span>Bundle Components</span>
    </div>
    <ul class="space-y-2">
      <li v-for="id in componentIds" :key="id" class="flex items-center space-x-2 text-xs text-slate-600 font-medium">
        <span class="w-1.5 h-1.5 rounded-full bg-gold-400"></span>
        <span>Included Component (ID: {{ id }})</span>
      </li>
    </ul>
    <p class="text-[9px] text-slate-400 italic">※ 번들 상품은 디지털 자료와 실물 도서가 결합된 상품입니다.</p>
  </div>
</template>
