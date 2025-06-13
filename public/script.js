async function carregarEstatisticas() {
  try {
    const resposta = await fetch('/api/stats');
    const dados = await resposta.json();
    document.getElementById('servers').textContent = dados.servers;
    document.getElementById('users').textContent = dados.users;
    document.getElementById('uptime').textContent = dados.uptime;
  } catch (erro) {
    document.getElementById('servers').textContent = 'Erro';
    document.getElementById('users').textContent = 'Erro';
    document.getElementById('uptime').textContent = 'Erro';
    console.error('Erro ao buscar estatísticas:', erro);
  }
}

async function carregarHistorico() {
  const guildId = document.getElementById('guildId').value.trim();
  const historicoEl = document.getElementById('historico');
  historicoEl.innerHTML = '<li>Carregando...</li>';
  if (!guildId) {
    historicoEl.innerHTML = '<li>Digite o ID do servidor.</li>';
    return;
  }
  try {
    const resposta = await fetch(`/api/guild/${guildId}/historico`);
    const historico = await resposta.json();
    if (!historico.length) {
      historicoEl.innerHTML = '<li>Nenhum registro encontrado.</li>';
      return;
    }
    historicoEl.innerHTML = historico.map(item =>
      `<li>
        <strong>${item.usuario}</strong> rolou <em>${item.comando}</em>:<br>
        ${item.emojis ? item.emojis.map(e => `${e}`).join('<br>') : ''}<br>
        <small>${item.resultadoExtenso ? item.resultadoExtenso.join('<br>') : ''}</small>
        <br><small>(${new Date(item.data).toLocaleString()})</small>
      </li>`
    ).join('');
  } catch (erro) {
    historicoEl.innerHTML = '<li>Erro ao buscar histórico.</li>';
    console.error('Erro ao buscar histórico:', erro);
  }
}

carregarEstatisticas();
setInterval(carregarEstatisticas, 5000);
