import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

// Variables de entorno
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
//const AI_API_KEY = process.env.AI_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;


const TELEGRAM_URL = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;

// Webhook de Telegram
app.post("/webhook", async (req, res) => {
  try {
    const message = req.body.message;

    if (message && message.text) {
      const chatId = message.chat.id;
      const messageText = message.text;
	  console.log(`Mensaje ${messageText}`);

      //// Llamada a la IA (GPT‑4o mini)
      //const aiResponse = await axios.post(
      //  "https://api.openai.com/v1/chat/completions",
      //  {
      //    model: "gpt-4o-mini",
      //    messages: [{ role: "user", content: userText }]
      //  },
      //  {
      //    headers: {
      //      Authorization: `Bearer ${AI_API_KEY}`,
      //      "Content-Type": "application/json"
      //    }
      //  }
      //);

      //const reply = aiResponse.data.choices[0].message.content;
	  
	  
	const response = await axios.post(
	  "https://api.groq.com/openai/v1/chat/completions",
	  {
		model: "llama-3.3-70b-versatile",	
		messages: [{ role: "user", content: messageText }]
	  },
	  {
		headers: {
		  "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
		  "Content-Type": "application/json"
		}
	  }
	);
 


const aiMessage = response.data.choices[0].message.content;
 
	  /*
	  //GOOGLE
	  //const urlGemini = "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=" + GEMINI_API_KEY;
	  const urlGemini = "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-lite:generateContent?key=" + GEMINI_API_KEY;
	  
	  const response = await axios.post(
		  urlGemini,
		  {
			contents: [
			  {
				parts: [
				  { text: messageText }
				]
			  }
			]
		  }
		);

	const aiMessage = response.data.candidates[0].content.parts[0].text;
*/


      // Enviar respuesta a Telegram
      await axios.post(`${TELEGRAM_URL}/sendMessage`, {
        chat_id: chatId,
        text: aiMessage
      });
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Error procesando mensaje:", error.response?.data || error);
    //res.sendStatus(500);
	
	res.sendStatus(200);
  }
});

// Ruta básica para comprobar que el servidor está vivo
app.get("/", (req, res) => {
  res.send("Bot de Telegram con IA funcionando correctamente.");
});

// Puerto dinámico para Railway
//const PORT = process.env.PORT || 3000;
const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor iniciado en puerto ${PORT}`));
