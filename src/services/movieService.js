// API pública Studio Ghibli, sem necessidade de chave.
const URL_API = 'https://ghibliapi.vercel.app/films'
let pedido = null
export async function obterCatalogo() {
  if (!pedido) {
    pedido = fetch(URL_API).then(async resposta => {
      if (!resposta.ok) throw new Error('Não foi possível carregar os filmes.')
      const dados = await resposta.json()
      if (!Array.isArray(dados)) throw new Error('Resposta inválida da API.')
      return dados.map(f => ({
        id: String(f.id),
        titulo: f.title || 'Sem título',
        tituloOriginal: f.original_title || '',
        ano: Number(f.release_date) || null,
        classificacao: (Number(f.rt_score) || 0) / 10,
        imagem: f.image || '',
        banner: f.movie_banner || '',
        realizador: f.director || 'Desconhecido',
        produtor: f.producer || 'Não disponível',
        duracao: Number(f.running_time) || null,
        descricao: f.description || 'Sinopse não disponível.'
      })).sort((a,b) => b.ano - a.ano)
    }).catch(e => { pedido = null; throw e })
  }
  return pedido
}
export async function obterDetalhesFilme(id) {
  const filmes = await obterCatalogo()
  const filme = filmes.find(f => f.id === String(id))
  if (!filme) throw new Error('Filme não encontrado.')
  return filme
}
