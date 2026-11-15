<script setup>
defineProps({titulo:String,ano:Number,classificacao:{type:Number,default:0},imagem:String,realizador:String})
</script>
<template>
  <article class="movie-card">
    <div class="poster-wrap">
      <img v-if="imagem" :src="imagem" :alt="'Cartaz de '+titulo" loading="lazy"/>
      <div v-else class="no-poster">Sem imagem</div>
      <span class="rating">★ {{ classificacao.toFixed(1) }}</span>
      <span class="poster-overlay"><span>Ver detalhes</span><span class="arrow">↗</span></span>
    </div>
    <div class="card-body"><h3>{{ titulo }}</h3><p>{{ ano||'—' }} <span class="dot">·</span> {{ realizador }}</p></div>
  </article>
</template>
<style scoped>
.movie-card{height:100%;min-width:0}
.poster-wrap{position:relative;overflow:hidden;aspect-ratio:2/3;border-radius:13px;background:#242330;border:1px solid #343142}
.poster-wrap img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .35s,filter .35s}
.no-poster{display:grid;place-items:center;height:100%;color:#aaa}
.rating{position:absolute;top:12px;right:12px;background:#0a0915d4;border:1px solid #ffffff33;border-radius:8px;padding:6px 9px;font-size:12px;font-weight:800;color:#ffda95;backdrop-filter:blur(8px)}
.poster-overlay{position:absolute;inset:auto 0 0;display:flex;align-items:center;justify-content:space-between;padding:32px 15px 14px;color:#fff;font-weight:750;font-size:13px;background:linear-gradient(transparent,#05040be0);opacity:0;transform:translateY(10px);transition:.25s}
.arrow{display:grid;place-items:center;width:30px;height:30px;background:#a58bff;color:#090812;border-radius:50%;font-size:18px}
.card-body{padding:14px 3px 5px}
h3{margin:0 0 7px;font-size:16px;line-height:1.35;font-weight:760;letter-spacing:-.2px;color:#f6f3fb}
p{margin:0;color:#a5a2b8;font-size:12px;line-height:1.5}
.dot{margin:0 5px;color:#a58bff}
:global(.movie-link:hover) .poster-wrap img{transform:scale(1.055);filter:brightness(.85)}
:global(.movie-link:hover) .poster-overlay{opacity:1;transform:translateY(0)}
:global(.movie-link:hover) h3{color:#bfaaff}
@media(hover:none){.poster-overlay{opacity:1;transform:none}}
</style>