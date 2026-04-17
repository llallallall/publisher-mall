<script setup lang="ts">
const { register } = useAuth()
const router = useRouter()

const form = reactive({
  email: '',
  password: '',
  firstName: '',
  lastName: ''
})
const error = ref('')
const isSubmitting = ref(false)

const handleRegister = async () => {
  if (!form.email || !form.password) return
  
  isSubmitting.value = true
  error.value = ''
  
  try {
    const result = await register({
      emailAddress: form.email,
      password: form.password,
      firstName: form.firstName,
      lastName: form.lastName
    })
    
    if (result.data?.registerCustomerAccount?.success) {
      router.push('/login?registered=true')
    } else if (result.data?.registerCustomerAccount?.message) {
      error.value = result.data.registerCustomerAccount.message
    } else {
      error.value = '회원가입 정보를 확인해 주세요.'
    }
  } catch (e) {
    error.value = '이미 가입된 이메일이거나 오류가 발생했습니다.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="min-h-[80vh] flex items-center justify-center px-6 py-20">
    <div class="w-full max-w-xl space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <!-- Header -->
      <div class="text-center space-y-4">
        <h1 class="text-4xl font-black text-navy-900 tracking-tight">New Enrollment</h1>
        <p class="text-slate-400 font-light italic">새로운 지적 탐구의 여정을 위해 아카이브 계정을 생성합니다.</p>
      </div>

      <!-- Form -->
      <div class="bg-white p-10 md:p-14 rounded-[3rem] border border-slate-100 shadow-xl space-y-10">
        <form @submit.prevent="handleRegister" class="space-y-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">First Name</label>
              <input v-model="form.firstName" type="text" class="w-full h-14 px-6 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-gold-400 focus:bg-white transition-all text-navy-900 font-medium" placeholder="길동" />
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Last Name</label>
              <input v-model="form.lastName" type="text" class="w-full h-14 px-6 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-gold-400 focus:bg-white transition-all text-navy-900 font-medium" placeholder="홍" />
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Email Address</label>
            <input v-model="form.email" type="email" required class="w-full h-14 px-6 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-gold-400 focus:bg-white transition-all text-navy-900 font-medium" placeholder="name@example.com" />
          </div>

          <div class="space-y-2">
            <label class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Password</label>
            <input v-model="form.password" type="password" required class="w-full h-14 px-6 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-gold-400 focus:bg-white transition-all text-navy-900 font-medium" placeholder="••••••••" />
          </div>

          <div v-if="error" class="text-center py-3 bg-red-50 rounded-xl">
            <span class="text-xs font-bold text-red-500">{{ error }}</span>
          </div>

          <CommonAppButton 
            variant="primary" 
            size="lg" 
            class="w-full h-16 shadow-xl shadow-navy-900/10"
            :disabled="isSubmitting"
          >
            <Icon v-if="isSubmitting" name="ph:spinner-gap-bold" class="animate-spin mr-2" />
            <span v-else>Register Profile</span>
          </CommonAppButton>
        </form>
      </div>

      <div class="text-center">
        <NuxtLink to="/login" class="text-xs font-bold text-slate-400 hover:text-navy-900 transition-colors uppercase tracking-widest">Already have an account? Login</NuxtLink>
      </div>
    </div>
  </div>
</template>
