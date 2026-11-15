import { useState } from 'react'
import BuscaRota from './BuscaRota'
import Header from './Header'
import Caminho from './Caminho'

const App = () => {
  const [rota, setRota] = useState(null)
  const [origem, setOrigem] = useState("")
  const [destino, setDestino] = useState("")

  function resetar() {
    setRota(null)
    setOrigem("")
    setDestino("")
  }

  return (
    <main className="w-full h-dvh bg-mist-10 flex flex-col overflow-hidden">
      <div className="shrink-0">
        <Header />
      </div>

      <div className="shrink-0">
        <BuscaRota
          setRota={setRota}
          origem={origem}
          setOrigem={setOrigem}
          destino={destino}
          setDestino={setDestino}
        />
      </div>

      <Caminho rota={rota} resetar={resetar} />
    </main>
  )
}

export default App