
---

Bienvenue sur le projet Koudmain mobile ! Ce projet utilise une architecture **Monorepo** gérée par **pnpm** et **Turborepo**. Pour que tout fonctionne sans erreurs (Babel, Metro, NativeWind), il est impératif de suivre ces règles.

## ⚠️ Règle d'Or : INTERDICTION D'UTILISER `npm` ou `yarn`
Nous utilisons exclusivement **pnpm**.
- pnpm gère mieux l'espace disque.
- pnpm utilise un système de liens symboliques (symlinks) spécifique.
- Utiliser `npm install` va corrompre le fichier `pnpm-lock.yaml` et casser les résolutions de modules.

---

## 📦 1. Ajouter ou Modifier des Packages

### Ajouter une dépendance à une App spécifique (ex: Employer)

```bash
pnpm add <nom-du-package> --filter employer-apps
```

### Ajouter une dépendance commune à tout le projet (ex: lodash)
```bash
pnpm add <nom-du-package> -w
```

### Ajouter une dépendance au package UI
```bash
pnpm add <nom-du-package> --filter @koudmain/ui
```

### 💡 Cas particulier : React & NativeWind
Si vous ajoutez un package qui utilise React (ex: `react-native-reanimated`), assurez-vous de ne pas créer de doublons de React.
1. Vérifiez que la version correspond à celle définie dans le `pnpm.overrides` du `package.json` racine.
2. Si vous avez une erreur "Invalid Hook Call", c'est qu'une double instance de React a été créée.

---

## 🧩 2. Créer des Composants Communs (`koudmain-ui`)

Tous les composants réutilisables doivent aller dans `packages/koudmain-ui`.

### Étapes pour ajouter un composant :
1. Créez votre fichier dans `packages/koudmain-ui/src/components/MonComposant.tsx`.
2. **Exportez-le** impérativement dans `packages/koudmain-ui/src/index.ts` :
   ```typescript
   export * from "./components/MonComposant";
   ```
3. **Usage dans les Apps** : Les apps sont déjà liées via `workspace:*`. Importez simplement :
   ```typescript
   import { MonComposant } from "@koudmain/ui";
   ```

### 🎨 Thème & Couleurs
Les couleurs communes sont définies dans `packages/koudmain-ui/tailwind.config.js`.
- Si vous ajoutez une couleur, ajoutez-la là-bas.
- Elle sera automatiquement disponible dans les deux apps grâce à l'import dans leur `tailwind.config.js` respectif.

---

## 🎨 3. NativeWind v4 (Tailwind)

Nous utilisons **NativeWind v4** avec **Tailwind CSS v3.4.x**.
- N'utilisez **JAMAIS** `tailwindcss@4` car il n'est pas encore compatible.
- Chaque app possède son propre fichier `global.css`. Pour que vos styles s'appliquent, l'import `import "./global.css"` doit être présent dans le fichier d'entrée (`App.tsx` ou `_layout.tsx`).

---

## 🧹 4. En cas de bug bizarre (Le "Clean & Reset")

Si vous avez une erreur `Cannot find module`, un bug de style qui ne s'actualise pas ou un crash Metro inexpliqué, lancez la "séquence nucléaire" :

```bash
# 1. Nettoyer les caches et node_modules
pnpm clean

# 2. Réinstaller proprement
pnpm install

# 3. Relancer l'app en vidant le cache Metro
pnpm employer -- --clear
```

## 🚀 5. Commandes Utiles
- `pnpm install` : Installer toutes les dépendances.
- `pnpm employer` : Lancer l'app Employer.
- `pnpm worker` : Lancer l'app Worker.
- `pnpm build` : Build via Turbo.

---
