async function carregarEstatisticas() {
  try {
    const resposta = await fetch('/api/stats');
    const dados = await resposta.json();
    document.getElementById('servers').textContent = dados.servers;
    document.getElementById('users').textContent = dados.users;
    document.getElementById('uptime').textContent = dados.uptime;
  } catch (erro) {
    console.error('Erro ao buscar estatísticas:', erro);
  }
}

carregarEstatisticas();
setInterval(carregarEstatisticas, 5000);
