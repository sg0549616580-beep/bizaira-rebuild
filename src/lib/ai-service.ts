export async function generateImage(prompt: string, editImage?: string): Promise<string> {
  const response = await fetch("/api/generate-image", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, editImage }),
  });

  const data = await response.json();
  if (!response.ok || data?.error) throw new Error(data?.error || "Image generation failed");
  if (!data?.imageUrl) throw new Error("No image returned");

  return data.imageUrl;
}

export async function generateText(prompt: string, systemPrompt?: string): Promise<string> {
  const response = await fetch("/api/generate-text", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, systemPrompt }),
  });

  const data = await response.json();
  if (!response.ok || data?.error) throw new Error(data?.error || "Text generation failed");
  if (!data?.text) throw new Error("No text returned");

  return data.text;
}
