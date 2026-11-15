<script setup>
import { useRoute } from 'vue-router'
const route=useRoute()
</script>
<template>
<div class="site-shell">
  <header class="site-header"><div class="container nav-wrap">
    <RouterLink to="/" class="brand" aria-label="SHADOWS_MOVIES Início"><span class="brand-icon">S<i>✦</i></span><span>SHADOWS<span class="accent">_MOVIES</span></span></RouterLink>
    <nav class="nav-links"><RouterLink to="/" :class="{active:route.name==='home'}">Início</RouterLink><RouterLink :to="{name:'home',hash:'#catalogo'}">Catálogo</RouterLink></nav>
    <span class="nav-caption"><i></i> UNIVERSO CINEMATOGRÁFICO</span>
  </div></header>
  <RouterView />
  <footer class="site-footer"><div class="container footer-inner"><strong><span class="accent">✦</span> SHADOWS_MOVIES</strong><span>Descobre histórias. Vive o cinema.</span><small>Dados: Studio Ghibli API · Vue.js</small></div></footer>
</div>
</template>