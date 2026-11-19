# 🚇 MetroMap — Navegação Inteligente pelo Metrô de São Paulo

O **MetroMap** é um projeto desenvolvido com o objetivo de facilitar a navegação de passageiros pela rede metroferroviária de São Paulo. Através de uma interface intuitiva e de um mapa interativo, o usuário pode selecionar estações de origem e destino, visualizar o melhor trajeto disponível e compreender as conexões necessárias durante o percurso.

O projeto busca tornar a experiência de utilização do transporte público mais acessível, visual e intuitiva, especialmente para passageiros que não estão familiarizados com toda a extensão da rede.

---

## 🎯 Objetivo do Projeto

A rede metroferroviária de São Paulo possui diversas linhas, estações e pontos de integração. Para alguns passageiros, identificar o melhor caminho entre duas estações pode ser uma tarefa confusa.

O MetroMap propõe uma solução digital que simplifica esse processo, permitindo que o passageiro encontre seu trajeto de maneira rápida e visualize o percurso diretamente no mapa.

## ✨ Funcionalidades

- **Mapa interativo:** visualização da rede metroferroviária de São Paulo.
- **Busca de estações:** seleção de uma estação de origem e outra de destino.
- **Cálculo de rotas:** identificação de um caminho otimizado entre as estações selecionadas.
- **Visualização do percurso:** destaque visual das linhas e estações que fazem parte da rota.
- **Informações de baldeação:** identificação dos pontos em que o passageiro precisa trocar de linha.
- **Orientação de sentido:** indicação do sentido do trajeto através dos terminais correspondentes.
- **Interface para totens digitais:** layout desenvolvido considerando a utilização em displays verticais e telas de atendimento público.

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Utilização |
|---|---|
| React | Desenvolvimento da interface e dos componentes. |
| JavaScript | Lógica de funcionamento e cálculo das rotas. |
| Vite | Ambiente de desenvolvimento e build. |
| Tailwind CSS | Estilização e responsividade da interface. |
| JSON | Organização dos dados das linhas e estações. |
| Python / NetworkX | Referência utilizada durante o desenvolvimento e modelagem inicial da lógica de grafos. |

## 🧠 Como funciona o cálculo de rotas?

O sistema utiliza uma estrutura de **grafos** para representar a rede metroferroviária.

Cada estação, considerando sua respectiva linha, é representada como um nó do grafo. As conexões entre estações são representadas por arestas, que possuem pesos utilizados para determinar o custo de cada percurso.

Para encontrar uma rota, o sistema utiliza o algoritmo de **Dijkstra**, permitindo identificar um caminho de menor custo entre a origem e o destino.

O cálculo também considera as baldeações, atribuindo um peso adicional às trocas de linha. Dessa maneira, o algoritmo não considera apenas a distância entre as estações, mas também o custo associado às integrações.

A lógica foi implementada em JavaScript, no arquivo `metro.js`, sem depender de bibliotecas externas para o cálculo principal.

## 🤖 Utilização de Inteligência Artificial

Durante o desenvolvimento do MetroMap, utilizamos o **ChatGPT como ferramenta de apoio técnico e desenvolvimento**.

A inteligência artificial auxiliou em diferentes etapas do projeto, funcionando como uma ferramenta de consulta, aprendizado e resolução de problemas.

Entre as principais aplicações da IA estão:

- **Desenvolvimento de código:** auxílio na implementação de funções JavaScript, componentes React e estruturas de dados.
- **Algoritmos e lógica:** apoio na compreensão e implementação de grafos, algoritmo de Dijkstra e cálculo de rotas.
- **Depuração (Debugging):** identificação de possíveis erros, análise de comportamentos inesperados e sugestões de correções.
- **Integração:** auxílio na comunicação entre os componentes React, os dados das estações e a lógica de cálculo de rotas.
- **Interface e experiência do usuário:** sugestões de melhorias no layout, responsividade e organização dos elementos visuais.
- **Otimização:** revisão de trechos de código e sugestões para melhorar a organização e manutenção do projeto.

### Como utilizamos a IA?

A utilização da IA aconteceu de maneira colaborativa e iterativa. Em vez de simplesmente solicitar um projeto completo, apresentamos problemas específicos, compartilhamos trechos do código, analisamos as soluções sugeridas e realizamos testes para verificar seu funcionamento.

As sugestões foram utilizadas como referência para o desenvolvimento, sendo necessário compreender, adaptar e validar as implementações dentro do projeto.

**A IA atuou como uma ferramenta de suporte, enquanto as decisões de desenvolvimento, integração, testes e validação do sistema fizeram parte do trabalho da equipe.**

## 🖥️ Executando o Projeto

### Pré-requisitos

- Node.js instalado.
- npm instalado.
- Git instalado.

### Instalação

1. Clone o repositório:

```bash
git clone https://github.com/SEU-USUARIO/MetroMap.git
```

2. Entre na pasta do projeto:

```bash
cd MetroMap
```

3. Instale as dependências:

```bash
npm install
```

4. Execute o ambiente de desenvolvimento:

```bash
npm run dev
```

5. Acesse o endereço disponibilizado pelo Vite no terminal.

## 📁 Estrutura do Projeto

```text
MetroMap/
├── public/
│   └── assets/
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── BuscaRota.jsx
│   │   └── Caminho.jsx
│   ├── metro.js
│   ├── linhas.json
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
└── README.md
```

*A estrutura acima é ilustrativa e pode ser ajustada conforme a organização atual do repositório.*

## 🚀 Possíveis Melhorias Futuras

- Integração com dados de operação em tempo real.
- Estimativa de lotação dos trens.
- Previsão de tempo de deslocamento.
- Informações sobre interrupções e alterações na operação.
- Expansão para outras modalidades de transporte público.

## 👥 Desenvolvimento

Projeto acadêmico desenvolvido como uma proposta de melhoria na experiência de utilização do transporte público, utilizando tecnologia para tornar a mobilidade urbana mais acessível e intuitiva.

---

**MetroMap — Simplificando caminhos, conectando pessoas.**
