import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

function main() {
  const logFile = path.join(ROOT, 'logs', 'generation_history.jsonl');
  
  if (!fs.existsSync(logFile)) {
    console.log('📊 TABLEAU DE BORD DE GÉNÉRATION 📊\n');
    console.log('Aucune donnée de télémétrie trouvée.');
    console.log(`Le fichier ${logFile} n'existe pas encore.`);
    return;
  }

  const lines = fs.readFileSync(logFile, 'utf8').split('\n').filter(l => l.trim().length > 0);
  
  if (lines.length === 0) {
    console.log('📊 TABLEAU DE BORD DE GÉNÉRATION 📊\n');
    console.log('Historique vide.');
    return;
  }

  const dailyStats = {};

  lines.forEach(line => {
    try {
      const data = JSON.parse(line);
      if (data.status === 'success' && data.date) {
        if (!dailyStats[data.date]) {
          dailyStats[data.date] = {
            count: 0,
            totalDuration: 0,
            firstTimestamp: new Date(data.timestamp).getTime(),
            lastTimestamp: new Date(data.timestamp).getTime(),
          };
        }
        
        const stats = dailyStats[data.date];
        stats.count++;
        stats.totalDuration += data.duration || 0;
        
        const currentTs = new Date(data.timestamp).getTime();
        if (currentTs < stats.firstTimestamp) stats.firstTimestamp = currentTs;
        if (currentTs > stats.lastTimestamp) stats.lastTimestamp = currentTs;
      }
    } catch (e) {
      // Ignore invalid lines
    }
  });

  console.log('\n📊 TABLEAU DE BORD DE GÉNÉRATION 📊\n');

  const sortedDates = Object.keys(dailyStats).sort((a, b) => {
    // Sort descending by date
    const dateA = a.split('/').reverse().join('-');
    const dateB = b.split('/').reverse().join('-');
    return dateB.localeCompare(dateA);
  });

  sortedDates.forEach(date => {
    const stats = dailyStats[date];
    console.log(`📅 Date : ${date}`);
    console.log(`   ✅ Seifim générés : ${stats.count}`);
    
    // Calculate rate (Seifim per hour) based on active window
    const windowMs = stats.lastTimestamp - stats.firstTimestamp;
    let rateStr = 'N/A';
    
    if (windowMs > 0) {
      const windowHours = windowMs / (1000 * 60 * 60);
      if (windowHours > 0.05) { // At least 3 minutes of data
        const rate = (stats.count / windowHours).toFixed(1);
        rateStr = `~${rate} seifim / heure`;
      } else {
        rateStr = `Échantillon trop court`;
      }
    }
    
    console.log(`   🚀 Rythme mesuré : ${rateStr}`);
    
    // Total API active time
    const avgDuration = (stats.totalDuration / stats.count).toFixed(1);
    console.log(`   ⏱️ Temps API actif moy. : ${avgDuration}s / seif\n`);
  });
  
  console.log('──────────────────────────────────────────────────');
  const total = Object.values(dailyStats).reduce((acc, curr) => acc + curr.count, 0);
  console.log(`🏆 Total historique : ${total} seifim générés`);
  console.log('──────────────────────────────────────────────────\n');
}

main();
