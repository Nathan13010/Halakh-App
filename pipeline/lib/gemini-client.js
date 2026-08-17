/**
 * gemini-client.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Client Gemini partagé avec :
 * - Rotation automatique des clés API
 * - Backoff exponentiel sur 429/RESOURCE_EXHAUSTED
 * - Pause intelligente quand toutes les clés sont épuisées
 * - Logging détaillé
 *
 * Utilisé par : critic.js, repair.js, queue.js
 * ─────────────────────────────────────────────────────────────────────────────
 */

import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';

// ─── Configuration ────────────────────────────────────────────────────────────
const GEMINI_MODEL = 'gemini-3.7-flash';
const BASE_DELAY_MS = 4500;      // 4.5s entre requêtes (15 req/min)
const MAX_RETRIES = 5;
const INITIAL_RETRY_MS = 5000;   // 5s premier retry
const MAX_RETRY_MS = 120000;     // 2 minutes max retry
const QUOTA_PAUSE_MS = 65000;    // 65s quand quota épuisé (les quotas sont par minute)

// ─── État interne ─────────────────────────────────────────────────────────────
let apiKeys = [];
let currentKeyIndex = 0;
let aiClient = null;
let requestCount = 0;
let lastRequestTime = 0;

/**
 * Initialise le client avec les clés API depuis .env
 */
export function initGeminiClient() {
  apiKeys = [];
  
  // Charger toutes les clés GEMINI_API_KEY, GEMINI_API_KEY_2, etc.
  const envKeys = Object.keys(process.env)
    .filter(k => /^GEMINI_API_KEY(_\d+)?$/i.test(k))
    .sort();
  
  for (const key of envKeys) {
    const val = process.env[key];
    if (val && val.trim().length > 0) {
      apiKeys.push(val.trim());
    }
  }

  if (apiKeys.length === 0) {
    throw new Error('Aucune clé API Gemini trouvée dans .env (GEMINI_API_KEY, GEMINI_API_KEY_2, ...)');
  }

  currentKeyIndex = 0;
  aiClient = new GoogleGenAI({ apiKey: apiKeys[0] });
  requestCount = 0;

  console.log(`🔑 ${apiKeys.length} clé(s) API Gemini chargée(s)`);
  return aiClient;
}

/**
 * Bascule sur la prochaine clé API
 * @returns {boolean} true si une clé était disponible, false si on a fait le tour
 */
function switchKey() {
  const nextIndex = (currentKeyIndex + 1) % apiKeys.length;
  
  if (nextIndex === 0 && currentKeyIndex !== 0) {
    // On a fait le tour complet de toutes les clés
    console.log(`⚠️  Toutes les ${apiKeys.length} clés ont atteint leur quota.`);
    return false;
  }

  currentKeyIndex = nextIndex;
  aiClient = new GoogleGenAI({ apiKey: apiKeys[currentKeyIndex] });
  console.log(`🔄 Basculement sur clé API n°${currentKeyIndex + 1}/${apiKeys.length}`);
  return true;
}

/**
 * Pause utilitaire
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Effectue un appel Gemini avec gestion automatique des erreurs.
 * 
 * @param {Object} options
 * @param {string} options.prompt - Le prompt textuel
 * @param {Object} [options.config] - Configuration additionnelle (responseSchema, etc.)
 * @param {string} [options.model] - Modèle à utiliser (défaut: gemini-3.7-flash)
 * @param {boolean} [options.jsonMode] - Si true, attend une réponse JSON
 * @returns {Promise<string|Object>} La réponse (texte ou objet JSON parsé)
 */
export async function callGemini({ prompt, config = {}, model = GEMINI_MODEL, jsonMode = false }) {
  if (!aiClient) {
    initGeminiClient();
  }

  // Throttle : attendre le délai minimum entre requêtes
  const now = Date.now();
  const elapsed = now - lastRequestTime;
  if (elapsed < BASE_DELAY_MS) {
    await sleep(BASE_DELAY_MS - elapsed);
  }

  let retries = 0;
  let retryDelay = INITIAL_RETRY_MS;

  while (retries <= MAX_RETRIES) {
    try {
      lastRequestTime = Date.now();
      requestCount++;

      const finalConfig = { ...config };
      if (jsonMode) {
        finalConfig.responseMimeType = 'application/json';
      }

      const response = await aiClient.models.generateContent({
        model,
        contents: prompt,
        config: Object.keys(finalConfig).length > 0 ? finalConfig : undefined,
      });

      const text = response.text || '';

      if (jsonMode) {
        try {
          return JSON.parse(text);
        } catch (e) {
          // Essayer d'extraire le JSON des blocs de code
          const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
          if (jsonMatch) {
            return JSON.parse(jsonMatch[1]);
          }
          throw new Error(`Réponse non-JSON: ${text.slice(0, 200)}`);
        }
      }

      return text;

    } catch (error) {
      const errorMsg = error?.message || String(error);
      const isQuotaError = errorMsg.includes('429') || 
                           errorMsg.includes('RESOURCE_EXHAUSTED') ||
                           errorMsg.includes('quota');

      if (isQuotaError) {
        console.log(`⏳ Quota atteint sur clé n°${currentKeyIndex + 1}/${apiKeys.length}`);
        
        // Essayer de basculer sur une autre clé
        const switched = switchKey();
        if (!switched) {
          // Toutes les clés sont épuisées → pause longue
          console.log(`⏸️  Pause de ${QUOTA_PAUSE_MS / 1000}s (toutes les clés sont épuisées)...`);
          await sleep(QUOTA_PAUSE_MS);
          // Reset au début des clés
          currentKeyIndex = 0;
          aiClient = new GoogleGenAI({ apiKey: apiKeys[0] });
        }
        // Ne pas incrémenter retries pour les erreurs de quota
        continue;
      }

      // Autres erreurs : retry avec backoff exponentiel
      retries++;
      if (retries > MAX_RETRIES) {
        throw new Error(`Échec après ${MAX_RETRIES} tentatives: ${errorMsg}`);
      }

      console.log(`⚠️  Erreur (tentative ${retries}/${MAX_RETRIES}): ${errorMsg.slice(0, 100)}`);
      console.log(`   Retry dans ${retryDelay / 1000}s...`);
      await sleep(retryDelay);
      retryDelay = Math.min(retryDelay * 2, MAX_RETRY_MS);
    }
  }
}

/**
 * Retourne des statistiques sur l'utilisation du client
 */
export function getStats() {
  return {
    totalRequests: requestCount,
    currentKey: currentKeyIndex + 1,
    totalKeys: apiKeys.length,
  };
}
