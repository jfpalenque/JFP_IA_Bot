import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const AI_API_KEY = process.env.AI_API_KEY;

const TELEGRAM_URL = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;

// Webhook de Telegram
app.post("/webhook", async (req, res) => {
  const message = req.body.message;

  if (message && message.text) {
    const chatId = message.chat.id;
    const userText = message.text;

    // Llamada a la IA (GPT‑4o mini)
    const aiResponse = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: userText }]
      },
      {
        headers: {
          Authorization: `Bearer ${AI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const reply = aiResponse.data.choices[0].message.content;

    // Enviar respuesta a Telegram
    await axios.post(`${TELEGRAM_URL}/sendMessage`, {
      chat_id: chatId,
      text: reply
    });
  }

  res.sendStatus(200);
});

// Para que Telegram valide el webhook
app.get("/", (req, res) => {
  res.send("Bot de Telegram con IA funcionando");
});

app.listen(3000, () => console.log("Servidor iniciado"));
