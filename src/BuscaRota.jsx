import { useMemo, useState } from "react";
import linhas from "./linhas.json";
import { criarMetro, melhorRota, listarEstacoes } from "./metro.js";

export default function BuscaRota({
  setRota,
  origem,
  setOrigem,
  destino,
  setDestino
}) {

  const metro = useMemo(() => criarMetro(linhas), []);
  const estacoes = useMemo(() => listarEstacoes(metro), [metro]);

  function buscar() {
    if (!origem || !destino) return;

    try {
      const resultado = melhorRota(metro, origem, destino);

      if (!resultado) {
        setRota({
          erro: `Não há rota entre ${origem} e ${destino}.`
        });
        return;
      }

      setRota(resultado);

    } catch (erro) {
      setRota({ erro: erro.message });
    }
  }

  return (
    <section className="w-full shrink-0">
      <div className="p-5 flex flex-col items-center text-[30px] gap-8">

        <label className="border border-mauve-600 p-2 rounded-[6px] shadow-xl">
          Origem:
          <br />

          <select
            value={origem}
            onChange={(e) => setOrigem(e.target.value)}
          >
            <option value="">Selecione...</option>

            {estacoes.map((nome) => (
              <option key={nome} value={nome}>
                {nome}
              </option>
            ))}
          </select>
        </label>

        <label className="border border-mauve-600 p-2 rounded-[6px] shadow-xl">
          Destino:
          <br />

          <select
            value={destino}
            onChange={(e) => setDestino(e.target.value)}
          >
            <option value="">Selecione...</option>

            {estacoes.map((nome) => (
              <option key={nome} value={nome}>
                {nome}
              </option>
            ))}
          </select>
        </label>

        <button
          onClick={buscar}
          disabled={!origem || !destino}
          className="bg-cyan-800 p-3 rounded-[6px] text-mist-100 font-semibold shadow-2xl active:bg-cyan-900 active:translate-y-0.5 transition-all"
        >
          Buscar rota
        </button>

      </div>
            
    </section>
  );
}