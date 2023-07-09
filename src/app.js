import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { ChatGPTAPI } from "chatgpt";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();
const PORT = process.env.APP_PORT ? parseInt(process.env.APP_PORT, 10) : 3000;

let app = express();
app.use(express.json());
app.use(cors());

app.post("", async (req, res) => {
  let { message } = req.headers;
  if(message == null) return;
  // const openai = new ChatGPTAPI({
  //   apiKey: process.env.API_KEY,
  // });
  const configuration = new Configuration({
    organization: "org-xhDpKkrsdW3W2i6bFgSuzN2k",
    apiKey: process.env.API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  try {
    // const completion = await openai.createChatCompletion(message, {
    //   model: "gpt-3.5-turbo",
    //   messages: [{ role: "user" }],
    // });

    let completion = await fetch(process.env.GPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.API_KEY}`, // Use backticks for template literals
      },
      body: JSON.stringify({
        model: "text-davinci-003",
        max_tokens: 2048,
        temperature: 0.1,
        n: 1,
        stop: null,
        prompt: message,
      }),
    }).then((res) => res.json());
     
     

    console.log(completion);
    let response = '';
    
    if (completion.choices && completion.choices.length > 0) {
      response = completion.choices[0].text;
    } else {
      // Handle the case when `completion.choices` is undefined or empty
      response = 'No response available';
    }

    if (response.toLowerCase().includes("chatgpt")) {
      response = response
        .toLowerCase()
        .replace("chatgpt", "wider a i");
    }

    if (response.toLowerCase().includes("openai")) {
      response = response
        .toLowerCase()
        .replace("openai", "a hardworking team");
    }

    return res.status(200).json({
      question: message,
      reply: response,
      time: new Date().toLocaleTimeString(),
    });
  } catch (error) {
    console.log(error);
    return res
      .status(200)
      .json({ reply: "Something went wrong! Please try again!" });
  }
});

app.listen(PORT, console.log("listening..."));
