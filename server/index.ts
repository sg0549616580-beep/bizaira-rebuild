import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.post("/api/generate-image", async (req, res) => {
  const { prompt, editImage } = req.body;
  const API_KEY = process.env.AI_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: "AI_API_KEY is not configured on the server" });
  }

  try {
    const content: any[] = [{ type: "text", text: prompt }];
    if (editImage) {
      content.push({ type: "image_url", image_url: { url: editImage } });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image",
        messages: [{ role: "user", content }],
        modalities: ["image", "text"],
      }),
    });

    if (!response.ok) {
      const status = response.status;
      const text = await response.text();
      console.error("AI gateway error:", status, text);
      if (status === 429) return res.status(429).json({ error: "Rate limit exceeded. Please try again in a moment." });
      if (status === 402) return res.status(402).json({ error: "AI credits exhausted. Please add funds." });
      return res.status(500).json({ error: `AI gateway error (${status})` });
    }

    const data = await response.json();
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageUrl) return res.status(500).json({ error: "No image was generated" });

    return res.json({ imageUrl });
  } catch (e: any) {
    console.error("generate-image error:", e);
    return res.status(500).json({ error: e?.message || "Unknown error" });
  }
});

app.post("/api/generate-text", async (req, res) => {
  const { prompt, systemPrompt } = req.body;
  const API_KEY = process.env.AI_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: "AI_API_KEY is not configured on the server" });
  }

  try {
    const messages: any[] = [];
    if (systemPrompt) messages.push({ role: "system", content: systemPrompt });
    messages.push({ role: "user", content: prompt });

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages,
      }),
    });

    if (!response.ok) {
      const status = response.status;
      const text = await response.text();
      console.error("AI gateway error:", status, text);
      if (status === 429) return res.status(429).json({ error: "Rate limit exceeded. Please try again in a moment." });
      if (status === 402) return res.status(402).json({ error: "AI credits exhausted. Please add funds." });
      return res.status(500).json({ error: `AI gateway error (${status})` });
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;

    if (!text) return res.status(500).json({ error: "No text was generated" });

    return res.json({ text });
  } catch (e: any) {
    console.error("generate-text error:", e);
    return res.status(500).json({ error: e?.message || "Unknown error" });
  }
});

const distPath = path.resolve(__dirname, "../dist");
app.use(express.static(distPath));
app.get("/{*path}", (_req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`[server] running on port ${PORT}`);
});
