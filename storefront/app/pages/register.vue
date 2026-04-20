<script setup lang="ts">
const router = useRouter()
const supabase = useSupabaseClient()

const handleSocial = async (provider: 'google' | 'kakao') => {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin + '/login-callback'
      }
    })
    if (error) throw error
  } catch (e) {
    console.error(e)
  }
}
</script>

<template>
  <div class="min-h-[80vh] flex items-center justify-center px-6 py-20">
    <div class="w-full max-w-xl space-y-12 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <!-- Header -->
      <div class="space-y-6">
        <div class="w-24 h-24 bg-safety-orange/10 text-safety-orange rounded-[2.5rem] flex items-center justify-center mx-auto shadow-sm">
          <Icon name="ph:sparkle-fill" class="text-4xl" />
        </div>
        <div class="space-y-2">
          <h1 class="text-4xl font-black text-charcoal-900 tracking-tighter">회원가입</h1>
          <p class="text-[17px] text-gray-500 font-medium whitespace-pre-line">서담 계정을 생성하여 
          구매하신 모든 자료를 평생 소장하세요.</p>
        </div>
      </div>

      <!-- Guidance Box -->
      <div class="bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-premium space-y-10">
        <div class="space-y-6 text-left">
          <div class="flex gap-5 px-4 py-6 bg-charcoal-50 rounded-3xl">
            <div class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm text-charcoal-900">
              <Icon name="ph:shield-check-bold" class="text-2xl" />
            </div>
            <div class="space-y-1">
              <h3 class="font-black text-charcoal-900">비밀번호 없는 안전한 시작</h3>
              <p class="text-[13px] text-gray-500 leading-relaxed font-medium">비밀번호 설정이나 유출 걱정 없이, 본인 소유의 이메일 인증만으로 서담의 모든 서비스를 가장 현대적이고 강력한 보안 방식으로 시작할 수 있습니다.</p>
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <button 
            @click="router.push('/login')"
            class="w-full h-18 bg-charcoal-900 text-white rounded-[2rem] font-black text-[18px] flex items-center justify-center gap-3 hover:bg-safety-orange transition-all duration-300 shadow-2xl shadow-charcoal-900/20"
          >
            이메일로 회원가입하기
          </button>

          <div class="relative">
            <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-gray-100"></div></div>
            <div class="relative flex justify-center text-[11px] font-black uppercase tracking-widest text-gray-300"><span class="bg-white px-4">간편 회원가입</span></div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <button 
              @click="handleSocial('google')"
              class="h-16 flex items-center justify-center bg-white border border-gray-100 rounded-2xl hover:border-gray-200 transition-all shadow-sm group"
            >
              <Icon name="logos:google-icon" class="text-xl" />
            </button>
            <button 
              @click="handleSocial('kakao')"
              class="h-16 flex items-center justify-center bg-[#FEE500] rounded-2xl hover:brightness-95 transition-all shadow-sm group"
            >
              <Icon name="ri:kakao-talk-fill" class="text-3xl text-[#3C1E1E]" />
            </button>
          </div>
        </div>
      </div>

      <div class="pt-4">
        <NuxtLink to="/login" class="text-[14px] font-bold text-gray-400 hover:text-charcoal-900 transition-colors border-b border-gray-200 pb-1">
          이미 계정이 있으신가요? 로그인하기
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.shadow-premium {
  box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.05), 0 18px 36px -18px rgba(0, 0, 0, 0.05);
}
</style>
