async function fetchStats() {
  try {
    const res = await fetch('/api/stats');
    const data = await res.json();

    document.getElementById('guilds').textContent = data.guilds;
    document.getElementById('users').textContent = data.users;
    
    const hours = Math.floor(data.uptime / 3600);
    const minutes = Math.floor((data.uptime % 3600) / 60);
    document.getElementById('uptime').textContent = `${hours}h ${minutes}min`;

  } catch (err) {
    console.error('Erro ao buscar estatísticas:', err);
  }
}

window.onload = fetchStats;
