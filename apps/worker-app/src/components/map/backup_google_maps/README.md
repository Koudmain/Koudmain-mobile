# Sauvegarde de la Map initiale (react-native-maps / Google & Apple Maps)

Ce dossier contient une sauvegarde complète de votre implémentation précédente de la carte basée sur `react-native-maps`.

### Fichiers sauvegardés :

- `Map.tsx.backup` : Le composant d'origine de l'onglet Carte (`src/app/(tabs)/Map.tsx`).
- `styleMap.ts.backup` : Les thèmes JSON personnalisés pour Google Maps (`src/constants/styleMap.ts`).

### Comment restaurer cette version :

1. Copiez `Map.tsx.backup` vers `src/app/(tabs)/Map.tsx` :
   ```bash
   cp apps/worker-app/src/components/map/backup_google_maps/Map.tsx.backup apps/worker-app/src/app/\(tabs\)/Map.tsx
   ```
2. Ajoutez votre clé Google Maps dans `apps/worker-app/.env` :
   ```env
   GOOGLE_MAP_API_KEY=AIzaSy...
   ```
3. Relancez Expo Go.
