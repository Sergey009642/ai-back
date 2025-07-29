import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import  OpenAI  from "openai";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Ստեղծում ենք OpenAI client-ը
const openai = new OpenAI({
  apiKey: process.env.VITE_OPENAI_API_KEY,
});

// Test route
app.get("/", (req, res) => {
  res.send("AI Resume Backend is running 🚀");
});

// Main API route
app.post("/api/generate-resume", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Missing prompt in request body" });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const result = response.choices[0]?.message?.content;
    return res.json({ result });
  } catch (error) {
    console.error("OpenAI error:", error);
    // Ավելացնում ենք error details-ը front-end-ին (ամբողջությամբ stringify)
    let errorText = "";
    try {
      errorText = JSON.stringify(error, Object.getOwnPropertyNames(error));
    } catch {
      errorText = error?.message || error?.toString() || "Internal Server Error";
    }
    res.status(500).json({ error: errorText });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
