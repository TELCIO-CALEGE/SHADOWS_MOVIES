<script setup>
import {ref,computed,watch,onUnmounted} from 'vue'
import {useRoute} from 'vue-router'
import {obterCatalogo,obterDetalhesFilme} from '../services/movieService.js'
import MovieList from '../components/MovieList.vue'
const route=useRoute()
const filme=ref(null),catalogo=ref([]),carregando=ref(true),erro=ref('')
let pedidoActual=0
const relacionados=computed(()=>catalogo.value.filter(f=>f.id!==filme.value?.id).sort((a,b)=>b.classificacao-a.classificacao).slice(0,5))
async function carregarDetalhes(){
  const pedido=++pedidoActual
  carregando.value=true;erro.value='';filme.value=null
  try{
    const [detalhes,todos]=await Promise.all([obterDetalhesFilme(route.params.id),obterCatalogo()])
    if(pedido!==pedidoActual)return
    filme.value=detalhes;catalogo.value=todos
  }catch(e){if(pedido===pedidoActual)erro.value=e.message||'Não foi possível carregar os detalhes.'}
  finally{if(pedido===pedidoActual)carregando.value=false}
}
watch(()=>route.params.id,carregarDetalhes,{immediate:true})
onUnmounted(()=>{pedidoActual++})
</script>
<template>
<main class="details-page">
  <div v-if="carregando" class="container status-message" role="status">A carregar detalhes do filme...</div>
  <div v-else-if="erro" class="container status-message" role="alert"><h2>Não foi possível abrir o filme</h2><p>{{ erro }}</p><RouterLink to="/" class="back-link">← Voltar ao catálogo</RouterLink></div>
  <template v-else-if="filme">
    <section class="detail-hero">
      <div class="detail-backdrop" :style="filme.banner?{backgroundImage:'url('+filme.banner+')'}:{}"></div>
      <div class="detail-overlay"></div>
      <div class="container detail-hero-inner">
        <RouterLink :to="{name:'home',query:route.query,hash:'#catalogo'}" class="back-link">← Voltar ao catálogo</RouterLink>
        <span class="detail-eyebrow">✦ SELECÇÃO STUDIO GHIBLI</span>
        <h1>{{ filme.titulo }}</h1>
        <div class="detail-tags"><span class="score">★ {{ filme.classificacao.toFixed(1) }} / 10</span><span>{{ filme.ano||'Ano desconhecido' }}</span><span>{{ filme.duracao?filme.duracao+' min':'Duração indisponível' }}</span><span>ANIMAÇÃO</span></div>
        <p>Um filme realizado por <strong>{{ filme.realizador }}</strong></p>
      </div>
    </section>
    <section class="container detail-body">
      <div class="detail-poster"><img v-if="filme.imagem" :src="filme.imagem" :alt="'Cartaz de '+filme.titulo"/></div>
      <div class="detail-content">
        <span class="section-kicker">✦ SOBRE O FILME</span>
        <h2>Uma história para <em>recordar.</em></h2>
        <p class="synopsis">{{ filme.descricao }}</p>
        <p class="translation-note">Sinopse disponibilizada em inglês pela API.</p>
        <div class="info-grid">
          <div><span>TÍTULO ORIGINAL</span><strong>{{ filme.tituloOriginal||'Não disponível' }}</strong></div>
          <div><span>REALIZADOR</span><strong>{{ filme.realizador }}</strong></div>
          <div><span>PRODUTOR</span><strong>{{ filme.produtor }}</strong></div>
          <div><span>LANÇAMENTO</span><strong>{{ filme.ano||'Não disponível' }}</strong></div>
        </div>
        <RouterLink :to="{name:'home',query:route.query,hash:'#catalogo'}" class="browse-btn">← Explorar outros filmes</RouterLink>
      </div>
    </section>
    <section class="container related-section">
      <div class="related-heading"><div><span class="section-kicker">✦ CONTINUA A DESCOBRIR</span><h2>Talvez também <em>gostes de...</em></h2></div><RouterLink :to="{name:'home',hash:'#catalogo'}">Ver todos →</RouterLink></div>
      <MovieList :filmes="relacionados"/>
    </section>
  </template>
</main>
</template>
<style scoped>
.details-page{padding-bottom:90px}
.detail-hero{min-height:490px;position:relative;isolation:isolate;background:radial-gradient(circle at 80% 20%,#352448,#0c0b13 65%);display:flex;align-items:end}
.detail-backdrop{position:absolute;z-index:-2;inset:0;background-size:cover;background-position:center 43%;opacity:.68}
.detail-overlay{position:absolute;z-index:-1;inset:0;background:linear-gradient(0deg,#080910 0%,#0809104d 72%),linear-gradient(90deg,#080910 0%,#08091099 52%,#08091026)}
.detail-hero-inner{padding-top:35px;padding-bottom:65px}
.back-link{display:inline-flex;align-items:center;gap:9px;padding:10px 0;color:#d7c5ff;font-size:13px;font-weight:700}
.back-link:hover{color:#fff}
.detail-eyebrow{display:block;margin-top:65px;font-size:10px;color:#d0baff;font-weight:850;letter-spacing:2.2px}
h1{margin:17px 0 20px;font-size:clamp(39px,6vw,73px);line-height:1.05;letter-spacing:-2.5px;max-width:880px}
.detail-tags{display:flex;gap:10px;flex-wrap:wrap;align-items:center}
.detail-tags span{border:1px solid #9b8d9c78;background:#0b0b13a1;border-radius:7px;padding:7px 11px;font-size:12px;font-weight:700}
.detail-tags .score{color:#ffda92}
.detail-hero-inner>p{margin:18px 0 0;color:#c5bfce;font-size:13px}
.detail-hero-inner>p strong{color:#fff}
.detail-body{display:grid;grid-template-columns:270px minmax(0,1fr);gap:54px;margin-top:48px}
.detail-poster img{display:block;width:100%;border-radius:14px;border:1px solid #51465b;box-shadow:0 20px 60px #0008}
.detail-content{padding-top:10px}
.section-kicker{font-size:10px;color:#bda3ff;letter-spacing:2.1px;font-weight:850}
h2{font-size:clamp(28px,3.6vw,41px);letter-spacing:-1.4px;margin:13px 0 22px}
h2 em{font-style:normal;color:#b79cfb}
.synopsis{color:#cbc6d4;line-height:1.9;font-size:14px;max-width:760px;white-space:pre-line}
.translation-note{font-size:11px;color:#807c91}
.info-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:25px;margin:35px 0;padding:28px 0;border-top:1px solid #2d293a;border-bottom:1px solid #2d293a}
.info-grid div{display:flex;flex-direction:column;gap:8px}
.info-grid span{font-size:10px;font-weight:800;letter-spacing:1.2px;color:#817d94}
.info-grid strong{font-size:14px;font-weight:700}
.browse-btn{display:inline-block;padding:13px 17px;background:#aa90fa;color:#0e0b19;border-radius:9px;font-weight:800;font-size:13px}
.related-section{margin-top:90px}
.related-heading{display:flex;align-items:end;justify-content:space-between;gap:15px;margin-bottom:25px}
.related-heading h2{margin-bottom:0}
.related-heading>a{color:#c2aaff;font-size:13px;font-weight:800;white-space:nowrap}
.status-message{padding:80px 0;min-height:60vh}
.status-message p{color:#a8a1b8}
@media(max-width:750px){.detail-body{grid-template-columns:1fr;gap:28px}.detail-poster{max-width:240px}.detail-hero{min-height:420px}.detail-eyebrow{margin-top:40px}}
@media(max-width:480px){.detail-body{margin-top:20px}.info-grid{gap:18px}.detail-tags span{font-size:10px}.related-heading{align-items:start;flex-direction:column}}
</style>