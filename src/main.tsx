import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

console.log("[BizAIra] main.tsx loaded");

const rootEl = document.getElementById("root");
if (rootEl) {
  console.log("[BizAIra] Rendering app...");
  try {
    createRoot(rootEl).render(<App />);
    console.log("[BizAIra] App rendered successfully");
  } catch (err) {
    console.error("[BizAIra] Render error:", err);
    rootEl.innerHTML = '<div style="padding:40px;text-align:center;font-family:sans-serif"><h1>BizAIra</h1><p>Loading error - check console</p></div>';
  }
} else {
  console.error("[BizAIra] Root element not found");
}
