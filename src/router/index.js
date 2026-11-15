import {createRouter,createWebHashHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MovieDetailsView from '../views/MovieDetailsView.vue'
const router=createRouter({
  history:createWebHashHistory(),
  routes:[{path:'/',name:'home',component:HomeView},{path:'/filme/:id',name:'detalhes',component:MovieDetailsView}],
  scrollBehavior(to,from,savedPosition){
    if(savedPosition)return savedPosition
    if(to.hash)return {el:to.hash,behavior:'smooth'}
    return {top:0}
  }
})
export default router