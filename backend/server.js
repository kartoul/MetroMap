
require("dotenv").config();

const mqtt = require("mqtt");
const WebSocket = require("ws");

const MQTT_BROKER =
  process.env.MQTT_BROKER || "mqtt://3.93.68.31:1883";

const MQTT_TOPIC =
  process.env.MQTT_TOPIC || "citizentech/metro/estacao";

const WS_PORT = Number(process.env.WS_PORT || 3001);

// =====================================
// 1. SERVIDOR WEBSOCKET
// =====================================

const servidorWS = new WebSocket.Server({
  port: WS_PORT,
});

console.log(`WebSocket iniciado na porta ${WS_PORT}`);

servidorWS.on("connection", (socket) => {
  console.log("Cliente React conectado!");

  socket.send(
    JSON.stringify({
      tipo: "status",
      mensagem: "Conectado ao backend CitizenTech",
    })
  );

  socket.on("close", () => {
    console.log("Cliente React desconectado.");
  });
});

// =====================================
// 2. CONEXÃO MQTT
// =====================================

const clienteMQTT = mqtt.connect(MQTT_BROKER, {
  clientId: `citizentech-backend-${Math.random()
    .toString(16)
    .slice(2, 10)}`,

  reconnectPeriod: 5000,
  connectTimeout: 10000,
  clean: true,
});

clienteMQTT.on("connect", () => {
  console.log("Conectado ao broker MQTT!");

  clienteMQTT.subscribe(MQTT_TOPIC, (erro) => {
    if (erro) {
      console.error("Erro ao assinar tópico:", erro);
      return;
    }

    console.log(`Inscrito no tópico: ${MQTT_TOPIC}`);
  });
});

clienteMQTT.on("reconnect", () => {
  console.log("Tentando reconectar ao MQTT...");
});

clienteMQTT.on("offline", () => {
  console.log("MQTT offline.");
});

clienteMQTT.on("error", (erro) => {
  console.error("Erro MQTT:", erro.message);
});

// =====================================
// 3. RECEBER E DISTRIBUIR OS DADOS
// =====================================

clienteMQTT.on("message", (topico, mensagem) => {
  if (topico !== MQTT_TOPIC) return;

  try {
    const dados = JSON.parse(mensagem.toString());

    if (
      typeof dados.estacao !== "string" ||
      typeof dados.pessoas !== "number"
    ) {
      console.log("Mensagem recebida com formato inválido.");
      return;
    }

    const dadosFormatados = {
      tipo: "dados_metro",
      estacao: dados.estacao,
      pessoas: dados.pessoas,
      entradas: Number(dados.entradas || 0),
      saidas: Number(dados.saidas || 0),
      som: dados.som || "desconhecido",
      origem: dados.origem || "ESP32",
      atualizadoEm: new Date().toISOString(),
    };

    console.log("Dados recebidos:", dadosFormatados);

    // Distribui para todos os clientes React conectados
    const mensagemWS = JSON.stringify(dadosFormatados);

    servidorWS.clients.forEach((cliente) => {
      if (cliente.readyState === WebSocket.OPEN) {
        cliente.send(mensagemWS);
      }
    });

  } catch (erro) {
    console.error("Erro ao interpretar mensagem:", erro.message);
  }
});

// =====================================
// 4. ENCERRAMENTO
// =====================================

process.on("SIGINT", () => {
  console.log("\nEncerrando servidores...");

  clienteMQTT.end();
  servidorWS.close(() => {
    process.exit(0);
  });
});
