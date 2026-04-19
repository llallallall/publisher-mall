<script setup lang="ts">
const { authenticateWithSupabase } = useAuth()
const router = useRouter()
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const email = ref('')
const error = ref('')
const isSubmitting = ref(false)
const isOtpSent = ref(false)

// Handle traditional social login (Google/Kakao)
const handleSocialLogin = async (provider: 'google' | 'kakao') => {
  error.value = ''
  try {
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin + '/login-callback'
      }
    })
    if (authError) throw authError
  } catch (e: any) {
    error.value = e.message || 'Social login failed'
  }
}

// Handle Magic Link / OTP login
const handleEmailLogin = async () => {
  if (!email.value) return
  isSubmitting.value = true
  error.value = ''
  
  try {
    const { error: authError } = await supabase.auth.signInWithOtp({
      email: email.value,
      options: {
        emailRedirectTo: window.location.origin + '/login-callback'
      }
    })
    if (authError) throw authError
    isOtpSent.value = true
  } catch (e: any) {
    error.value = e.message || 'OTP request failed'
  } finally {
    isSubmitting.value = false
  }
}

// Watch for Supabase user change and bridge to Vendure
watch(user, async (newUser) => {
  if (newUser?.email) {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.access_token) {
      const result = await authenticateWithSupabase(session.access_token)
      if (result.data?.authenticate?.id) {
        router.push('/')
      } else {
        error.value = 'Failed to sync with store profile'
      }
    }
  }
}, { immediate: true })
</script>

<template>
  <div class="min-h-[90vh] flex items-center justify-center px-6 py-12">
    <div class="w-full max-w-md space-y-10">
      <!-- Header -->
      <div class="text-center space-y-4">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-charcoal-900 rounded-2xl shadow-premium mb-2">
          <Icon name="ph:lock-key-bold" class="text-2xl text-white" />
        </div>
        <h1 class="text-4xl font-semibold text-charcoal-900 tracking-tight">Identity Access</h1>
        <p class="text-slate-400 font-light text-sm">Professional archive entry for academic excellence.</p>
      </div>

      <!-- Main Login Surface -->
      <div class="glass-panel p-10 rounded-antigravity-card space-y-8">
        <div v-if="!isOtpSent" class="space-y-8">
          <!-- Email Login -->
          <div class="space-y-4">
            <div class="space-y-1.5 px-1">
              <label class="text-[11px] font-bold uppercase tracking-tight text-slate-400 ml-1">Archive Email</label>
              <input 
                v-model="email"
                type="email" 
                class="w-full h-14 px-5 bg-charcoal-900/5 border-0 rounded-2xl focus:ring-1 focus:ring-charcoal-900/20 focus:bg-white transition-all text-charcoal-900 font-medium placeholder:text-slate-300 outline-none"
                placeholder="name@university.ac.kr"
              />
            </div>

            <CommonAppButton 
              variant="primary" 
              size="lg" 
              class="w-full h-14"
              :disabled="isSubmitting"
              @click="handleEmailLogin"
            >
              <Icon v-if="isSubmitting" name="ph:spinner-gap-bold" class="animate-spin mr-2" />
              <span v-else>Send Magic Link</span>
            </CommonAppButton>
          </div>

          <div class="relative">
            <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-charcoal-900/5"></div></div>
            <div class="relative flex justify-center text-[10px] uppercase tracking-widest text-slate-300"><span class="bg-white/60 px-4 backdrop-blur-sm">Social Gateway</span></div>
          </div>

          <!-- Social Buttons -->
          <div class="grid grid-cols-2 gap-4">
            <button 
              @click="handleSocialLogin('google')"
              class="h-14 flex items-center justify-center bg-white border border-charcoal-900/5 rounded-2xl hover:bg-charcoal-900/5 transition-all shadow-sm group"
            >
              <Icon name="logos:google-icon" class="text-lg opacity-40 group-hover:opacity-100 transition-opacity" />
            </button>
            <button 
              @click="handleSocialLogin('kakao')"
              class="h-14 flex items-center justify-center bg-[#FEE500] rounded-2xl hover:brightness-95 transition-all shadow-sm group"
            >
              <Icon name="ri:kakao-talk-fill" class="text-2xl text-[#3C1E1E] opacity-40 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        </div>

        <!-- OTP Sent State -->
        <div v-else class="text-center space-y-6 py-4">
          <div class="w-16 h-16 bg-accent-blue/10 text-accent-blue rounded-full flex items-center justify-center mx-auto">
            <Icon name="ph:envelope-simple-open-bold" class="text-2xl" />
          </div>
          <div class="space-y-2">
            <h2 class="text-xl font-semibold text-charcoal-900">Check your inbox</h2>
            <p class="text-sm text-slate-500 leading-relaxed">
              We've sent a magic link to <span class="font-medium text-charcoal-900">{{ email }}</span>.
            </p>
          </div>
          <CommonAppButton variant="outline" size="sm" @click="isOtpSent = false">
            Trying another email
          </CommonAppButton>
        </div>

        <!-- Error Message -->
        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 -translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
        >
          <div v-if="error" class="p-4 bg-red-50 rounded-xl border border-red-100 flex items-start space-x-3">
            <Icon name="ph:warning-circle-bold" class="text-red-500 mt-0.5" />
            <p class="text-[11px] font-medium text-red-600 leading-tight">{{ error }}</p>
          </div>
        </Transition>
      </div>

      <!-- Footer Policy -->
      <div class="text-center">
        <p class="text-[11px] text-slate-400 font-medium tracking-tight">
          By entering, you agree to our <a href="#" class="text-charcoal-900 hover:underline">Terms of Discovery</a> and <a href="#" class="text-charcoal-900 hover:underline">Intellectual Policy</a>.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.glass-panel {
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(14.65px);
  -webkit-backdrop-filter: blur(14.65px);
  border: 1px solid rgba(18, 19, 23, 0.05);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.04);
}
</style>
