# 🎁 Carte cadeau d'anniversaire à gratter

Une page web statique, sans serveur ni base de données, qui permet de révéler une image en grattant une zone avec la souris ou le doigt.

## Personnalisation

### 1. Remplacer l'image

Place ton image dans :

`assets/cadeau.jpg`

Tu peux simplement remplacer le fichier existant en conservant exactement ce nom.

### 2. Modifier le message

Dans `index.html`, cherche :

```html
<p id="rewardText">Profite bien de ton cadeau !</p>
```

et remplace le texte.

Tu peux aussi modifier le titre, le prénom ou les autres textes directement dans `index.html`.

## Hébergement gratuit avec GitHub Pages

1. Crée un nouveau dépôt sur GitHub, par exemple `carte-cadeau-anniversaire`.
2. Envoie tous les fichiers de ce dossier dans le dépôt.
3. Dans GitHub, ouvre **Settings → Pages**.
4. Dans **Build and deployment**, choisis **Deploy from a branch**.
5. Sélectionne la branche `main` et le dossier `/ (root)`.
6. Enregistre.

Après quelques instants, GitHub Pages te donnera une adresse publique du type :

`https://TON-PSEUDO.github.io/carte-cadeau-anniversaire/`

Aucune installation, aucun serveur et aucun abonnement ne sont nécessaires.

## Structure

```text
carte-cadeau-anniversaire/
├── index.html
├── style.css
├── script.js
├── README.md
└── assets/
    └── cadeau.jpg
```

## Notes

- Fonctionne sur ordinateur et mobile.
- Le grattage utilise un `<canvas>` HTML5.
- Tout fonctionne côté navigateur.
- La page peut être hébergée gratuitement sur GitHub Pages.
- La police est chargée depuis Google Fonts ; le reste du fonctionnement est autonome.
