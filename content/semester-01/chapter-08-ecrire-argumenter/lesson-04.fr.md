# Citer, référencer, ne pas plagier

*Temps estimé : 15 minutes*

## Rappel

Sans regarder :

1. Qu'est-ce qu'une **nominalisation**, et pourquoi l'éviter ?
2. Quand utiliser le deux-points plutôt qu'un « parce que » ?
3. Quelles sont les trois passes de révision d'un document ?

## Pourquoi citer

Un rapport d'analyse s'appuie sur :

- Des **données** (fichiers, bases, API).
- Des **méthodes** (statistiques, algorithmes, règles métier).
- Des **idées** (issues de livres, articles, collègues).

Chacune de ces trois sources demande une **attribution**. Citer proprement sert **quatre** fonctions :

1. **Honnêteté intellectuelle** — attribuer les idées à leurs auteurs.
2. **Reproductibilité** — permettre à un autre de refaire ton analyse à partir des mêmes sources.
3. **Crédibilité** — le lecteur peut vérifier, donc te faire confiance.
4. **Défense** — si une conclusion est attaquée, tu peux montrer qu'elle suit la littérature.

Citer n'est pas un ornement académique — c'est un **geste de base** qui distingue une analyse sérieuse d'un texte d'opinion.

## Qu'est-ce que le plagiat

Le **plagiat** = présenter l'idée ou le travail d'un autre comme s'il venait de soi. Il peut être :

- **Volontaire** — copier-coller délibéré sans créditer.
- **Involontaire** — reformulation légère d'une idée lue sans se souvenir où, ou oubli de guillemets.
- **Auto-plagiat** — recycler un de ses propres textes dans un autre contexte sans le signaler (surtout problématique en académique).

**Le plagiat ruine des carrières**. Des journalistes, des politiciens, des universitaires sont tombés pour ça. Il se détecte facilement aujourd'hui (outils automatiques qui comparent un texte à des milliards de sources en ligne). Le risque ne vaut **jamais** la fausse économie.

## Trois façons d'utiliser une source, chacune avec sa règle

### 1. Citation directe — les mots exacts de l'auteur

Utilise quand la formulation elle-même compte (une définition précise, une phrase célèbre, un chiffre exact).

Règle : **entre guillemets** + **référence** précise.

> « Les prédictions sont difficiles, surtout celles qui concernent l'avenir. » (Bohr, cité par Hawking, 1988, p. 45)

Quatre éléments :

- Guillemets `« ... »` ou `"..."`
- Auteur
- Date
- Pagination si possible

Une citation > 3 lignes se met dans un **bloc retrait**, sans guillemets, avec la référence à la fin.

### 2. Paraphrase — ton style, leur idée

Tu reformules une idée avec tes propres mots. C'est ce qu'on fait 90 % du temps.

Règle : **pas de guillemets**, **mais référence obligatoire**.

> D'après Kahneman (2011), le cerveau humain raisonne selon deux systèmes : l'un rapide et intuitif, l'autre lent et analytique.

Le test du plagiat pour une paraphrase : si tu alignes ton texte et l'original, **la structure de phrase et le choix de mots** doivent être **visiblement différents**. Changer deux mots dans une phrase est du plagiat, pas une paraphrase.

Une bonne paraphrase recompose : **lis la source, ferme-la, écris de mémoire, relis pour vérifier**.

### 3. Synthèse — plusieurs sources en un point

Tu rassembles les constats de plusieurs auteurs sur un sujet.

> Plusieurs études récentes (Smith 2020, Martin 2022, Wang 2023) montrent que l'effet est plus marqué chez les jeunes adultes.

Référence **chacune** des sources. Si elles se contredisent, c'est encore plus intéressant : dis-le.

## Les styles de citation

Plusieurs conventions existent. Choisis-en **une** et reste cohérent·e :

### Style auteur-date (dit « APA »)

Dans le texte : `(Kahneman, 2011)`.

Bibliographie en fin de document :

> Kahneman, D. (2011). *Thinking, Fast and Slow*. Farrar, Straus and Giroux.

C'est le style dominant en sciences humaines et sociales, psychologie, économie. **Recommandé** en analyse de données.

### Style numérique (dit « Vancouver » ou « IEEE »)

Dans le texte : `[1]` ou `[1,3,5]`.

Bibliographie numérotée en fin :

> [1] Kahneman D. *Thinking, Fast and Slow*. FSG; 2011.

Dominant en sciences dures et médecine. Plus compact dans le texte, moins informatif à la volée.

### Style notes de bas de page (dit « Chicago »)

Appel de note en exposant dans le texte¹, référence en bas de page.

Dominant dans les sciences humaines classiques, moins pratique pour les rapports courts.

## Comment citer une source de données

Un type de citation que les académies classiques oublient — mais central pour l'analyste.

Pour un dataset INSEE :

> INSEE. *Recensement de la population — Populations légales millésimées 2021*. Série « RP-2021 », fichier `populations-legales-communes-2021.xlsx`. Extrait le 15 mars 2026. https://www.insee.fr/fr/statistiques/6011070

Les éléments importants :

- **Organisme** (INSEE, Eurostat, Banque mondiale…).
- **Titre du dataset**.
- **Identifiant / référence** (numéro de série, ID technique).
- **Fichier précis** si pertinent.
- **Date d'extraction** — critique, parce que les sources se mettent à jour. Tu as analysé une version figée ; sans date d'extraction, personne ne peut retrouver exactement cette version.
- **URL** permanente.

## Citer du code

Si tu utilises une bibliothèque, une fonction, un snippet spécifique d'une source extérieure (livre, Stack Overflow, paper), attribue.

Dans un notebook, un commentaire suffit :

```python
# Implémentation basée sur l'algorithme de Welford (1962),
# adapté de https://en.wikipedia.org/wiki/Algorithms_for_calculating_variance
def variance_en_ligne(valeurs):
    ...
```

Pour un logiciel que tu publies : crée un fichier `REFERENCES.md` ou une section dans le `README` qui liste les sources majeures.

## La « fair use » et les éléments libres

Tous les matériaux ne sont pas à citer de la même manière :

- **Faits bruts** (la population de Paris en 2021) — pas besoin de citer, mais tu peux indiquer la source si utile.
- **Chiffres d'une source spécifique** (taux de chômage INSEE T2-2025) — citer.
- **Idée commune / bien connue** — pas besoin.
- **Idée originale de quelqu'un** — citer.
- **Texte** copié > quelques mots — guillemets + citer.
- **Graphique / image** d'une source — crédite, et vérifie les droits d'utilisation.

Quand tu doutes : **cite**. Le lecteur ne se plaint jamais d'un excès de références.

## Les outils de gestion bibliographique

Pour un travail long, tenir à la main une bibliographie est pénible et source d'erreurs. Les outils aident :

- **Zotero** (gratuit, libre) — recommandé pour débuter. Plugin pour navigateur qui capture automatiquement les infos bibliographiques d'un article.
- **Mendeley** (gratuit, propriétaire) — similaire.
- **BibTeX** — format texte standard en science, utilisé avec LaTeX.

Investis quelques minutes à installer **Zotero** dès que tu écris ton premier travail long — tu n'y reviendras plus jamais.

## Les IA génératives

Nouvelle question ouverte. Si tu utilises ChatGPT, Claude, ou une autre IA pour :

- **Reformuler** un texte que tu as écrit → probablement pas de citation nécessaire (tu l'utilises comme un correcteur).
- **Produire un brouillon** substantiel → dépend des règles de ton contexte. En milieu académique, c'est souvent soit interdit, soit à déclarer. En entreprise : sois transparent avec ton manager.
- **Résumer un article** pour toi → tu dois **toujours** citer l'article original, pas l'IA.
- **Proposer du code** → mentionne-le en commentaire, et **vérifie** le code (les IA hallucinent des fonctions qui n'existent pas).

Règle générale : **l'IA est un outil, pas une source**. Tu restes responsable de tout ce que tu produis, y compris des erreurs factuelles copiées d'une sortie d'IA.

## Le test « à qui appartient cette idée »

Avant d'envoyer un rapport, parcours-le en te demandant pour **chaque idée importante** : *où est-ce que j'ai appris ça ?*

- Si c'est **le résultat de mon analyse** → c'est à toi, pas besoin de citer.
- Si c'est **une conséquence évidente** de tes résultats → à toi.
- Si c'est **le chiffre INSEE** → cite INSEE.
- Si c'est **un cadre théorique** (pyramide de Maslow, p-value, théorème central limite) → cite ou au minimum réfère à l'auteur historique.
- Si c'est **une idée d'un collègue** → mentionne (« comme l'a souligné [collègue] »).

Cet exercice prend 5 minutes et protège ta crédibilité.

## À retenir

- **Citer** n'est pas optionnel : honnêteté, reproductibilité, crédibilité, défense.
- **Trois usages** d'une source : citation directe (guillemets), paraphrase (reformulation + référence), synthèse (plusieurs références).
- Choisir **un style** (APA recommandé) et s'y tenir.
- Pour un **dataset** : organisme, titre, identifiant, date d'extraction, URL.
- Pour une **IA générative** : outil, pas source. Cite les sources originales, reste responsable.
- Utilise **Zotero** pour les travaux longs.

---

> **La prochaine fois** : le pendant de l'écriture — savoir **lire** un texte dense sans y perdre 3 heures. Méthodologie du survol, de la lecture active, du traitement.
