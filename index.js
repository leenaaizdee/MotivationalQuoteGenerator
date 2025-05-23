const express = require("express");
const axios = require("axios");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = 3000;

// Serve frontend
app.use(express.static(path.join(__dirname, "public")));

// call OpenAI
async function generateMotivationalQuote(theme) {
  const prompt = `Give a short, original motivational quote based on the feeling: "${theme}". Keep it inspiring and no longer than one sentence.`;

  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 60,
      temperature: 0.8,
    },
    {
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.choices[0].message.content.trim();
}

// API endpoint
app.get("/generate-quote", async (req, res) => {
  const theme = (req.query.theme || "").trim().toLowerCase();

  try {
    const quote = await generateMotivationalQuote(theme);
    res.json({ quote });
  } catch (error) {
    console.error("OpenAI error:", error.message);
    res.status(500).json({ quote: "Oops! The inspiration engine stalled. Try again later. 😅" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
