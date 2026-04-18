# Quand tu reçois un dataset — la check-list

*Temps estimé : 15 minutes*

## Rappel

Sans regarder :

1. Qu'est-ce que le biais du survivant ? Donne un exemple.
2. Pourquoi pondérer des non-répondants ne supprime pas le biais de non-réponse ?
3. Explique le paradoxe de Simpson en une phrase.

## Pourquoi une check-list ?

Le chirurgien Atul Gawande a montré, dans *The Checklist Manifesto*, qu'une simple check-list de quelques items réduisait la mortalité chirurgicale de façon dramatique — non pas parce que les chirurgiens ne connaissaient pas leur métier, mais parce que **même les experts oublient sous pression**.

Tu vas recevoir beaucoup de datasets dans ta carrière. Tu vas travailler sous pression (deadlines, demandes urgentes). **Tu vas oublier des étapes essentielles** — sauf si tu as automatisé le réflexe via une check-list.

Voici la tienne. Elle s'appuie sur les quatre leçons précédentes de ce chapitre. Elle ne prend que 20 à 30 minutes à parcourir. Elle te sauvera des mois de conclusions fausses.

## La check-list en huit étapes

### Étape 1 — L'origine

**Questions à poser au commanditaire (ou à la documentation)** :

- **Qui** a collecté ces données ?
- **Quand** ont-elles été collectées ? (date de début, date de fin, fréquence)
- **Pour quel objectif** ? (à quelle question initiale le dataset répond-il ?)
- **Quelles populations** y sont incluses ? **Exclues** ?
- **Comment** sont-elles arrivées jusqu'à moi ? (chaîne de traitement, transformations, jointures)

Si une seule de ces questions reste sans réponse, **écris-le explicitement dans ton rapport final**. Un angle mort documenté est toujours meilleur qu'un angle mort caché.

### Étape 2 — Le dictionnaire de données

Pour chaque colonne :

- Son nom.
- Son **type technique** (entier, flottant, texte, booléen, date…).
- Son **niveau de mesure** (nominal, ordinal, intervalle, ratio — cf. leçon 2).
- Son **unité** (€, USD, m, m², kg, °C…). Jamais implicite.
- Les **valeurs possibles** ou l'intervalle légal.
- La **définition précise**. « Revenu » : brut/net, annuel/mensuel, du foyer/de l'individu, sur quelle période ?
- Comment sont codés les **manquants** (`NULL`, `NaN`, `""`, `-1`, `9999` ?).

Pas de dictionnaire ? Construis-le toi-même — en allant interroger les auteurs ou en explorant la donnée. Travailler sans dictionnaire, c'est comme conduire les yeux fermés.

### Étape 3 — Les dimensions

Regarde d'abord la *forme* :

- Combien de lignes ? Combien de colonnes ?
- Est-ce l'ordre de grandeur attendu ? (Si tu attendais 10 000 lignes et tu en as 50, il manque quelque chose. Si tu en as 10 millions, tu as peut-être dé-agrégé quelque part.)
- **Une ligne = quoi ?** Un utilisateur ? Une transaction ? Un jour × utilisateur ? Une paire ?

Ne passe **jamais** cette étape. Mal comprendre la granularité d'une table est la source numéro un des erreurs d'analyse.

### Étape 4 — Les manquants

Pour chaque colonne :

- Combien de manquants ? (compte et pourcentage)
- Sont-ils codés correctement (pas de `-1` qui fait semblant d'être une valeur) ?
- Le taux de manquement est-il corrélé à une autre variable ? (Signe probable de MAR ou MNAR, cf. leçon 3)

**Ne remplis jamais les manquants en silence**. Si tu imputes, documente quoi, comment, pourquoi.

### Étape 5 — Les valeurs extrêmes et invalides

- Minimum, maximum de chaque variable numérique. Cohérents ?
- Un âge à 999 ? Un revenu négatif ? Une date dans le futur ?
- Distribution (histogramme) : unimodale, bimodale, long tail ? Des « pics » suspects (beaucoup de valeurs exactement à 100, 0, la médiane) peuvent indiquer des règles de saisie ou des valeurs par défaut.

Pour chaque extrême, pose la question : **erreur ou valeur rare mais valide** ?

### Étape 6 — Les doublons et l'unicité

- Quelle est ma **clé primaire** attendue ? (Quel champ doit être unique ?)
- Cette clé est-elle effectivement unique ? Si non, pourquoi ?
- Si je fais une jointure, ai-je vérifié la **cardinalité** (1-1, 1-n, n-m) ? Ai-je un test sur le nombre de lignes avant et après ?

### Étape 7 — La cohérence métier

Quelques **sanity checks** basés sur le bon sens métier :

- Les totaux correspondent-ils aux sommes des parties ?
- Les proportions sont-elles plausibles ? (une part de marché à 120 % est un signe d'erreur)
- L'évolution temporelle a-t-elle du sens ? (une hausse brutale de 300 % un lundi suggère un bug de collecte, pas un vrai phénomène)
- Pour deux variables qui devraient être corrélées (ex. salaire et ancienneté), la relation va-t-elle dans le bon sens ?

Ton **intuition métier** est ton meilleur détecteur d'erreurs techniques. Cultive-la.

### Étape 8 — Le biais de représentativité

- Quelle est la **population d'intérêt** pour la question ?
- Les caractéristiques démographiques de l'échantillon correspondent-elles à cette population ?
- Qui **manque** et pourquoi ? (cf. leçon 4 — biais de sélection, survivant, non-réponse…)
- Si je généralise à la population d'intérêt, quel est mon angle mort ?

## Le résultat : une page de « data profile »

À la fin de cette check-list, tu devrais pouvoir écrire **une page** — pas plus, pas moins — qui résume :

- L'origine et la date de la donnée.
- Sa granularité (une ligne = ?).
- Ses limites connues.
- Tes choix de traitement et leurs justifications.
- Les questions auxquelles cette donnée **ne peut pas répondre**.

Cette page doit accompagner **toute** analyse que tu produis. Elle protège ton lecteur contre des conclusions hors périmètre, et elle te protège toi : quand quelqu'un conteste une conclusion dans six mois, tu retrouves ce sur quoi tu étais d'accord au départ.

## Outils pour automatiser une partie

Tu n'as pas besoin de tout faire à la main. Des outils t'aident pour les étapes 3 à 6 :

- **Python** : `pandas.DataFrame.describe()`, `.info()`, `.isna().sum()`, `.duplicated().sum()`
- **Pandas Profiling** / **ydata-profiling** : rapport HTML automatique en une ligne de code
- **`sweetviz`, `dtale`** : alternatives visuelles
- **Excel** : filtres, tableaux croisés dynamiques sur les distributions

Ces outils **accélèrent**. Ils **ne remplacent pas** les étapes 1, 2, 7 et 8 qui demandent du jugement humain et de la connaissance du contexte.

## Le réflexe d'or

Quand tu ne sais pas quoi faire de ton dataset, reviens **toujours** à cette question-mère :

> **Qui a construit cette donnée, quand, pour quoi, et qui y manque ?**

Tout le reste découle de là.

## À retenir

- Une check-list en 8 étapes : origine, dictionnaire, dimensions, manquants, extrêmes, doublons, cohérence, représentativité.
- Rédige une page de *data profile* pour **chaque** dataset, conservée à côté de l'analyse.
- Les outils automatisent le quantitatif ; toi tu apportes le jugement.
- La question-mère : **qui a construit la donnée, quand, pour quoi, qui y manque ?**

---

> **Fin du chapitre 2.** Tu sais maintenant qu'une donnée est une construction, tu sais la classer, tu sais détecter ses défauts, et tu sais la questionner avant de l'analyser.
>
> **Prochain chapitre : Logique & raisonnement** — apprendre à raisonner proprement sur ce qu'on trouve. Parce qu'une donnée bien comprise mal interprétée reste une erreur.
