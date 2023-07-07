import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { ChatGPTAPI } from "chatgpt";

dotenv.config();
const PORT = process.env.APP_PORT ? parseInt(process.env.APP_PORT, 10) : 3000;

let app = express();
app.use(express.json());
app.use(cors());

app.post("", async (req, res) => {
  let { message } = req.headers;
  const openai = new ChatGPTAPI({
    apiKey: process.env.API_KEY,
  });

  try {
    const completion = await openai.sendMessage(message, {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user" }],
    });

    if (completion.text.toLowerCase().includes("chatgpt")) {
      completion.text = completion.text
        .toLowerCase()
        .replace("chatgpt", "wider a i");
    }

    if (completion.text.toLowerCase().includes("openai")) {
      completion.text = completion.text
        .toLowerCase()
        .replace("openai", "a hardworking team");
    }

    return res.status(200).json({
      question: message,
      reply: completion.text,
      time: new Date().toLocaleTimeString(),
    });
  } catch (error) {
    // console.log(error);
    return res
      .status(200)
      .json({ reply: "Something went wrong! Please try again!" });
  }
});

app.listen(PORT, console.log("listening..."));
