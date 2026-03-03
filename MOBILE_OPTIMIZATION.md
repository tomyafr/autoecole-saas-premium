# Optimisation Mobile & PWA (AutoDrive Pro)

L'application a été transformée en une véritable **PWA (Progressive Web App)**, optimisée pour une utilisation sur smartphone comme une application native.

## 🚀 Fonctionnalités PWA
- **Manifeste Web** : Configuration du fichier `manifest.webmanifest` pour permettre l'installation sur l'écran d'accueil.
- **Icône Premium** : Génération d'une icône d'application 512x512 haute définition avec une esthétique Cyber-Premium (Cyan Neon sur fond sombre).
- **Mode Standalone** : L'application s'ouvre sans barre d'adresse navigateur pour une immersion totale.
- **Couleur de Thème** : Barre de statut mobile synchronisée avec le bleu AutoDrive (#00F5FF).

## 📱 Interface Mobile Optimisée
- **Bottom Navigation Bar** : Ajout d'une barre de navigation basse (Tab Bar) sur mobile pour un accès rapide au Dashboard, Planning et Réglages sans ouvrir le menu.
- **Menu Hamburger** : Masquage automatique de la sidebar latérale sur mobile, remplacée par un bouton menu fluide en haut à gauche.
- **Grilles Adaptatives** : Ajustement des paddings et des colonnes pour éviter tout défilement horizontal sur les petits écrans.
- **Safe Area Support** : Prise en compte des encoches (notches) sur iPhone et Android pour un affichage parfait.

## 🛠️ Modifications Techniques
- `src/app/layout.tsx` : Ajout des métadonnées `appleWebApp` et `themeColor`.
- `src/app/globals.css` : Media queries complexes pour la transition Sidebar <-> Bottom Nav.
- `src/app/dashboard/layout.tsx` : Logique de toggle du menu mobile et gestion de la barre de navigation basse.
- `public/manifest.webmanifest` : Définition des icônes et des couleurs système.
