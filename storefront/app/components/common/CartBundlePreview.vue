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
  <div v-if="componentIds.length > 0" class="space-y-6">
    <div class="flex items-center space-x-3 text-[11px] font-bold uppercase tracking-widest text-charcoal-900 opacity-30">
      <Icon name="ph:package-fill" />
      <span>Included Archive Components</span>
    </div>
    <ul class="space-y-4">
      <li v-for="id in componentIds" :key="id" class="flex items-center space-x-4 p-4 bg-charcoal-50 rounded-xl border border-charcoal-900/5 transition-all hover:border-charcoal-900/10">
        <div class="w-2 h-2 rounded-full bg-safety-orange"></div>
        <div class="flex flex-col">
          <span class="text-[13px] font-bold text-charcoal-900">Academic Component (ID: {{ id }})</span>
          <span class="text-[10px] text-slate-400 font-medium">Verified Scholarly Material</span>
        </div>
      </li>
    </ul>
    <p class="text-[10px] text-slate-400 italic bg-white p-4 rounded-xl border border-charcoal-900/5">
      ※ 본 패키지는 학술적 완결성을 위해 선별된 디지털 자료와 교재의 결합 상품입니다.
    </p>
  </div>
</template>
