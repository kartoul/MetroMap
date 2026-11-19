
import { useEffect, useState } from "react";

const ENDERECO_WS = "ws://localhost:3001";

export default function PainelIoT() {
  const [conexao, setConexao] = useState("Conectando...");
  const [dados, setDados] = useState(null);

  useEffect(() => {
    const socket = new WebSocket(ENDERECO_WS);

    socket.onopen = () => {
      setConexao("Conectado");
    };

    socket.onmessage = (evento) => {
      try {
        const recebido = JSON.parse(evento.data);

        if (recebido.tipo !== "dados_metro") return;

        setDados(recebido);
      } catch (erro) {
        console.error("Erro ao interpretar dados:", erro);
      }
    };

    socket.onerror = (erro) => {
      console.error("Erro WebSocket:", erro);
      setConexao("Erro de conexão");
    };

    socket.onclose = () => {
      setConexao("Desconectado");
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <section className="w-full rounded-xl bg-white p-5 shadow-lg">

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">
          Monitoramento do metrô
        </h2>

        <span
          className={`rounded-full px-3 py-1 text-sm font-semibold ${
            conexao === "Conectado"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {conexao}
        </span>
      </div>

      {!dados ? (
        <p className="text-gray-500">
          Aguardando dados do ESP32...
        </p>
      ) : (
        <>
          <div className="mb-4 rounded-lg bg-cyan-50 p-4">
            <p className="text-sm text-gray-500">
              Estação selecionada
            </p>

            <h3 className="text-2xl font-bold text-cyan-900">
              {dados.estacao}
            </h3>

            <p className="mt-2 text-sm text-gray-600">
              Passageiros na estação
            </p>

            <p className="text-4xl font-bold text-cyan-800">
              {dados.pessoas}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-green-50 p-4">
              <p className="text-sm text-gray-500">
                Entradas
              </p>

              <p className="text-2xl font-bold text-green-700">
                {dados.entradas}
              </p>
            </div>

            <div className="rounded-lg bg-red-50 p-4">
              <p className="text-sm text-gray-500">
                Saídas
              </p>

              <p className="text-2xl font-bold text-red-700">
                {dados.saidas}
              </p>
            </div>
          </div>

          <div className="mt-4 flex justify-between text-sm text-gray-500">
            <span>Som: {dados.som}</span>

            <span>
              {new Date(dados.atualizadoEm).toLocaleTimeString("pt-BR")}
            </span>
          </div>
        </>
      )}
    </section>
  );
}
