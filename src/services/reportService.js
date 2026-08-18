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
    appVersion: import.meta.env.VITE_APP_VERSION || "unknown",
  };

  try {
    const docRef = await addDoc(collection(db, "reports"), reportData);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error adding report: ", error);
    throw error;
  }
}
