# Capstone — Semestre 1

**Durée recommandée** : 4 à 6 semaines (tu peux le lancer dès le chapitre 7 terminé).

**Livrable principal** : un rapport IMRaD de 6 à 12 pages + son fichier source (tableur et/ou notebook).

Ce capstone met en pratique l'**intégralité** du semestre 1 : méthode scientifique, questionnement de la donnée, raisonnement logique, mathématiques, Python ou tableur, écriture analytique.

---

## Deux pistes au choix

Choisis celle qui t'inspire le plus. Les deux sont pédagogiquement équivalentes.

### Piste A — *Données personnelles*

**Sujet** : Collecte un mois de tes propres données sur une habitude de ta vie, formule une hypothèse, et teste-la.

Exemples d'habitudes à mesurer :

- Sommeil (heure de coucher, heure de réveil, qualité perçue sur 1-5).
- Temps d'écran (une app dédiée fournit les chiffres).
- Humeur matinale (1-5).
- Pas quotidiens.
- Dépenses.
- Consommation de café, d'alcool, d'eau.
- Temps consacré à une activité (lecture, sport, étude).

Choisis **au moins 2 variables** pour pouvoir étudier une **relation**.

**Question type** : *« Est-ce que X est associé à Y chez moi ? »* (ex : « ma qualité de sommeil dépend-elle de mon temps d'écran le soir ? »).

### Piste B — *Open data INSEE*

**Sujet** : Prends un dataset INSEE, formule une question, et réponds-y rigoureusement.

Exemples de datasets accessibles :

- *Populations légales communales* (par département, par région).
- *Revenus et pauvreté par commune*.
- *Créations d'entreprises* (par secteur, par région).
- *Démographie des entreprises*.
- *Chômage localisé* (par département).

**Question type** : *« Comment X varie-t-il avec Y sur le territoire français en 2024 ? »* (ex : « le revenu médian est-il corrélé à la taille de la commune ? »).

Tous les datasets sont sur [insee.fr/fr/statistiques](https://www.insee.fr/fr/statistiques) au format `.xlsx` ou `.csv`.

---

## Objectifs d'apprentissage

Au terme du capstone, tu dois avoir démontré que tu sais :

- **Formuler une question analytique** précise, falsifiable, et actionnable.
- **Collecter ou obtenir** une donnée propre, documenter sa source et ses limites.
- **Appliquer la check-list de qualité** du chapitre 2 leçon 5 à ton dataset.
- **Explorer** les données avec des statistiques descriptives et des graphiques.
- **Formuler une hypothèse** et la tester — avec une analyse en tableur OU en Python.
- **Rédiger un rapport IMRaD** rigoureux avec une section Limites honnête.
- **Citer proprement** ta source.

## Livrables attendus

### 1. Un rapport écrit (6 à 12 pages)

Structure IMRaD (chapitre 8, leçon 2) :

- **Résumé exécutif** (5-10 lignes) — conclusion principale en premier.
- **Introduction** — observation, question, pourquoi elle compte.
- **Méthodes** — source des données, période, nettoyage appliqué, outils utilisés, méthode d'analyse.
- **Résultats** — statistiques descriptives, graphiques, tests éventuels. Chiffres, pas d'interprétation.
- **Discussion** — interprétation, hypothèse renforcée ou réfutée, **limites** (section obligatoire), recommandations ou pistes futures.
- **Bibliographie et sources** — notamment la référence exacte du dataset.

Format : PDF ou Word. **Pas de slides**.

### 2. Le fichier source

- Si piste tableur : un classeur `.xlsx` avec une feuille `donnees` (brutes), une feuille `analyses`, et éventuellement une feuille `graphiques`.
- Si piste Python : un notebook `.ipynb` propre (qui passe le test « redémarrer et tout relancer »).

Ce fichier doit être **reproductible** — quelqu'un d'autre doit pouvoir refaire tes analyses en partant du fichier.

### 3. Optionnel mais recommandé : un one-pager

Une page qui résume le tout visuellement, pour un décideur pressé. Titre = message, un graphique central, 3-5 bullet points.

---

## Rubrique d'évaluation

Quatre dimensions, chacune notée de 0 à 5, pondérées comme indiqué.

### Correctness — 30 %

- Les chiffres sont exacts.
- La méthode est sans erreur (pas de double compte, pas de biais introduit par inadvertance, pas d'outlier ignoré à tort).
- Les formules / le code tiennent le test « redémarrer et relancer ».
- Les unités et les périodes sont cohérentes.

### Clarity — 25 %

- Un lecteur non-spécialiste comprend le rapport du premier coup.
- La structure IMRaD est respectée.
- Les phrases sont courtes, les verbes actifs, les chiffres précis (leçon 8.3).
- Les graphiques ont titre, axes étiquetés, source, message clair (leçon 7.5).

### Depth — 25 %

- La question dépasse la simple description.
- La section Limites est **concrète et honnête** — pas générique.
- Une explication alternative au résultat est considérée (chapitre 9).
- Au moins une **quasi-expérience** ou un **contrôle statistique** est tenté(e) si la piste le permet.

### Communication — 20 %

- Le rapport est **propre** — pas de fautes d'orthographe, mise en forme cohérente.
- La bibliographie est correctement formatée (leçon 8.4).
- Le fichier source est lisible — colonnes nommées, feuilles organisées, code commenté quand nécessaire.
- Le one-pager (si produit) porte son message en 10 secondes.

---

## Étapes recommandées

**Semaine 1 — cadrage**

- Choisis la piste, choisis le dataset / l'habitude.
- Formule la **question** et l'**hypothèse** (une phrase chacune).
- Télécharge ou commence à collecter les données.

**Semaine 2 — exploration**

- Applique la check-list de qualité des données (chapitre 2 leçon 5).
- Nettoie les données. Documente ce que tu as fait.
- Fais une première exploration visuelle : histogrammes, tendances, outliers.

**Semaine 3 — analyse**

- Tests statistiques adaptés (ou comparaisons structurées si pas de stats avancées).
- Cherche activement les **résultats qui invalideraient** ton hypothèse (leçon 9.5).
- Consolide tes graphiques principaux.

**Semaine 4 — rédaction**

- Premier jet du rapport, en suivant IMRaD.
- **Dors dessus** (chapitre 8 leçon 1).
- Trois passes de révision : structure, phrases, orthographe.

**Semaine 5-6 (optionnel) — peer review**

- Fais-le relire par une personne extérieure au projet (idéalement un·e non-spécialiste).
- Intègre les retours.
- Produis le one-pager si tu ne l'as pas déjà.

---

## Ce que le capstone cherche à éviter

Pas d'obligation de trouver un **effet spectaculaire**. Un rapport qui conclut honnêtement *« l'hypothèse n'est pas soutenue par les données »* est **excellent** s'il a été mené rigoureusement. Ne force pas un résultat — rappelle-toi ce qu'on a dit sur le p-hacking (chapitres 3 et 9).

Pas besoin de modèles sophistiqués. Un rapport en tableur avec un TCD et deux graphiques peut être aussi bon qu'un notebook Python — ce qui compte est la **rigueur** et la **clarté**.

---

## Une mini auto-évaluation avant de rendre

Avant de considérer ton capstone comme terminé, coche honnêtement :

- [ ] Ma question est **spécifique** et **testable** (leçon 9.1).
- [ ] J'ai documenté **l'origine** et les **limites** de la donnée (leçon 2.5).
- [ ] Mes graphiques ont **titre**, **axes étiquetés**, **source**, **message** (leçon 7.5).
- [ ] Ma section **Limites** est **concrète** et non générique (leçon 8.2).
- [ ] J'ai cité ma **source** avec organisme, titre, date d'extraction, URL (leçon 8.4).
- [ ] Mon rapport **commence par la conclusion** (pyramide inversée, leçon 8.1).
- [ ] Mon fichier source **passe le test de reproductibilité** (relance depuis zéro).
- [ ] J'ai cherché **ce qui invalide** ma thèse avant de la défendre (leçon 9.5).
- [ ] Mon rapport est relu **orthographe et formatage** après « dormir dessus ».

Si au moins 7 sur 9 sont cochés, tu es prêt·e. Si moins, reviens sur ce qu'il manque.

---

## Bravo

Arriver au capstone signifie que tu as fait les **9 chapitres** du semestre. Tu as maintenant, pour la première fois, **tout ce qu'il faut** pour mener une analyse de bout en bout.

La suite du cours (S2 → S10) va approfondir chaque brique — statistiques inférentielles, Pandas en vrai, SQL, ML, visualisation avancée, storytelling — mais **tu as déjà un socle complet**. Utilise-le.

Bon capstone.
