# Audit de la Logique de Maîtrise

### CAS A
- **État initial :** status=non_started, streak=0
- *Action : flashcard réussie=true*
- *Action : multiple_choice réussie=true*
- *Action : practical_situation réussie=true*
- **Streak final :** 3
- **Activités maîtrisées :** [{"id":"qcm1","type":"multiple_choice"},{"id":"sit1","type":"practical_situation"}]
- **Statut final :** mastered
- **Condition de déclenchement :** (Vue depuis code) typesMastered=2, totalSuccessActive=2

### CAS B
- **État initial :** status=non_started, streak=0
- *Action : flashcard réussie=true*
- *Action : multiple_choice réussie=true*
- *Action : streak artificiellement remis à 0*
- *Action : practical_situation réussie=true*
- **Streak final :** 1
- **Activités maîtrisées :** [{"id":"qcm1","type":"multiple_choice"},{"id":"sit1","type":"practical_situation"}]
- **Statut final :** mastered
- **Condition de déclenchement :** (Vue depuis code) typesMastered=2, totalSuccessActive=2

### CAS C
- **État initial :** status=non_started, streak=0
- *Action : multiple_choice réussie=true*
- *Action : multiple_choice réussie=true*
- **Streak final :** 2
- **Activités maîtrisées :** [{"id":"qcm1","type":"multiple_choice"},{"id":"qcm2","type":"multiple_choice"}]
- **Statut final :** mastered
- **Condition de déclenchement :** (Vue depuis code) typesMastered=1, totalSuccessActive=2

### CAS D
- **État initial :** status=non_started, streak=0
- *Action : multiple_choice réussie=true*
- *Action : practical_situation réussie=true*
- **Streak final :** 2
- **Activités maîtrisées :** [{"id":"qcm1","type":"multiple_choice"},{"id":"sit1","type":"practical_situation"}]
- **Statut final :** mastered
- **Condition de déclenchement :** (Vue depuis code) typesMastered=2, totalSuccessActive=2

### CAS E
- **État initial :** status=non_started, streak=0
- *Action : flashcard réussie=true*
- *Action : flashcard réussie=true*
- *Action : flashcard réussie=true*
- **Streak final :** 3
- **Activités maîtrisées :** []
- **Statut final :** practicing
- **Condition de déclenchement :** (Vue depuis code) typesMastered=0, totalSuccessActive=0

## Conclusion
En inspectant le code `progressionTracker.js`, on observe :
```javascript
    const typesMastered = [...new Set(newMasteredActs.map(a => a.type))];
    const hasSituation = typesMastered.includes('practical_situation');
    const hasOtherThanFlashcard = availableActivityTypes.some(t => t !== 'flashcard' && t !== 'card');

    if (!hasOtherThanFlashcard) {
      newStatus = "practicing";
    } else if (typesMastered.length >= 2) {
      newStatus = "mastered";
    } else if (typesMastered.length === 1) {
      const totalSuccessOnActive = Object.values(newSuccessCounts).reduce((a, b) => a + b, 0);
      if (hasSituation) {
        newStatus = "mastered";
      } else if (totalSuccessOnActive >= 2) {
        newStatus = "mastered";
      } else {
        newStatus = "practicing";
      }
    } else {
      newStatus = "practicing";
    }

```

**STREAK_USED_FOR_MASTERY = NO**

La variable `streak` n'est absolument pas utilisée dans la détermination du statut `mastered`. La maîtrise dépend uniquement de la diversité des types d'activités maîtrisées (`typesMastered.length >= 2`), de la présence d'une situation pratique, ou d'au moins 2 réussites sur des activités actives (QCM/VF).