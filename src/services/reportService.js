import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

// Get or generate a unique anonymous client ID
export function getClientId() {
  let id = localStorage.getItem("client_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("client_id", id);
  }
  return id;
}

export async function sendDiscordNotification(reportData) {
  const env = (typeof import.meta !== "undefined" && import.meta.env) ? import.meta.env : {};
  const webhookUrl = env.VITE_DISCORD_WEBHOOK_URL;

  if (!webhookUrl || !webhookUrl.startsWith("http")) {
    return false;
  }

  try {
    const embed = {
      title: "🚨 Nouveau Signalement Halakh'App",
      color: 0xF59E0B, // Couleur ambrée
      timestamp: new Date().toISOString(),
      fields: [
        {
          name: "📖 Emplacement",
          value: `**Livre :** ${reportData.bookTitle || "Général"}\n**Chapitre :** ${reportData.chapterTitle || "N/A"}\n**Seïf :** ${reportData.seifNumber ? `Seïf ${reportData.seifNumber}` : "Non spécifié"}${reportData.seifTitle ? ` (${reportData.seifTitle})` : ""}`,
          inline: false
        },
        {
          name: "💬 Message / Correction",
          value: reportData.userMessage || "*(aucun message)*",
          inline: false
        },
        {
          name: "📱 Client ID",
          value: `\`${reportData.clientId || "inconnu"}\``,
          inline: true
        },
        {
          name: "🏷️ Version",
          value: `v${reportData.appVersion || "2.0"}`,
          inline: true
        }
      ],
      footer: {
        text: "Halakh'App • Notification Instantanée",
        icon_url: "https://halakhapp.firebaseapp.com/favicon.ico"
      }
    };

    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "Halakh'App Bot",
        embeds: [embed]
      })
    });
    return true;
  } catch (err) {
    console.error("Erreur lors de l'envoi de la notification Discord:", err);
    return false;
  }
}

export async function sendReport({ 
  bookTitle, 
  chapterTitle, 
  seifNumber, 
  seifTitle, 
  paragraphIndex, 
  message 
}) {
  const reportData = {
    // Context
    bookTitle: bookTitle || "Unknown",
    chapterTitle: chapterTitle || "Unknown",
    seifNumber: seifNumber || null,
    seifTitle: seifTitle || "",
    paragraphIndex: paragraphIndex !== undefined ? paragraphIndex : null,
    
    // Content
    userMessage: message,
    
    // Technical Metadata
    createdAt: serverTimestamp(),
    status: "pending",
    clientId: getClientId(),
    appVersion: (typeof import.meta !== "undefined" && import.meta.env?.VITE_APP_VERSION) || "2.0",
  };

  try {
    // 1. Sauvegarde permanente dans Firestore
    const docRef = await addDoc(collection(db, "reports"), reportData);
    
    // 2. Notification instantanée sur Discord (en tâche de fond sans bloquer l'UI)
    sendDiscordNotification(reportData).catch(() => {});

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error adding report: ", error);
    // Tente quand même l'envoi Discord même si Firestore est inaccessible
    sendDiscordNotification(reportData).catch(() => {});
    throw error;
  }
}

