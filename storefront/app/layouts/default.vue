<script setup lang="ts">
const { cart, openCart } = useCart()
const { user, isAuthenticated } = useAuth()

const isMobileMenuOpen = ref(false)

const gnbMenus = [
  {
    label: '서담 이야기',
    to: '/about',
  },
  {
    label: '온라인 서점',
    to: '/products',
    children: [
      { label: '학년별 자료', to: '/products' },
      { label: '시그니처 패키지', to: '/products?type=PACKAGE' },
      { label: '디지털 단행본', to: '/products?type=DIGITAL' },
    ]
  },
  {
    label: '학습 아카이브',
    to: '/library',
    children: [
      { label: '연계양상 및 등급컷', to: '/library/analysis' },
      { label: '정답 및 해설', to: '/library/answers' },
      { label: '영상 자료', to: '/library/video' },
      { label: '파일 자료', to: '/library/files' },
    ]
  },
  {
    label: '수험생 소통실',
    to: '/community',
    children: [
      { label: '전문가 답변 문의게시판', to: '/community/expert' },
      { label: '수험생 자유게시판', to: '/community/board' },
    ]
  },
  {
    label: '고객센터',
    to: '/support',
    children: [
      { label: '공지사항', to: '/support/notice' },
      { label: '혜택/이벤트', to: '/support/event' },
      { label: '자주 묻는 질문 (FAQ)', to: '/support/faq' },
    ]
  },
]

const activeMenu = ref<number | null>(null)
</script>

<template>
  <div class="min-h-screen font-sans bg-white">

    <!-- ===== TOP UTILITY BAR (이감 스타일) ===== -->
    <div class="bg-charcoal-50 border-b border-gray-200">
      <div class="mx-auto max-w-[1200px] px-4 flex items-center justify-end h-9 gap-6 text-[12px] text-gray-500">
        <NuxtLink v-if="isAuthenticated" to="/my-materials" class="hover:text-charcoal-900">마이페이지</NuxtLink>
        <NuxtLink v-else to="/login" class="hover:text-charcoal-900">로그인</NuxtLink>
        <NuxtLink v-if="!isAuthenticated" to="/register" class="hover:text-charcoal-900">회원가입</NuxtLink>
        <button @click="openCart" class="hover:text-charcoal-900 flex items-center gap-1">
          장바구니
          <span v-if="cart?.totalQuantity" class="text-[10px] bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center font-bold">{{ cart.totalQuantity }}</span>
        </button>
      </div>
    </div>

    <!-- ===== MAIN HEADER (이감 스타일) ===== -->
    <header class="bg-white border-b border-gray-200 relative z-50">
      <div class="mx-auto max-w-[1200px] px-4 flex items-center justify-between h-[80px]">
        <!-- Logo (SVG Fallback) -->
        <NuxtLink to="/" class="flex items-center gap-4">
          <div class="h-[50px] w-[50px] flex items-center justify-center bg-charcoal-900 rounded-xl shadow-lg shadow-charcoal-900/20">
            <svg viewBox="0 0 100 100" class="w-8 h-8 fill-none stroke-white stroke-[6]" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 25h60v50H20z" class="stroke-safety-orange" />
              <path d="M40 25v50M60 25v50" class="stroke-white/30" />
              <path d="M20 40h60M20 60h60" class="stroke-white/30" />
              <path d="M30 15h40l5 10H25z" class="fill-safety-orange stroke-none" />
            </svg>
          </div>
          <div class="flex flex-col">
            <div class="flex items-baseline gap-2">
              <span class="text-[24px] font-black text-charcoal-900 tracking-tighter leading-none">서담</span>
              <span class="text-[16px] font-medium text-charcoal-900/50 serif">(書湛)</span>
            </div>
            <span class="text-[11px] text-safety-orange font-bold tracking-tight">지혜로운 책을 깊게 담다</span>
          </div>
        </NuxtLink>

        <!-- GNB Navigation -->
        <nav class="hidden lg:flex items-center h-full">
          <div 
            v-for="(menu, idx) in gnbMenus" 
            :key="menu.label"
            class="relative h-full flex items-center group"
            @mouseenter="activeMenu = idx"
            @mouseleave="activeMenu = null"
          >
            <NuxtLink 
              :to="menu.to" 
              class="px-7 text-[16px] font-bold text-charcoal-900 group-hover:text-safety-orange transition-colors h-full flex items-center"
              :class="{ 'text-safety-orange': $route.path.startsWith(menu.to) }"
            >
              {{ menu.label }}
              <Icon v-if="menu.children" name="ph:caret-down-bold" class="ml-1.5 text-[10px] opacity-30 group-hover:opacity-100 transition-opacity" />
            </NuxtLink>
            
            <!-- MEGA DROPDOWN (이감 스타일) -->
            <div 
              v-if="menu.children?.length"
              class="invisible group-hover:visible absolute top-[80px] left-1/2 -translate-x-1/2 bg-white border border-gray-200 shadow-2xl rounded-xl py-6 px-1 z-[999] opacity-0 group-hover:opacity-100 group-hover:translate-y-2 transition-all duration-300 min-w-[220px]"
            >
              <div class="flex flex-col gap-1">
                <NuxtLink 
                  v-for="child in menu.children" 
                  :key="child.label"
                  :to="child.to"
                  class="flex items-center justify-between px-6 py-3.5 text-[14px] font-bold text-gray-500 hover:text-charcoal-900 hover:bg-charcoal-50 rounded-lg transition-all"
                >
                  <span>{{ child.label }}</span>
                  <Icon name="ph:arrow-right-bold" class="text-[10px] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-safety-orange" />
                </NuxtLink>
              </div>
            </div>
          </div>
        </nav>

        <!-- Utility Icons -->
        <div class="flex items-center gap-5">
          <button class="text-charcoal-900 hover:text-safety-orange transition-colors">
            <Icon name="ph:magnifying-glass-bold" class="text-xl" />
          </button>
          <button @click="openCart" class="relative text-charcoal-900 hover:text-safety-orange transition-colors">
            <Icon name="ph:shopping-cart-bold" class="text-xl" />
            <span v-if="cart?.totalQuantity" class="absolute -top-2 -right-2 w-[18px] h-[18px] bg-red-500 text-[10px] text-white rounded-full flex items-center justify-center font-bold">
              {{ cart.totalQuantity }}
            </span>
          </button>
          <NuxtLink to="/my-materials" class="text-charcoal-900 hover:text-safety-orange transition-colors">
            <Icon name="ph:user-bold" class="text-xl" />
          </NuxtLink>
          
          <!-- Mobile Toggle -->
          <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="lg:hidden text-charcoal-900">
            <Icon :name="isMobileMenuOpen ? 'ph:x-bold' : 'ph:list-bold'" class="text-2xl" />
          </button>
        </div>
      </div>
      
      <!-- ===== SECONDARY NAVIGATION BAR (이감 스타일 서브메뉴) ===== -->
      <div v-if="$route.path !== '/' && gnbMenus.find(m => m.to !== '/' && $route.path.startsWith(m.to))" class="bg-charcoal-50 border-b border-gray-200">
        <div class="mx-auto max-w-[1200px] px-4 flex items-center h-12 gap-10">
          <div class="hidden md:flex items-center gap-2 pr-4 border-r border-gray-200 h-6">
            <span class="text-[11px] font-black text-charcoal-900 uppercase tracking-tighter">{{ gnbMenus.find(m => $route.path.startsWith(m.to))?.label }}</span>
          </div>
          <div class="flex items-center gap-8 h-full">
            <NuxtLink 
              v-for="child in gnbMenus.find(m => $route.path.startsWith(m.to))?.children"
              :key="child.label"
              :to="child.to"
              class="text-[14px] font-bold transition-all relative h-full flex items-center"
              :class="$route.path === child.to ? 'text-safety-orange' : 'text-gray-400 hover:text-charcoal-900'"
            >
              {{ child.label }}
              <span v-if="$route.path === child.to" class="absolute bottom-0 left-0 w-full h-[3px] bg-safety-orange"></span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </header>

    <!-- ===== MAIN CONTENT ===== -->
    <main>
      <slot />
    </main>

    <!-- ===== CART DRAWER ===== -->
    <CartDrawer />

    <!-- ===== FOOTER (이감 스타일) ===== -->
    <footer class="bg-[#2b2b2b] text-white/70 mt-24">
      <div class="mx-auto max-w-[1200px] px-4 py-12">
        <!-- Footer Links -->
        <div class="flex flex-wrap items-center gap-4 text-[13px] border-b border-white/10 pb-6 mb-6">
          <NuxtLink to="/about" class="hover:text-white transition-colors">브랜드 소개</NuxtLink>
          <span class="text-white/20">|</span>
          <NuxtLink to="/products" class="hover:text-white transition-colors">온라인 구매</NuxtLink>
          <span class="text-white/20">|</span>
          <NuxtLink to="/support/faq" class="hover:text-white transition-colors">이용안내</NuxtLink>
          <span class="text-white/20">|</span>
          <NuxtLink to="/terms" class="hover:text-white transition-colors">이용약관</NuxtLink>
          <span class="text-white/20">|</span>
          <NuxtLink to="/privacy" class="font-bold text-white hover:text-safety-orange transition-colors">개인정보처리방침</NuxtLink>
        </div>
        
        <!-- Company Info -->
        <div class="text-[12px] leading-relaxed space-y-1 text-white/50">
          <p>(주) 서담 / 대표자: 홍길동 / 사업자등록번호: 000-00-00000 / 통신판매업신고번호: 제 2026-서울강남-0000</p>
          <p>서울특별시 강남구 테헤란로 123 서담 아카이브 타워</p>
          <p class="pt-3 text-white/30">Copyright © (주)서담. All Rights Reserved.</p>
        </div>

        <!-- Customer Center -->
        <div class="mt-8 pt-6 border-t border-white/10 flex flex-col md:flex-row md:items-center gap-4">
          <div class="text-[13px]">
            <span class="text-white font-bold">고객센터 : </span>
            <a href="tel:1588-0000" class="text-white font-bold text-[18px]">1588-0000</a>
          </div>
          <div class="text-[11px] text-white/40">
            운영시간: 평일 10:00-18:00, 점심시간: 12:30-13:30 / 토,일,공휴일 휴무
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
