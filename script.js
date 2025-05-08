const supabase = createClient(
  'https://rubhsqcmjmvdwohooriw.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1YmhzcWNtam12ZHdvaG9vcml3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2NTE1MzgsImV4cCI6MjA2MjIyNzUzOH0.xl9WVhRLg5fn2kjGQLP-gE7RAQEZJTsK9MzhFiJEp84'
)

let produtos = []

function formataPreco(preco) {
  return preco.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}

function renderizarProdutos() {
  const produtosContainer = document.getElementById('produtos')

  produtosContainer.innerHTML = ''  // Limpar o conteúdo antes de renderizar

  if (produtos.length === 0) {
    produtosContainer.textContent = 'Nenhum produto encontrado.'
    return
  }

  const produtosHTML = produtos.map(produto => {
    const produtoCard = document.createElement('div')
    produtoCard.className = 'produto-card'

    const produtoInfo = document.createElement('div')
    produtoInfo.className = 'produto-info'

    const produtoNome = document.createElement('h3')
    produtoNome.className = 'produto-nome'
    produtoNome.textContent = produto.nome

    const produtoDescricao = document.createElement('p')
    produtoDescricao.className = 'produto-descricao'
    produtoDescricao.textContent = produto.descricao

    const produtoPreco = document.createElement('div')
    produtoPreco.className = 'produto-preco'

    if (produto.temDesconto) {
      const precoOriginal = document.createElement('span')
      precoOriginal.className = 'preco-original'
      precoOriginal.textContent = formataPreco(produto.precoOriginal)

      const precoDesconto = document.createElement('span')
      precoDesconto.className = 'preco-desconto'
      precoDesconto.textContent = formataPreco(produto.preco)

      produtoPreco.appendChild(precoOriginal)
      produtoPreco.appendChild(precoDesconto)
    } else {
      produtoPreco.textContent = formataPreco(produto.preco)
    }

    produtoInfo.appendChild(produtoNome)
    produtoInfo.appendChild(produtoDescricao)
    produtoInfo.appendChild(produtoPreco)

    produtoCard.appendChild(produtoInfo)

    return produtoCard
  })

  produtosHTML.forEach(card => {
    produtosContainer.appendChild(card)
  })
}

function aplicarDesconto() {
  produtos.forEach(produto => {
    if (!produto.temDesconto) {
      produto.precoOriginal = produto.preco
      produto.preco = produto.preco * 0.9
      produto.temDesconto = true
    }
  })

  renderizarProdutos()
}

document.getElementById('aplicarDesconto').addEventListener('click', aplicarDesconto)
document.addEventListener('DOMContentLoaded', async () => {
  const { data, error } = await supabaseClient.from('produtos').select('*');

  if (error) {
    console.error('Erro ao carregar produtos:', error);
    document.getElementById('produtos').textContent = 'Erro ao carregar produtos.';
    return;
  }

  produtos = data;
  renderizarProdutos();
});
