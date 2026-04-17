<script setup lang="ts">
const { login } = useAuth()
const router = useRouter()

const email = ref('')
const password = ref('')
const error = ref('')
const isSubmitting = ref(false)

const handleLogin = async () => {
  if (!email.value || !password.value) return
  
  isSubmitting.value = true
  error.value = ''
  
  try {
    const result = await login(email.value, password.value)
    if (result.data?.login?.id) {
      router.push('/')
    } else if (result.data?.login?.message) {
      error.value = result.data.login.message
    } else {
      error.value = '이메일 또는 비밀번호가 올바르지 않습니다.'
    }
  } catch (e) {
    error.value = '로그인 중 서버 오류가 발생했습니다.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="min-h-[80vh] flex items-center justify-center px-6 py-20">
    <div class="w-full max-w-md space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <!-- Header -->
      <div class="text-center space-y-4">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-navy-900 rounded-[2rem] shadow-2xl mb-4">
          <Icon name="ph:lock-key-bold" class="text-3xl text-gold-400" />
        </div>
        <h1 class="text-4xl font-black text-navy-900 tracking-tight">Identity Access</h1>
        <p class="text-slate-400 font-light italic">학문적 성취를 위한 첫 단추, 아카이브 로그인.</p>
      </div>

      <!-- Form -->
      <div class="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl space-y-8">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div class="space-y-2">
            <label class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Email Address</label>
            <input 
              v-model="email"
              type="email" 
              required
              class="w-full h-14 px-6 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-gold-400 focus:bg-white transition-all text-navy-900 font-medium placeholder:text-slate-300"
              placeholder="name@example.com"
            />
          </div>

          <div class="space-y-2">
            <label class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Password</label>
            <input 
              v-model="password"
              type="password" 
              required
              class="w-full h-14 px-6 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-gold-400 focus:bg-white transition-all text-navy-900 font-medium placeholder:text-slate-300"
              placeholder="••••••••"
            />
          </div>

          <div v-if="error" class="text-center py-2 bg-red-50 rounded-xl">
            <span class="text-xs font-bold text-red-500">{{ error }}</span>
          </div>

          <CommonAppButton 
            variant="primary" 
            size="lg" 
            class="w-full h-16 shadow-xl shadow-navy-900/10"
            :disabled="isSubmitting"
          >
            <Icon v-if="isSubmitting" name="ph:spinner-gap-bold" class="animate-spin mr-2" />
            <span v-else>Access Archive</span>
          </CommonAppButton>
        </form>

        <!-- Social Placeholder -->
        <div class="space-y-6 pt-4">
          <div class="relative">
            <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-slate-100"></div></div>
            <div class="relative flex justify-center text-[10px] uppercase tracking-widest text-slate-300"><span class="bg-white px-4">Social Login</span></div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <button class="h-14 flex items-center justify-center bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors group">
              <Icon name="logos:google-icon" class="text-lg opacity-40 group-hover:opacity-100 grayscale group-hover:grayscale-0 transition-all" />
            </button>
            <button class="h-14 flex items-center justify-center bg-[#FEE500] rounded-2xl hover:brightness-95 transition-all group">
              <Icon name="ri:kakao-talk-fill" class="text-2xl text-[#3C1E1E] opacity-40 group-hover:opacity-100 transition-all" />
            </button>
          </div>
        </div>
      </div>

      <!-- Footer Links -->
      <div class="text-center space-x-6">
        <NuxtLink to="/register" class="text-xs font-bold text-slate-400 hover:text-navy-900 transition-colors uppercase tracking-widest">Create Account</NuxtLink>
        <span class="text-slate-200">|</span>
        <button class="text-xs font-bold text-slate-400 hover:text-navy-900 transition-colors uppercase tracking-widest">Forgot Password</button>
      </div>
    </div>
  </div>
</template>
