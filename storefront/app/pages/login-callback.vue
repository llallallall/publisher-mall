<script setup lang="ts">
const { authenticateWithSupabase } = useAuth()
const router = useRouter()
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const status = ref('Authenticating with Archive...')

watch(user, async (newUser) => {
  if (newUser?.email) {
    status.value = 'Syncing archive profile...'
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.access_token) {
        const result = await authenticateWithSupabase(session.access_token)
        if (result.data?.authenticate?.id) {
          router.push('/')
        } else {
          status.value = 'Sync failed. Redirecting to login...'
          setTimeout(() => router.push('/login'), 2000)
        }
      }
    } catch (e) {
      status.value = 'An error occurred. Redirecting...'
      setTimeout(() => router.push('/login'), 2000)
    }
  }
}, { immediate: true })

// Timeout fallback if user never populates
onMounted(() => {
  setTimeout(() => {
    if (!user.value) {
      status.value = 'Identity verification timed out. Redirecting...'
      setTimeout(() => router.push('/login'), 2000)
    }
  }, 10000)
})
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
    <div class="w-full max-w-sm text-center space-y-8 animate-in fade-in duration-700">
      <div class="relative w-20 h-20 mx-auto">
        <div class="absolute inset-0 border-2 border-charcoal-900/5 rounded-2xl"></div>
        <div class="absolute inset-0 border-2 border-t-charcoal-900 rounded-2xl animate-spin"></div>
        <Icon name="ph:fingerprint-bold" class="absolute inset-0 m-auto text-3xl text-charcoal-900" />
      </div>
      
      <div class="space-y-2">
        <h1 class="text-lg font-bold text-charcoal-900 uppercase tracking-tighter">{{ status }}</h1>
        <p class="text-xs text-slate-400 font-medium">Please do not close this window.</p>
      </div>

      <div class="pt-8 border-t border-charcoal-900/5">
        <p class="text-[10px] text-slate-300 uppercase tracking-widest leading-loose">
          Secure Identity Verification<br />
          Publisher Mall v2026.04
        </p>
      </div>
    </div>
  </div>
</template>
