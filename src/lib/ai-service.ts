import { supabase } from "@/integrations/supabase/client";

export async function generateImage(prompt: string, editImage?: string): Promise<string> {
  const { data, error } = await supabase.functions.invoke("generate-image", {
    body: { prompt, editImage },
  });

  if (error) throw new Error(error.message || "Image generation failed");
  if (data?.error) throw new Error(data.error);
  if (!data?.imageUrl) throw new Error("No image returned");

  return data.imageUrl;
}

export async function generateText(prompt: string, systemPrompt?: string): Promise<string> {
  const { data, error } = await supabase.functions.invoke("generate-text", {
    body: { prompt, systemPrompt },
  });

  if (error) throw new Error(error.message || "Text generation failed");
  if (data?.error) throw new Error(data.error);
  if (!data?.text) throw new Error("No text returned");

  return data.text;
}
