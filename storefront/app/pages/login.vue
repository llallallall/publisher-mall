<script setup lang="ts">
const { authenticateWithSupabase } = useAuth()
const router = useRouter()
const route = useRoute()

// Nuxt Supabase Auto-imports
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const email = ref('')
const error = ref('')
const isSubmitting = ref(false)
const isOtpSent = ref(false)

// OTP 인증 메일 발송 (가입/로그인 통합)
const handleEmailLogin = async () => {
  if (!email.value) return
  isSubmitting.value = true
  error.value = ''
  
  try {
    const { error: authError } = await supabase.auth.signInWithOtp({
      email: email.value,
      options: {
        emailRedirectTo: window.location.origin + '/login-callback',
        shouldCreateUser: true
      }
    })
    if (authError) throw authError
    isOtpSent.value = true
  } catch (e: any) {
    error.value = e.message || '인증 메일 발송 실패'
  } finally {
    isSubmitting.value = false
  }
}

// 소셜 로그인 (Google/Kakao)
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
    error.value = e.message || '소셜 로그인 실패'
  }
}

// Supabase 유저 변화 감지 후 Vendure 동기화
watch(user, async (newUser) => {
  if (newUser?.email) {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.access_token) {
      const result = await authenticateWithSupabase(session.access_token)
      if (result.data?.authenticate?.id) {
        const redirectPath = route.query.redirect as string || '/'
        router.push(redirectPath)
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
        <div class="inline-flex items-center justify-center w-16 h-16 bg-charcoal-900 rounded-2xl shadow-premium mx-auto mb-2">
          <Icon name="ph:paper-plane-tilt-fill" class="text-2xl text-white" />
        </div>
        <h1 class="text-4xl font-black text-charcoal-900 tracking-tighter">이메일 로그인</h1>
        <p class="text-gray-400 font-medium text-[15px]">비밀번호 없이 이메일 인증 링크로 안전하게 로그인하세요.</p>
      </div>

      <!-- Main Login Surface -->
      <div class="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] space-y-10">
        <div v-if="!isOtpSent" class="space-y-10">
          <!-- Integrated Form -->
          <div class="space-y-6">
            <div class="space-y-2">
              <label class="text-[12px] font-black uppercase tracking-widest text-gray-400">이메일 주소</label>
              <input 
                v-model="email"
                type="email" 
                required
                class="w-full h-15 px-6 bg-charcoal-50 border border-transparent rounded-2xl focus:border-safety-orange focus:bg-white transition-all text-charcoal-900 font-bold placeholder:text-gray-300 outline-none"
                placeholder="example@email.com"
              />
              <p class="text-[11px] text-gray-400 ml-1">계정이 없으면 자동으로 생성됩니다.</p>
            </div>

            <button 
              class="w-full h-15 bg-charcoal-900 text-white rounded-2xl font-black text-[16px] flex items-center justify-center gap-3 hover:bg-safety-orange transition-all duration-300 shadow-xl shadow-charcoal-900/10"
              :disabled="isSubmitting"
              @click="handleEmailLogin"
            >
              <Icon v-if="isSubmitting" name="ph:spinner-gap-bold" class="animate-spin text-xl" />
              <span v-else>인증 메일 보내기</span>
            </button>
          </div>

          <div class="relative">
            <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-gray-100"></div></div>
            <div class="relative flex justify-center text-[11px] font-black uppercase tracking-widest text-gray-300"><span class="bg-white px-4">소셜 계정 인증</span></div>
          </div>

          <!-- Social Buttons -->
          <div class="grid grid-cols-2 gap-4">
            <button 
              @click="handleSocialLogin('google')"
              class="h-15 flex items-center justify-center bg-white border border-gray-100 rounded-2xl hover:border-gray-200 transition-all shadow-sm group"
            >
              <Icon name="logos:google-icon" class="text-xl" />
            </button>
            <button 
              @click="handleSocialLogin('kakao')"
              class="h-15 flex items-center justify-center bg-[#FEE500] rounded-2xl hover:brightness-95 transition-all shadow-sm group"
            >
              <Icon name="ri:kakao-talk-fill" class="text-3xl text-[#3C1E1E]" />
            </button>
          </div>
        </div>

        <!-- OTP Sent State -->
        <div v-else class="text-center space-y-6 py-6">
          <div class="w-20 h-20 bg-safety-orange/10 text-safety-orange rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="ph:envelope-open-fill" class="text-3xl" />
          </div>
          <div class="space-y-2">
            <h2 class="text-2xl font-black text-charcoal-900 tracking-tight">메일함을 확인해 주세요!</h2>
            <p class="text-[15px] text-gray-500 leading-relaxed">
              <span class="font-bold text-charcoal-900">{{ email }}</span> 주소로<br />인증 링크를 발송했습니다.
            </p>
          </div>
          <button @click="isOtpSent = false" class="text-[14px] font-bold text-gray-400 underline underline-offset-4">다른 이메일 사용하기</button>
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
        <p class="text-[12px] text-gray-400 font-bold tracking-tight">
          로그인 시 서담의 <a href="#" class="text-charcoal-900 underline underline-offset-4">이용약관</a> 및 <a href="#" class="text-charcoal-900 underline underline-offset-4">개인정보처리방침</a>에 동의하게 됩니다.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.shadow-premium {
  box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.1);
}
</style>
