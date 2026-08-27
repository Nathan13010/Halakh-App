# Rapport de test du Moteur d'Apprentissage V2

✅ [A, B] needs_review lvl1 est 1er
✅ [A] needs_review lvl3 passe avant non_started lvl1
✅ [C] non_started lvl1 essential passe avant non_started lvl1 important
✅ [D] Une erreur remet le KP en needs_review
✅ [E] Une erreur remet streak à 0
✅ [F] last_failed_activity_id est enregistré
✅ [G] La même activity_id n'est jamais présentée deux fois dans la même session
✅ [G] last_failed_activity_id est évitée si d'autres activités sont dispo
✅ [H, I] Aucune activité non validée n'est sélectionnée
✅ [J] La traçabilité est toujours conservée (id, kp_id, source_seif)
✅ [K] Une Flashcard seule ne peut jamais donner mastered
✅ [L] Une seule réussite au QCM ne donne pas mastered
✅ [L] Deux réussites au QCM donnent mastered
✅ [M] Une situation pratique réussie donne un poids élevé (mastered)

**Résultat final : SUCCÈS**
