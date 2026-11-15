<script setup>
defineProps({modelValue:{type:String,default:''}})
const emit=defineEmits(['update:modelValue'])
</script>
<template>
  <label class="search-field">
    <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/></svg>
    <input type="search" :value="modelValue" @input="emit('update:modelValue',$event.target.value)" placeholder="Pesquisar filmes pelo título..." aria-label="Pesquisar filmes"/>
    <span>PESQUISAR</span>
  </label>
</template>
<style scoped>
.search-field{display:flex;align-items:center;gap:12px;min-width:0;flex:1;height:52px;padding:0 16px;border:1px solid #343246;border-radius:11px;color:#9d9bae;background:#171723;transition:border-color .2s}
.search-field:focus-within{border-color:#a58bff}
input{width:100%;min-width:0;background:transparent;border:0;outline:0;color:#fff;font-size:13px}
input::placeholder{color:#858398}
.search-field span{font-size:9px;font-weight:800;letter-spacing:1.3px;color:#716f86}
@media(max-width:600px){.search-field span{display:none}}
</style>