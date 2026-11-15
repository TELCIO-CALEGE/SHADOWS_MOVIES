<script setup>
import MovieCard from './MovieCard.vue'
import {useRoute} from 'vue-router'
const route=useRoute()
defineProps({filmes:{type:Array,required:true}})
</script>
<template>
  <div class="movie-grid">
    <RouterLink v-for="filme in filmes" :key="filme.id" class="movie-link"
      :to="{name:'detalhes',params:{id:filme.id},query:route.name==='home'?route.query:{}}">
      <MovieCard :titulo="filme.titulo" :ano="filme.ano" :classificacao="filme.classificacao" :imagem="filme.imagem" :realizador="filme.realizador"/>
    </RouterLink>
  </div>
</template>
<style scoped>
.movie-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:27px 19px}
.movie-link{min-width:0;display:block;border-radius:13px}
@media(max-width:1100px){.movie-grid{grid-template-columns:repeat(4,minmax(0,1fr))}}
@media(max-width:800px){.movie-grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:22px 14px}}
@media(max-width:540px){.movie-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:21px 12px}}
</style>