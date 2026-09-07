---
tags: [persua-site, hero, webgl, technique, apprentissages]
maj: 2026-08-08
statut: DÉPLOYÉ en prod (commit 63260fc)
---

# Hero site Persua — « radio → dedans le cerveau »

Doc de référence du hero de la page d'accueil **persua-neurovente.com**. À relire avant toute reprise du hero, pour ne pas refaire les erreurs de la session du 08/08/2026.

## Ce que fait le hero (au scroll)

1. **Repos** : photo humaine de Steven. Au **survol** → photo N&B + line scan bleue qui balaie (teaser).
2. **Zoom + pan** dans la tête (pas de glissement gauche) + line scan bleue sur la silhouette + **flou de mouvement léger**.
3. À **~80 % du zoom** : fondu tardif rapide → on ne voit plus que le **crâne** (N&B, cerveau bleu qui ressort), qui passe à **70 % d'opacité** à 90 % du zoom (on voit à travers).
4. **Plongée DANS le cerveau** (nuage de 55 000 points) : caméra fixe, le nuage grossit autour → on est dedans. Rotation **un seul sens** (jamais de retour arrière). Les **5 zones CALME** s'activent (C→A→L→M→E), chaque label posé **sur son point de localisation** (clampé pour rester à l'écran sur mobile).
5. Une fois **CALME passé** : on ressort, cerveau entier vaporeux en **fond du contenu**, rotation douce, points lisibles sous le texte.

## Fichiers (repo local ~/Desktop/persua-site, GitHub Pages)

- `index.html` = la page **live** (push sur `main` = déploiement).
- `accueil-A.html` = source de travail (éditer ici puis `cp accueil-A.html index.html`).
- `accueil-A-HERO-FINAL.html` = **backup gelé** de la version validée.
- Asset affiché : `assets/brand/steven_skull_bw_brain.webp` (crâne N&B + cerveau bleu, aligné sur la tête humaine).
- Nuage cerveau : `assets/models/brain-points.bin` (55 000 pts cortex, Int16 /32767, z*-1).
- Photo humaine : `assets/brand/steven_cutout.webp`.

## Régénérer les assets crâne (Pillow, depuis la source Gemini)

Source : `~/Downloads/Gemini_Generated_Image_3eqj6j3eqj6j3eqj.png` (crâne+cerveau, fond blanc).

1. **Détourage** : floodfill du blanc depuis TOUT le pourtour (seuil ~52, pas juste les coins), garder les blancs intérieurs (dents/cadran) ; **éroder** `MinFilter(5)` puis `MinFilter(3)` (mange le liseré blanc) ; **flou de bord** `GaussianBlur(2.4)`. → `steven_skull.webp`.
2. **Aligner** sur la tête humaine (canvas 893×1400 = celui de `steven_cutout`) : `scale = 388/602 = 0.6445`, `ox = -51`, `oy` réglé pour que la **calotte** soit entièrement visible (top opaque à y≈8, sinon le sommet est coupé). → `steven_skull_aligned.webp`.
3. **N&B sauf cerveau bleu** : masque bleu = `b>g+8 & b>r+22 & b>60`, flou 2.2 ; désaturer (gris = 0.299r+0.587g+0.114b) partout sauf sous le masque. → `steven_skull_bw_brain.webp`.

## Paramètres clés (dans accueil-A.html, frame())

- `HEAD_FX=0.450, HEAD_FY=0.092` : centroïde du cerveau bleu (recaler si on rebouge le crâne).
- Zoom : `sc0 = 1 + e*1.4` ; pan `translateY(e*panVH)` avec `panVH = innerWidth<=820 ? 10 : 36` (mobile).
- Crâne : opacité `smooth(0.18,0.235,P) * (1 - 0.30*smooth(0.25,0.30,P))` → plein puis 70 %.
- `inside = smooth(0.5,0.72,P)` (reste dedans jusqu'au contenu) ; `insideScale = 4.6/R`.
- Rotation monotone : `roty = -(e*0.6 + innerP*3.2 + cspin)`, `cspin += dt*(0.3+0.1*cT0)`.
- Voile contenu `.cbg` = `rgba(5,5,15,0.53)` (compromis lisibilité/points visibles).

## Gotchas techniques (à ne pas réapprendre)

- **Superposition 2 photos de cadrages différents = jamais propre.** Fondu simultané → double expo dégueu. Wipe/masque → moitié-moitié. Enchaînement → trou noir. Seule solution acceptée : **fondu tardif rapide vers le crâne SEUL** (l'humain part avant). Aligner d'abord.
- **Test headless ment sur le mobile** : `chrome --headless=new` rend TOUJOURS en **500px CSS** quelle que soit `--window-size` (qui ne rogne que la capture). → tester le breakpoint mobile à `--window-size=500,900`, sinon on voit une tranche gauche d'un layout 500px (faux « contenu coupé à droite »).
- **Retina** : `renderer.setSize(w,h)` **sans** le `false` (sinon canvas 2× trop grand sur dpr>1).
- **Placer le 3D sur un élément DOM** : `getBoundingClientRect()` + `camera.unproject`, jamais de coords en dur.
- **Immersion « dedans »** : caméra FIXE (pas de sin/cos + lookAt → ça tangue/saccade). On est dedans parce que le nuage grossit ; la navigation vient de la rotation du nuage. Capper `gl_PointSize` (`clamp(...,1.0,34.0)`).
- **Bug position:fixed** : un `transform` (même `translateY(0px)`) sur un parent en fait le référent des enfants `position:fixed` → mettre `transform:'none'` au repos.
- **Vérifier en headless SwiftShader** : `--enable-unsafe-swiftshader --use-gl=angle --use-angle=swiftshader`, servir via `python3 -m http.server 8765` (le fetch du .bin échoue en file://), forcer un état avec `?p=0.34`.

## Déploiement

`cp accueil-A.html index.html` → `git add index.html assets/brand/steven_skull_bw_brain.webp` → commit → `git push origin main`. Live en ~1 min (GitHub Pages). Vérifier : `curl` l'asset (HTTP 200) + grep du nom dans le HTML live.

## Apprentissages de méthode (session 08/08)

- **Mesurer avant de deviner** : après 2 corrections ratées, instrumenter (afficher rect/computed/innerWidth) au lieu d'enchaîner les patchs à l'aveugle — et **suspecter son propre outil de test** (le « bug » venait du headless 500px, pas du site).
- **Itérer sur le VRAI artefact**, pas sur des démos hors-sol sur fond noir (« ça n'a rien à voir avec ce qu'on a fait »). Montrer le rendu avant de tout construire ; verrouiller à chaque validation.
- **Cause racine, pas symptôme** : traiter le pourquoi (photos non alignées) plutôt que retoucher des opacités en boucle.
