<script setup>
defineProps({
  realizador:{type:String,default:''},ano:{type:String,default:''},classificacao:{type:String,default:''},
  realizadores:{type:Array,default:()=>[]},anos:{type:Array,default:()=>[]}
})
const emit=defineEmits(['update:realizador','update:ano','update:classificacao'])
</script>
<template>
  <div class="filters">
    <label><span class="sr-only">Realizador</span><select :value="realizador" @change="emit('update:realizador',$event.target.value)">
      <option value="">Todos os realizadores</option><option v-for="nome in realizadores" :key="nome" :value="nome">{{ nome }}</option>
    </select></label>
    <label><span class="sr-only">Ano</span><select :value="ano" @change="emit('update:ano',$event.target.value)">
      <option value="">Todos os anos</option><option v-for="valor in anos" :key="valor" :value="String(valor)">{{ valor }}</option>
    </select></label>
    <label><span class="sr-only">Classificação</span><select :value="classificacao" @change="emit('update:classificacao',$event.target.value)">
      <option value="">Qualquer nota</option><option value="7">Nota 7+</option><option value="8">Nota 8+</option><option value="9">Nota 9+</option><option value="9.5">Nota 9.5+</option>
    </select></label>
  </div>
</template>
<style scoped>
.filters{display:flex;gap:10px;flex-wrap:wrap;flex:1.5}
label{display:block;flex:1;min-width:140px}
select{width:100%;height:52px;border:1px solid #343246;border-radius:11px;background:#171723;color:#e9e6f3;padding:0 13px;font-size:12px;cursor:pointer}
.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
</style>