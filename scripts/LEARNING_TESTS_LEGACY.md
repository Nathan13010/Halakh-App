# Scripts Learning historiques

Les scripts `test*Kp*`, `test*Quiz*`, `test*Situation*`, `mastery*` et
`simulateSessions.js` de ce dossier sont des outils d'audit historiques. Leurs
attentes peuvent correspondre à une version antérieure du moteur et un `PASS`
isolé ne constitue pas une validation V1.

Les seules commandes de validation autoritatives du Learning Core V1 sont :

```bash
npm run test:learning
npm run test:learning:ui
npm run build
```

Toute évolution du moteur doit d'abord mettre à jour les tests sous
`tests/learning/` et `tests/learning-ui/`.
