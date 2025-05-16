async function carregarEstatisticas() {
  try {
    const res = await fetch('/api/estatisticas');
    const data = await res.json();

    document.getElementById('servidores').textContent = data.servidores;
    document.getElementById('usuarios').textContent = data.usuarios;
    document.getElementById('uptime').textContent = data.uptime;
  } catch (erro) {
    console.error('Erro ao carregar estatísticas:', erro);
  }
}

carregarEstatisticas();
setInterval(carregarEstatisticas, 60000); // atualiza a cada 60s
