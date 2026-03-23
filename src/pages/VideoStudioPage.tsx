import AIWizard, { WizardConfig } from "@/components/AIWizard";
import { useI18n } from "@/lib/i18n";
import { Video } from "lucide-react";
import { generateImage, generateText } from "@/lib/ai-service";

const VideoStudioPage = () => {
  const { t, lang } = useI18n();

  const config: WizardConfig = {
    title: t("video.title"),
    subtitle: t("video.subtitle"),
    icon: <Video size={28} className="text-muted-foreground" />,
    generateLabel: lang === "he" ? "צור סרטון" : "Create Video",
    generatingLabel: lang === "he" ? "מייצר סרטון..." : "Creating video...",
    resultTitle: lang === "he" ? "הסרטון מוכן!" : "Video is ready!",
    resultType: "gallery",
    downloadLabel: lang === "he" ? "הורד תמונות סצנות" : "Download Scene Images",
    downloadFormat: "png",
    questions: [
      {
        id: "duration",
        question: lang === "he" ? "מה אורך הסרטון הרצוי?" : "What video length do you want?",
        type: "select",
        options: [
          { id: "15", label: lang === "he" ? "15 שניות" : "15 seconds", desc: lang === "he" ? "סטורי / רילס" : "Story / Reels" },
          { id: "30", label: lang === "he" ? "30 שניות" : "30 seconds", desc: lang === "he" ? "סרטון קצר" : "Short video" },
          { id: "45", label: lang === "he" ? "45 שניות" : "45 seconds", desc: lang === "he" ? "סרטון בינוני" : "Medium video" },
          { id: "60", label: lang === "he" ? "דקה" : "1 minute", desc: lang === "he" ? "סרטון מלא" : "Full video" },
        ],
      },
      {
        id: "style",
        question: lang === "he" ? "איזה סגנון סרטון?" : "What video style?",
        type: "select",
        options: [
          { id: "promo", label: lang === "he" ? "פרסומת" : "Promo" },
          { id: "tutorial", label: lang === "he" ? "הדרכה" : "Tutorial" },
          { id: "music", label: lang === "he" ? "מוזיקלי" : "Music" },
          { id: "story", label: lang === "he" ? "סיפור" : "Storytelling" },
        ],
      },
      {
        id: "businessName",
        question: lang === "he" ? "מה שם העסק שלך?" : "What's your business name?",
        type: "text",
        placeholder: lang === "he" ? "לדוגמה: סטודיו לאנה" : "Example: Studio Lana",
      },
      {
        id: "content",
        question: lang === "he" ? "טקסט או קריינות שתרצה לכלול?" : "Any text or voiceover to include?",
        type: "textarea",
        placeholder: lang === "he" ? "תאר את התוכן שתרצה בסרטון, או תן ל-AI לנסח..." : "Describe the content you want, or let AI write it...",
      },
      {
        id: "images",
        question: lang === "he" ? "רוצה להעלות תמונות לסרטון?" : "Want to upload images for the video?",
        type: "upload",
        maxUploads: 4,
      },
    ],
  };

  const handleGenerate = async (answers: Record<string, any>): Promise<string[]> => {
    const styleMap: Record<string, string> = { promo: "promotional advertisement", tutorial: "educational tutorial", music: "music video style", story: "storytelling narrative" };
    const style = styleMap[answers.style] || "promotional";
    const businessName = answers.businessName || "Business";
    const content = answers.content || "";
    const duration = answers.duration || "30";

    // Generate scene images for the video storyboard
    const numScenes = duration === "15" ? 3 : duration === "30" ? 4 : duration === "45" ? 5 : 6;

    // First generate a script
    const scriptPrompt = lang === "he"
      ? `צור תסריט קצר ל-${numScenes} סצנות של סרטון ${style} עבור "${businessName}". ${content ? `תוכן: ${content}` : ""} כתוב כותרת קצרה לכל סצנה.`
      : `Create a short script for ${numScenes} scenes of a ${style} video for "${businessName}". ${content ? `Content: ${content}` : ""} Write a short title for each scene.`;

    // Generate scene images in parallel
    const scenePromises = [];
    for (let i = 0; i < Math.min(numScenes, 4); i++) {
      const sceneDescriptions = [
        `Opening scene: Professional ${style} video frame for "${businessName}". Modern, clean, vertical 9:16 format. Stylish typography with business name. Dark elegant background with subtle glow effects.`,
        `Middle scene: ${style} video frame showing the service/product of "${businessName}". ${content || "Professional and premium look"}. Vertical 9:16 format, cinematic lighting.`,
        `Highlight scene: Key benefit showcase for "${businessName}". ${style} style. Professional visual with elegant text overlay. Vertical format.`,
        `Closing scene: Call to action frame for "${businessName}". Contact information layout. ${style} style. Professional ending with logo placement. Vertical 9:16 format.`,
      ];
      scenePromises.push(generateImage(sceneDescriptions[i] || sceneDescriptions[0]));
    }

    const results = await Promise.allSettled(scenePromises);
    const images = results
      .filter((r): r is PromiseFulfilledResult<string> => r.status === "fulfilled")
      .map(r => r.value);

    if (images.length === 0) throw new Error("Failed to generate video scenes");
    return images;
  };

  return <AIWizard config={config} onGenerate={handleGenerate} mockDelay={3000} />;
};

export default VideoStudioPage;
