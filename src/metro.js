// metro.js — tradução do metro.py para JavaScript (sem bibliotecas externas)

const DIST_BALDEACAO = 3; // peso em km para cada baldeação

// Cada "nó" do grafo é uma estação em uma linha específica: "Sé|Azul (1)"
const chave = (estacao, linha) => `${estacao}|${linha}`;

// ---------------------------------------------------------------
// 1) Monta o grafo (equivalente ao nx.Graph() + add_edge)
// ---------------------------------------------------------------
export function criarMetro(linhas, distBaldeacao = DIST_BALDEACAO) {
  const grafo = new Map(); // chave -> [{ vizinho, peso }]
  const nos = new Map(); // chave -> { estacao, linha }
  const nosDaEstacao = new Map(); // estacao -> Set de chaves

  const addNo = (estacao, linha) => {
    const k = chave(estacao, linha);
    if (!grafo.has(k)) {
      grafo.set(k, []);
      nos.set(k, { estacao, linha });
    }
    if (!nosDaEstacao.has(estacao)) nosDaEstacao.set(estacao, new Set());
    nosDaEstacao.get(estacao).add(k);
    return k;
  };

  const addAresta = (a, b, peso) => {
    grafo.get(a).push({ vizinho: b, peso });
    grafo.get(b).push({ vizinho: a, peso });
  };

  // trechos de cada linha
  for (const [linha, trechos] of Object.entries(linhas)) {
    for (const [a, b, km] of trechos) {
      addAresta(addNo(a, linha), addNo(b, linha), km);
    }
  }

  // baldeação: liga todos os nós da mesma estação entre si
  for (const ks of nosDaEstacao.values()) {
    const lista = [...ks];
    for (let i = 0; i < lista.length; i++) {
      for (let j = i + 1; j < lista.length; j++) {
        addAresta(lista[i], lista[j], distBaldeacao);
      }
    }
  }

  return { grafo, nos, nosDaEstacao };
}

// ---------------------------------------------------------------
// 2) Dijkstra
//    Parte de TODOS os nós da origem ao mesmo tempo e para no primeiro
//    nó do destino. Dá o mesmo resultado do loop duplo do Python
//    (que testava cada par origem/destino), só que mais rápido.
// ---------------------------------------------------------------
function dijkstra(grafo, origens, ehDestino) {
  const dist = new Map();
  const anterior = new Map();
  const visitados = new Set();

  for (const k of grafo.keys()) dist.set(k, Infinity);
  for (const k of origens) dist.set(k, 0);

  while (true) {
    // pega o nó ainda não visitado com a menor distância
    let atual = null;
    for (const [k, d] of dist) {
      if (visitados.has(k) || d === Infinity) continue;
      if (atual === null || d < dist.get(atual)) atual = k;
    }
    if (atual === null) return null; // sem rota

    if (ehDestino(atual)) {
      const caminho = [atual];
      while (anterior.has(caminho[0])) caminho.unshift(anterior.get(caminho[0]));
      return { km: dist.get(atual), caminho };
    }

    visitados.add(atual);
    for (const { vizinho, peso } of grafo.get(atual)) {
      const nova = dist.get(atual) + peso;
      if (nova < dist.get(vizinho)) {
        dist.set(vizinho, nova);
        anterior.set(vizinho, atual);
      }
    }
  }
}

export function melhorRota(metro, origem, destino) {
  const { grafo, nos, nosDaEstacao } = metro;
  if (!nosDaEstacao.has(origem)) throw new Error(`Estação não encontrada: ${origem}`);
  if (!nosDaEstacao.has(destino)) throw new Error(`Estação não encontrada: ${destino}`);

  const resultado = dijkstra(
    grafo,
    nosDaEstacao.get(origem),
    (k) => nos.get(k).estacao === destino
  );
  if (!resultado) return null;

  return {
    km: resultado.km,
    caminho: resultado.caminho.map((k) => nos.get(k)), // [{ estacao, linha }, ...]
  };
}

// ---------------------------------------------------------------
// 3) Sentido da linha
// ---------------------------------------------------------------
function vizinhosNaLinha(metro, estacao, linha) {
  const { grafo, nos } = metro;
  return grafo
    .get(chave(estacao, linha))
    .map(({ vizinho }) => nos.get(vizinho))
    .filter((no) => no.linha === linha) // ignora as arestas de baldeação
    .map((no) => no.estacao);
}

// Pontas da linha seguindo na mesma direção (mais de uma se houver ramal)
function sentido(metro, anterior, atual, linha) {
  const pontas = [];
  const pilha = [[anterior, atual]];
  while (pilha.length > 0) {
    const [ant, cur] = pilha.pop();
    const proximos = vizinhosNaLinha(metro, cur, linha).filter((v) => v !== ant);
    if (proximos.length === 0) pontas.push(cur);
    for (const v of proximos) pilha.push([cur, v]);
  }
  return pontas;
}

// ---------------------------------------------------------------
// 4) Instruções em texto
//    Retorna um array de linhas (em vez de dar print) para você poder
//    usar no console, numa página HTML ou num componente React.
// ---------------------------------------------------------------
export function exibirCaminho(metro, origem, destino) {
  const rota = melhorRota(metro, origem, destino);
  if (!rota) return [`Não há rota entre ${origem} e ${destino}.`];

  const { caminho } = rota;
  if (caminho.length === 1) return [`Você já está em ${origem}.`];

  // agrupa o caminho em trechos de uma mesma linha
  const trechos = [];
  for (const { estacao, linha } of caminho) {
    const ultimo = trechos.at(-1);
    if (ultimo && ultimo.linha === linha) ultimo.estacoes.push(estacao);
    else trechos.push({ linha, estacoes: [estacao] });
  }

  const saida = [`De ${origem} até ${destino}`, ""];

  trechos.forEach((t, idx) => {
    const i = idx + 1;
    const est = t.estacoes;
    const direcao = sentido(metro, est.at(-2), est.at(-1), t.linha).join(" / ");
    const paradas = est.length - 1;

    if (i === 1) {
      saida.push(`${i}. Embarque em ${est[0]}, linha ${t.linha}, sentido ${direcao}.`);
    } else {
      saida.push(`${i}. Baldeie em ${est[0]} para a linha ${t.linha}, sentido ${direcao}.`);
    }

    if (i === trechos.length) {
      saida.push(`   Desça em ${est.at(-1)} (${paradas} estações). Você chegou!`);
    } else {
      saida.push(`   (${paradas} estações).`);
    }
  });

  return saida;
}

// Lista de todas as estações (útil para o select/dropdown do menu)
export function listarEstacoes(metro) {
  return [...metro.nosDaEstacao.keys()].sort((a, b) => a.localeCompare(b, "pt-BR"));
}
