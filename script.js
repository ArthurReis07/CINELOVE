const form = document.getElementById('form-filme');
const lista = document.getElementById('lista-filmes');
const busca = document.getElementById('busca');
const filtro = document.getElementById('filtro');
const contador = document.getElementById('contador');

let filmes = JSON.parse(localStorage.getItem('filmes')) || [];

function salvar() {
  localStorage.setItem('filmes', JSON.stringify(filmes));
}

function renderizarFilmes() {
  const termo = busca.value.toLowerCase();
  const tipo = filtro.value;
  let assistidos = 0;

  lista.innerHTML = '';
  filmes.forEach((filme, index) => {
    const matchBusca = filme.titulo.toLowerCase().includes(termo);
    const matchFiltro =
      tipo === 'todos' ||
      (tipo === 'assistidos' && filme.assistido) ||
      (tipo === 'nao-assistidos' && !filme.assistido) ||
      (tipo === 'favoritos' && filme.favorito);

    if (matchBusca && matchFiltro) {
      const li = document.createElement('li');
      if (filme.assistido) {
        li.classList.add('assistido');
        assistidos++;
      }

      li.innerHTML = `
        <div class="titulo">${filme.titulo} (${filme.genero}) ${filme.favorito ? '❤️' : ''}</div>
        <div>📅 ${filme.data || 'Sem data'} | ⭐ ${'★'.repeat(filme.nota)}<br/>💬 ${filme.comentario || ''}</div>
        <div class="botoes">
          <button onclick="toggleAssistido(${index})">✔️ Assistido</button>
          <button onclick="toggleFavorito(${index})">❤️ Favorito</button>
          <button onclick="removerFilme(${index})">❌ Remover</button>
        </div>
      `;
      lista.appendChild(li);
    }
  });

  contador.textContent = `🎯 Você assistiu ${assistidos} de ${filmes.length} filmes.`;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const titulo = document.getElementById('titulo').value.trim();
  const genero = document.getElementById('genero').value;
  const data = document.getElementById('data').value;
  const nota = parseInt(document.getElementById('nota').value);
  const comentario = document.getElementById('comentario').value.trim();

  if (titulo && genero) {
    filmes.push({
      titulo,
      genero,
      data,
      nota,
      comentario,
      assistido: false,
      favorito: false,
    });
    salvar();
    renderizarFilmes();
    form.reset();
  }
});

function toggleAssistido(index) {
  filmes[index].assistido = !filmes[index].assistido;
  salvar();
  renderizarFilmes();
}

function toggleFavorito(index) {
  filmes[index].favorito = !filmes[index].favorito;
  salvar();
  renderizarFilmes();
}

function removerFilme(index) {
  if (confirm("Deseja remover este filme?")) {
    filmes.splice(index, 1);
    salvar();
    renderizarFilmes();
  }
}

function exportarLista() {
  let texto = '📃 Lista de Filmes - CineLove\n\n';
  filmes.forEach(filme => {
    texto += `🎬 ${filme.titulo} (${filme.genero})\n`;
    texto += `⭐ ${'★'.repeat(filme.nota)}\n`;
    texto += `📅 ${filme.data || 'Sem data'}\n`;
    texto += `💬 ${filme.comentario || 'Sem comentário'}\n`;
    texto += `✔️ Assistido: ${filme.assistido ? 'Sim' : 'Não'} | ❤️ Favorito: ${filme.favorito ? 'Sim' : 'Não'}\n\n`;
  });

  const blob = new Blob([texto], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = 'lista-cinelove.txt';
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
}

busca.addEventListener('input', renderizarFilmes);
filtro.addEventListener('change', renderizarFilmes);
renderizarFilmes();

const botaoTema = document.getElementById('btn-tema');

botaoTema.addEventListener('click', () => {
  document.body.classList.toggle('estrelado');
  if (document.body.classList.contains('estrelado')) {
    botaoTema.textContent = '🌑 Modo Escuro';
  } else {
    botaoTema.textContent = '🌌 Modo Estrelado';
  }
});
