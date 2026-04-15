<template>
  <div class="min-h-screen font-sans selection:bg-accent selection:text-white">
    <!-- Main Background with Blueprint Grid -->
    <div class="fixed inset-0 -z-10 bg-white">
      <div class="absolute inset-0 opacity-5 blueprint-grid"></div>
    </div>

    <!-- Navigation -->
    <header class="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div class="flex items-center gap-2">
          <div class="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
            <Icon name="ph:books-bold" class="text-white text-xl" />
          </div>
          <span class="text-xl font-bold tracking-tight text-primary">Publisher Mall</span>
        </div>
        
        <nav class="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <NuxtLink to="/" class="transition-colors hover:text-primary">Home</NuxtLink>
          <NuxtLink to="/products" class="transition-colors hover:text-primary">Books</NuxtLink>
          <NuxtLink to="/archive" class="transition-colors hover:text-primary">Archive</NuxtLink>
        </nav>

        <div class="flex items-center gap-4">
          <button class="p-2 text-slate-600 hover:text-primary transition-colors">
            <Icon name="ph:magnifying-glass-bold" class="text-xl" />
          </button>
          <CommonAppButton variant="primary">Login</CommonAppButton>
        </div>
      </div>
    </header>

    <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <slot />
    </main>

    <footer class="mt-auto border-t border-slate-200 bg-white py-12">
      <div class="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <p class="text-sm text-slate-500">© 2026 Publisher Mall. Powered by DevOwls.</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.blueprint-grid {
  background-image: 
    linear-gradient(#000 1px, transparent 1px),
    linear-gradient(90deg, #000 1px, transparent 1px);
  background-size: 20px 20px;
}
</style>
