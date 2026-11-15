
import MapaDaRede from "./assets/mapa-da-rede.png";

const coresPorLinha = {
  "Azul (1)": "#005CA9",
  "Verde (2)": "#008061",
  "Vermelha (3)": "#EE1C25",
  "Amarela (4)": "#FFD400",
  "Lilás (5)": "#9B3894",
  "Laranja (6)": "#F58220",
  "Rubi (7)": "#A30A3B",
  "Diamante (8)": "#00AEEF",
  "Esmeralda (9)": "#00A859",
  "Turquesa (10)": "#007A4D",
  "Coral (11)": "#E85D2A",
  "Safira (12)": "#005CA9",
  "Jade (13)": "#00AEEF",
  "Prata (15)": "#A6A9AD",
  "Ouro (17)": "#D2A900",
};

function obterCor(linha) {
  return coresPorLinha[linha] || "#64748b";
}

function obterParadas(caminho) {
  if (!Array.isArray(caminho) || caminho.length === 0) {
    return [];
  }

  const paradas = [];
  const inicio = caminho[0];

  // Origem
  paradas.push({
    estacao: inicio.estacao,
    tipo: "origem",
    cores: [obterCor(inicio.linha)],
    corSaida: obterCor(inicio.linha),
    detalhe: `Embarque na linha ${inicio.linha}`,
  });

  // Baldeações
  for (let i = 1; i < caminho.length; i++) {
    const anterior = caminho[i - 1];
    const atual = caminho[i];

    if (
      anterior.estacao === atual.estacao &&
      anterior.linha !== atual.linha
    ) {
      paradas.push({
        estacao: atual.estacao,
        tipo: "baldeacao",
        cores: [
          obterCor(anterior.linha),
          obterCor(atual.linha),
        ],
        corSaida: obterCor(atual.linha),
        detalhe: `Troque de ${anterior.linha} para ${atual.linha}`,
      });
    }
  }

  // Destino
  const fim = caminho[caminho.length - 1];
  const ultima = paradas[paradas.length - 1];

  if (ultima.estacao === fim.estacao) {
    ultima.tipo = "destino";
    ultima.cores = [obterCor(fim.linha)];
    ultima.corSaida = null;
    ultima.detalhe = "Desembarque aqui";
  } else {
    paradas.push({
      estacao: fim.estacao,
      tipo: "destino",
      cores: [obterCor(fim.linha)],
      corSaida: null,
      detalhe: "Desembarque aqui",
    });
  }

  return paradas;
}

function estiloBola(cores) {
  if (cores.length === 1) {
    return { backgroundColor: cores[0] };
  }

  return {
    background: `linear-gradient(135deg, ${cores.join(", ")})`,
  };
}

export default function Caminho({ rota = null, resetar }) {

  // Mapa inicial
  if (!rota) {
    return (
      <div className="flex-1 min-h-0 w-full flex justify-center items-center px-4 pt-4 pb-8">
        <img
          src={MapaDaRede}
          alt="Mapa do Metrô de São Paulo"
          className="max-w-full max-h-full object-contain border-black border-2 rounded-2xl"
        />
      </div>
    );
  }

  // Erros
  if (rota.erro) {
    return (
      <div className="flex-1 min-h-0 flex items-center justify-center p-5">
        <p className="text-2xl text-red-600 font-semibold">
          {rota.erro}
        </p>
      </div>
    );
  }

  const paradas = obterParadas(rota.caminho);

  return (
    <section className="flex-1 min-h-0 w-full flex justify-center items-start overflow-hidden px-4 pt-4 pb-8">

      {/* BORDA EXTERNA */}
      <div className="w-[90%] max-w-3xl max-h-full box-border border-2 border-black rounded-xl shadow-xl p-8 overflow-y-auto overscroll-contain">

        <h2 className="text-3xl font-bold text-center mb-8">
          Seu percurso
        </h2>

        {/* ESTAÇÕES */}
        <div className="flex flex-col items-center">

          {paradas.map((parada, index) => (
            <div
              key={`${parada.estacao}-${index}`}
              className="flex flex-col items-center"
            >

              <span className="text-[24px] font-bold tracking-wider text-gray-500">
                {parada.tipo === "origem"
                  ? "PARTIDA"
                  : parada.tipo === "baldeacao"
                  ? "BALDEAÇÃO"
                  : "DESTINO"}
              </span>

              <p className="text-[36px] font-bold text-center text-gray-800">
                {parada.estacao}
              </p>

              {/* BOLA DA ESTAÇÃO */}
              <div
                className="w-14 h-14 rounded-full border-2 border-white shadow-md shrink-0 flex items-center justify-center"
                style={estiloBola(parada.cores)}
              >
                <div className="w-7 h-7 bg-white rounded-full" />
              </div>

              <p className="text-[24px] text-gray-500 text-center mt-2 mb-2">
                {parada.detalhe}
              </p>

              {/* CONEXÃO */}
              {index !== paradas.length - 1 && (
                <div
                  className="w-1 h-12"
                  style={{
                    backgroundColor: parada.corSaida,
                  }}
                />
              )}

            </div>
          ))}

        </div>

        {/* BOTÃO DENTRO DA BORDA */}
        <button
          onClick={resetar}
          className="mt-8 w-full bg-cyan-800 p-3 rounded-[6px] text-mist-100 font-semibold shadow-2xl active:bg-cyan-900 active:text-mist-200 active:translate-y-0.5 transition-all"
        >
          Voltar ao mapa
        </button>

      </div>
    </section>
  );
}
