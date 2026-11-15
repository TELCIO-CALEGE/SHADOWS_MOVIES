<script setup>
import {ref,computed,onMounted,watch} from 'vue'
import {useRoute,useRouter} from 'vue-router'
import SearchBar from '../components/SearchBar.vue'
import MovieFilters from '../components/MovieFilters.vue'
import MovieList from '../components/MovieList.vue'
import {obterCatalogo} from '../services/movieService.js'

const route=useRoute(),router=useRouter()
const catalogo=ref([]),carregando=ref(true),erro=ref('')
const pesquisa=ref(String(route.query.pesquisa||''))
const realizador=ref(String(route.query.realizador||''))
const ano=ref(String(route.query.ano||''))
const classificacao=ref(String(route.query.classificacao||''))
const ordenacao=ref(String(route.query.ordenacao||'recentes'))
const pagina=ref(Math.max(1,Number(route.query.pagina)||1))
const porPagina=10
const destaque=computed(()=>catalogo.value.find(f=>f.titulo.toLowerCase()==='spirited away')||catalogo.value[0]||null)
const realizadores=computed(()=>[...new Set(catalogo.value.map(f=>f.realizador))].sort())
const anos=computed(()=>[...new Set(catalogo.value.map(f=>f.ano).filter(Boolean))].sort((a,b)=>b-a))
const filtrados=computed(()=>{
  const termo=pesquisa.value.trim().toLocaleLowerCase()
  const filmes=catalogo.value.filter(f=>
    (!termo||f.titulo.toLocaleLowerCase().includes(termo)||f.tituloOriginal.toLocaleLowerCase().includes(termo))&&
    (!realizador.value||f.realizador===realizador.value)&&
    (!ano.value||String(f.ano)===ano.value)&&
    (!classificacao.value||f.classificacao>=Number(classificacao.value))
  )
  if(ordenacao.value==='nota')filmes.sort((a,b)=>b.classificacao-a.classificacao)
  else if(ordenacao.value==='titulo')filmes.sort((a,b)=>a.titulo.localeCompare(b.titulo))
  else if(ordenacao.value==='antigos')filmes.sort((a,b)=>a.ano-b.ano)
  else filmes.sort((a,b)=>b.ano-a.ano)
  return filmes
})
const totalPaginas=computed(()=>Math.max(1,Math.ceil(filtrados.value.length/porPagina)))
const filmesVisiveis=computed(()=>filtrados.value.slice((pagina.value-1)*porPagina,pagina.value*porPagina))
const filtrosActivos=computed(()=>Boolean(pesquisa.value||realizador.value||ano.value||classificacao.value))
async function carregar(){
  carregando.value=true;erro.value=''
  try{catalogo.value=await obterCatalogo()}
  catch(e){erro.value=e.message||'Erro ao carregar filmes.'}
  finally{carregando.value=false}
}
function limparFiltros(){pesquisa.value='';realizador.value='';ano.value='';classificacao.value='';ordenacao.value='recentes'}
function explorar(){document.getElementById('catalogo')?.scrollIntoView({behavior:'smooth'})}
function mudarPagina(nova){if(nova<1||nova>totalPaginas.value)return;pagina.value=nova;explorar()}
watch([pesquisa,realizador,ano,classificacao,ordenacao],()=>{pagina.value=1})
watch([pesquisa,realizador,ano,classificacao,ordenacao,pagina],()=>{
  const query={}
  if(pesquisa.value.trim())query.pesquisa=pesquisa.value.trim()
  if(realizador.value)query.realizador=realizador.value
  if(ano.value)query.ano=ano.value
  if(classificacao.value)query.classificacao=classificacao.value
  if(ordenacao.value!=='recentes')query.ordenacao=ordenacao.value
  if(pagina.value>1)query.pagina=String(pagina.value)
  router.replace({name:'home',query,hash:route.hash})
})
watch(totalPaginas,total=>{if(pagina.value>total)pagina.value=total})
onMounted(carregar)
</script>

<template>
<div class="home">
  <section class="hero" aria-labelledby="hero-title">
    <div class="hero-image" :style="destaque?.banner?{backgroundImage:'url('+destaque.banner+')'}:{}"></div>
    <div class="hero-vignette"></div>
    <div class="container hero-inner">
      <div class="hero-content">
        <span class="eyebrow"><i></i> A TUA NOVA EXPERIÊNCIA DE CINEMA</span>
        <h1 id="hero-title">Histórias para<br><em>além do ecrã.</em></h1>
        <p>Uma viagem por mundos extraordinários. Explora filmes inesquecíveis, encontra os teus favoritos e descobre novas histórias.</p>
        <div class="hero-actions">
          <button class="btn-primary" @click="explorar">Explorar filmes <span>↗</span></button>
          <RouterLink v-if="destaque" class="btn-secondary" :to="{name:'detalhes',params:{id:destaque.id}}">Ver filme em destaque <span>→</span></RouterLink>
        </div>
        <div class="hero-stats">
          <div><strong>{{ catalogo.length||'—' }}</strong><span>FILMES NO CATÁLOGO</span></div><i></i>
          <div><strong>100%</strong><span>ACESSO GRATUITO</span></div><i></i>
          <div><strong>HD</strong><span>IMAGENS E DETALHES</span></div>
        </div>
      </div>
      <div v-if="destaque" class="featured-label">
        <span>✦ EM DESTAQUE</span><strong>{{ destaque.titulo }}</strong>
        <small>{{ destaque.ano }} · ★ {{ destaque.classificacao.toFixed(1) }} · {{ destaque.realizador }}</small>
      </div>
    </div>
  </section>

  <section id="catalogo" class="catalogue container" aria-labelledby="catalogue-title">
    <div class="section-heading">
      <div><span class="section-kicker">✦ SELECÇÃO ESPECIAL</span><h2 id="catalogue-title">O teu próximo <em>filme favorito.</em></h2><p>Explora a colecção completa de filmes do Studio Ghibli.</p></div>
      <span class="collection-count">{{ catalogo.length }} TÍTULOS</span>
    </div>
    <div class="search-panel">
      <div class="search-panel-top">
        <SearchBar v-model="pesquisa"/>
        <MovieFilters v-model:realizador="realizador" v-model:ano="ano" v-model:classificacao="classificacao" :realizadores="realizadores" :anos="anos"/>
      </div>
      <div class="search-panel-bottom">
        <span>{{ filtrados.length }} {{ filtrados.length===1?'filme encontrado':'filmes encontrados' }}</span>
        <div class="search-actions">
          <button v-if="filtrosActivos" class="clear-btn" @click="limparFiltros">✕ Limpar filtros</button>
          <label class="sort-label">Ordenar por
            <select v-model="ordenacao" aria-label="Ordenar filmes">
              <option value="recentes">Mais recentes</option><option value="antigos">Mais antigos</option><option value="nota">Melhor classificação</option><option value="titulo">Título A–Z</option>
            </select>
          </label>
        </div>
      </div>
    </div>
    <div v-if="carregando" class="status-panel" role="status"><span class="loading-ring"></span><h3>A preparar a sessão...</h3><p>A carregar o catálogo de filmes.</p></div>
    <div v-else-if="erro" class="status-panel" role="alert"><span class="status-icon">!</span><h3>Não foi possível carregar os filmes</h3><p>{{ erro }}</p><button class="btn-primary" @click="carregar">Tentar novamente ↻</button></div>
    <template v-else>
      <MovieList v-if="filmesVisiveis.length" :filmes="filmesVisiveis"/>
      <div v-else class="status-panel"><span class="status-icon">⌕</span><h3>Nenhum filme encontrado</h3><p>Experimenta outro título ou ajusta os filtros.</p><button class="btn-primary" @click="limparFiltros">Ver todos os filmes</button></div>
      <nav v-if="totalPaginas>1" class="pagination" aria-label="Paginação">
        <button :disabled="pagina===1" @click="mudarPagina(pagina-1)">← Anterior</button><span>{{ pagina }} <i>/</i> {{ totalPaginas }}</span><button :disabled="pagina===totalPaginas" @click="mudarPagina(pagina+1)">Seguinte →</button>
      </nav>
    </template>
  </section>
  <section class="closing-banner container">
    <div><span>✦ CADA HISTÓRIA CONTA</span><h2>O próximo grande filme<br>está à tua espera.</h2><p>Sem subscrições, sem complicações. Apenas cinema e descoberta.</p></div>
    <button @click="explorar">Descobrir filmes <span>↗</span></button>
  </section>
</div>
</template>

<style scoped>
.home{padding-bottom:82px}
.hero{min-height:650px;position:relative;overflow:hidden;display:flex;align-items:center;isolation:isolate;background:radial-gradient(circle at 76% 40%,#33234d,#11121e 55%,#0a0b12)}
.hero-image{position:absolute;z-index:-2;inset:0 0 0 33%;background-size:cover;background-position:center 45%;opacity:.78;filter:saturate(.78)}
.hero-vignette{position:absolute;z-index:-1;inset:0;background:linear-gradient(90deg,#0a0a12 0%,#0a0a12 24%,#0a0a12ed 39%,#0a0a125c 77%,#0a0a1240),linear-gradient(0deg,#080910 0%,transparent 32%,#08091033 85%)}
.hero-inner{position:relative;display:flex;align-items:center;min-height:650px;padding-top:35px;padding-bottom:70px}
.hero-content{max-width:680px}
.eyebrow{display:flex;align-items:center;gap:11px;color:#c8b6ff;font-size:10px;font-weight:850;letter-spacing:2.7px}
.eyebrow i{width:28px;height:2px;background:#ac91ff}
h1{margin:24px 0;font-size:clamp(52px,6vw,88px);line-height:1.02;font-weight:850;letter-spacing:-4px}
h1 em{font-style:normal;color:#bea6ff}
.hero-content>p{max-width:530px;color:#c1bfce;font-size:15px;line-height:1.85}
.hero-actions{display:flex;align-items:center;gap:13px;flex-wrap:wrap;margin-top:33px}
.btn-primary{display:inline-flex;align-items:center;justify-content:center;gap:23px;border:0;border-radius:10px;padding:15px 20px;color:#130f21;background:linear-gradient(135deg,#c8b1ff,#9c80f5);font-weight:850;font-size:13px;box-shadow:0 8px 25px #8d6be43d}
.btn-primary:hover{filter:brightness(1.08)}
.btn-secondary{display:inline-flex;align-items:center;gap:18px;padding:14px 17px;border:1px solid #71677f;border-radius:10px;color:#f4f0fa;font-size:13px;font-weight:700;background:#11111a88}
.btn-secondary:hover{background:#262237}
.hero-stats{display:flex;align-items:center;gap:28px;margin-top:62px}
.hero-stats div{display:flex;flex-direction:column;gap:7px}
.hero-stats strong{font-size:25px;font-weight:850}
.hero-stats span{color:#9692a7;font-size:9px;font-weight:750;letter-spacing:1.2px}
.hero-stats>i{width:1px;height:31px;background:#4a4155}
.featured-label{position:absolute;right:0;bottom:62px;display:flex;flex-direction:column;gap:8px;max-width:290px;padding:16px 20px;border:1px solid #ffffff30;border-radius:13px;background:#0c0b15a8;backdrop-filter:blur(14px)}
.featured-label>span{color:#ceb7ff;font-size:10px;font-weight:850;letter-spacing:1.6px}
.featured-label strong{font-size:18px;font-weight:800}
.featured-label small{font-size:11px;color:#c9c6d5}
.catalogue{padding-top:75px;scroll-margin-top:90px}
.section-heading{display:flex;align-items:end;justify-content:space-between;gap:24px;margin-bottom:31px}
.section-kicker{color:#ad93fa;font-size:10px;letter-spacing:2.2px;font-weight:850}
h2{margin:13px 0 8px;font-size:clamp(29px,3.6vw,43px);letter-spacing:-1.6px;font-weight:830}
h2 em{color:#b69cfb;font-style:normal}
.section-heading p{margin:0;color:#9d9bad;font-size:13px}
.collection-count{flex-shrink:0;border:1px solid #41394d;border-radius:30px;padding:11px 16px;color:#c7b5f7;font-size:10px;font-weight:800;letter-spacing:1.2px}
.search-panel{margin-bottom:31px;border:1px solid #272634;border-radius:16px;padding:16px;background:#10111b}
.search-panel-top{display:flex;gap:11px;align-items:center}
.search-panel-bottom{display:flex;justify-content:space-between;align-items:center;gap:15px;padding:15px 3px 1px;font-size:12px;color:#a7a3b7}
.search-actions{display:flex;align-items:center;gap:15px}
.clear-btn{border:0;background:transparent;color:#c1a5ff;font-size:12px}
.sort-label{display:flex;align-items:center;gap:9px}
.sort-label select{background:#1d1b2a;color:#f1eafc;border:1px solid #353247;border-radius:7px;padding:8px;font-size:12px}
.status-panel{min-height:280px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;text-align:center;border:1px dashed #393346;border-radius:15px;background:#12121b}
.status-panel h3{margin:10px 0 0}
.status-panel p{color:#aaa4b9;margin:0 0 12px}
.status-icon{color:#b59cf9;font-size:48px}
.loading-ring{width:32px;height:32px;border:3px solid #3c344e;border-top-color:#b99cff;border-radius:50%;animation:spin .8s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.pagination{display:flex;justify-content:center;align-items:center;gap:25px;margin-top:46px}
.pagination button{padding:11px 17px;border:1px solid #393344;border-radius:9px;background:#1b1928;color:#f4f1f9;font-size:12px;font-weight:700}
.pagination button:disabled{opacity:.35;cursor:not-allowed}
.pagination span{font-size:14px;font-weight:800}
.pagination span i{color:#7d778e;margin:0 5px}
.closing-banner{display:flex;align-items:center;justify-content:space-between;gap:25px;margin-top:92px;padding:42px 50px;border-radius:18px;border:1px solid #4b3b69;background:radial-gradient(circle at 95% 10%,#392554,#1b152a 52%,#15121e)}
.closing-banner div>span{color:#c4aaff;font-size:10px;font-weight:800;letter-spacing:2px}
.closing-banner h2{margin:11px 0;font-size:clamp(26px,3vw,36px)}
.closing-banner p{color:#b1a8c1;font-size:13px}
.closing-banner button{border:1px solid #b7a0e4;border-radius:9px;padding:13px 17px;color:#fff;background:#a58bff20;font-weight:750;white-space:nowrap}
.closing-banner button span{margin-left:12px}
@media(max-width:1000px){.search-panel-top{flex-direction:column;align-items:stretch}.hero-content{max-width:620px}}
@media(max-width:760px){.hero,.hero-inner{min-height:620px}.hero-image{inset:0;opacity:.4}.hero-vignette{background:linear-gradient(90deg,#0a0a12d9,#0a0a1299),linear-gradient(0deg,#080910,transparent 70%)}.hero-inner{padding-bottom:50px}h1{letter-spacing:-2.4px}.featured-label{display:none}.hero-stats{margin-top:50px;gap:18px}.closing-banner{flex-direction:column;align-items:start;padding:34px 26px}}
@media(max-width:540px){.hero-content>p{font-size:13px}.hero-stats{gap:12px}.hero-stats strong{font-size:19px}.hero-stats span{font-size:7px}.hero-actions{gap:10px}.btn-primary,.btn-secondary{padding:13px;font-size:12px}.catalogue{padding-top:55px}.section-heading{flex-direction:column;align-items:start;gap:13px}.search-panel-bottom{align-items:start;flex-direction:column}.search-actions{width:100%;justify-content:space-between}.closing-banner{margin-top:60px}}
</style>