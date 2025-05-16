document.addEventListener('DOMContentLoaded', () => {
  fetch('/api/status')
    .then(response => response.json())
    .then(data => {
      document.getElementById('servidores').textContent = data.servidores;
      document.getElementById('usuarios').textContent = data.membros;
      document.getElementById('uptime').textContent = data.uptime;
    })
    .catch(error => {
      console.error('Erro ao carregar status:', error);
    });
});
