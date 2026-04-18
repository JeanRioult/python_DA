# La réplication et la crise

*Temps estimé : 15 minutes*

## Rappel

Sans regarder :

1. Qu'est-ce que le biais d'attrition et comment le repérer ?
2. Quelle est la différence entre analyse **intention-to-treat** et **per-protocol** ?
3. Qu'est-ce que le pré-enregistrement et à quoi sert-il ?

## Un résultat scientifique n'est pas un théorème

Quand un article scientifique sérieux annonce « l'effet X cause Y », ce n'est pas une **certitude** — c'est un **candidat** à la vérité. Pour devenir une connaissance fiable, ce résultat doit être **répliqué** : reproduit, idéalement par une autre équipe, dans d'autres conditions, avec le même résultat.

La réplication est la **deuxième moitié** de la méthode scientifique — celle qui confirme, ou infirme, ce qu'une première étude a trouvé.

Cette leçon parle d'un fait gênant : **beaucoup de résultats scientifiques publiés ne se répliquent pas**. Et ce que ça signifie pour toi, analyste.

## La « crise de la réplication »

Depuis les années 2010, une série de méta-études a tenté de **rejouer** des expériences publiées dans des revues à comité de lecture — psychologie, médecine, économie expérimentale, sciences sociales. Les taux de réplication sont **beaucoup plus bas qu'attendu** :

- **Psychologie** (Open Science Collaboration, 2015) : environ **39 %** des 100 études testées ont pu être répliquées.
- **Économie expérimentale** (Camerer et al., 2016) : environ **61 %**.
- **Sciences médicales précliniques** : des taux parfois en dessous de **25 %** pour certains domaines.
- **Sciences sociales Nature/Science** (Camerer et al., 2018) : environ **62 %**.

Ce qu'on appelle la **crise de la réplication** (*replication crisis*) a profondément secoué ces disciplines.

**Cela ne veut pas dire que la science est nulle**. Cela veut dire qu'une **fraction notable** de ce qui est publié comme « établi » est en fait fragile ou faux. Et qu'il ne faut **jamais** prendre un résultat unique pour argent comptant.

## Pourquoi ça rate autant

Plusieurs causes cumulées :

### 1. Le biais de publication

Comme vu au chapitre 3 : les journaux préfèrent publier les résultats **positifs**. Les 20 équipes qui n'ont rien trouvé restent silencieuses ; la 21ᵉ, qui a trouvé un effet par hasard, est publiée. Le lecteur n'en voit qu'une sur 21.

### 2. Le p-hacking et le HARKing

- **P-hacking** : multiplier les tests jusqu'à en trouver un significatif.
- **HARKing** (*Hypothesizing After the Results are Known*) : inventer l'hypothèse **après** avoir vu les données. On trouve un pattern, on déclare que c'était l'hypothèse depuis le début. Très souvent involontaire.

Les deux inflent artificiellement le taux de résultats « significatifs ».

### 3. Des échantillons trop petits

De nombreuses études de psychologie historique sont basées sur 30 à 100 étudiants américains. C'est **insuffisant** pour détecter des effets modestes avec fiabilité. L'étude repère un effet énorme par hasard ; quand on refait sur 1 000 personnes dans un autre pays, plus rien.

### 4. La pression académique

La carrière universitaire dépend du nombre de publications dans de bonnes revues. Les pressions perverses (publier vite, publier du « sexy ») poussent vers des méthodes bâclées. Pas de complot — juste un système mal aligné avec la qualité.

### 5. La fraude pure

Rare mais existante. Les cas célèbres (Diederik Stapel en psychologie, Bruno Lemaitre dans l'immunologie) ont produit des dizaines de papers frauduleux avant d'être démasqués. Même ces fraudeurs ont eu une carrière avant leur chute — montrant que les garde-fous ont leurs limites.

## La réplication — modes d'emploi

Trois niveaux, du moins au plus strict :

### 1. Réplication directe (*direct replication*)

Refaire **exactement la même expérience** avec des sujets nouveaux. La plus facile à juger : soit le résultat tient, soit il ne tient pas.

### 2. Réplication conceptuelle (*conceptual replication*)

Tester la **même hypothèse** avec un **protocole différent**. Si l'effet est réel, il devrait survivre à un changement de mesure, de population, de contexte. Plus riche, mais plus ambiguë : un échec peut venir du changement de protocole plutôt que d'un effet inexistant.

### 3. Réplication par méta-analyse

Compiler **de nombreuses études** sur le même sujet, pondérer par la qualité, calculer un effet moyen. Si les résultats sont très dispersés ou vont dans les deux sens, l'effet est probablement fragile.

## Les garde-fous modernes

La discipline scientifique s'est armée, progressivement :

- **Pré-enregistrement** — décrire l'hypothèse et le protocole **avant** de voir les données, dans un registre public (OSF, clinicaltrials.gov). Empêche le HARKing.
- **Open data / open methods** — publier les données et le code. Permet à d'autres de vérifier.
- **Journaux spécialisés** dans la réplication et les résultats négatifs.
- **Méta-analyses** systématiques (Cochrane en médecine).
- **Correction multi-tests** plus stricte, p-values interprétées avec plus de nuance.
- **Bayesian statistics** — une alternative à p-value qui quantifie la force de l'évidence de manière plus continue.

**Aucune garantie absolue.** Mais le cumul de ces pratiques réduit le taux de mauvais résultats.

## Ce que ça change pour toi

Règles pratiques pour un analyste qui **consomme** de la science ou de la data analysis :

### 1. Ne te repose pas sur un résultat unique

Une étude isolée est un **indice**, pas une preuve. Cherche la méta-analyse, ou au moins plusieurs études convergentes, avant d'y fonder une décision.

### 2. Regarde la taille d'échantillon

Un effet « significatif » sur 30 personnes est moins fiable qu'un effet sur 10 000. Même p-value, fiabilité très différente.

### 3. Regarde la pré-inscription

Un papier pré-enregistré est plus fiable qu'un papier non-pré-enregistré. Les journaux sérieux l'indiquent en première page.

### 4. Méfie-toi des effets énormes

Si une étude annonce un effet qui **devrait être visible à l'œil nu** (« ce traitement double les chances »), mais que personne n'en a parlé avant, c'est suspect. La plupart des effets réels en sciences humaines sont **modestes**.

### 5. Attends la réplication avant d'agir

Pour les décisions à fort enjeu (politique, budget, stratégie), une étude unique ne suffit pas. Attends un consensus ou une réplication. Pour les décisions légères (tester un bouton sur un site), tu peux te contenter d'un A/B test.

## Et si tu es celui qui produit ?

Côté producteur d'analyses :

- **Rends ton travail reproductible** — code partagé, données (quand possible), procédure documentée. Même à usage interne.
- **Reporte honnêtement** la taille d'échantillon, les tests faits, ceux non-significatifs.
- **Accepte la réplication** — si un collègue veut refaire ton analyse pour vérifier, c'est un cadeau, pas une attaque.
- **Documente les négatifs** — que tu ne recycles pas une fausse évidence plus tard.

## Le cas particulier de l'IA et du machine learning

Un sujet brûlant : les papers de recherche en machine learning / IA ont aussi leurs problèmes de réplication :

- Hyperparamètres non-publiés.
- Datasets privés.
- Résultats dépendants de détails d'implémentation non documentés.
- Benchmarks « leakés » dans l'entraînement (le modèle a vu les données de test).

Si tu lis un paper ML annonçant un nouveau SOTA (*state-of-the-art*), cherche :

- Le **code** est-il publié ? Sur quelle plateforme ?
- Les **hyperparamètres** complets sont-ils documentés ?
- Les **données** sont-elles accessibles ?
- D'**autres équipes** ont-elles reproduit le résultat ?

Un papier sans ces éléments est un papier fragile — même s'il est publié dans NeurIPS ou ICML.

## Le chercheur honnête face à l'erreur

Un dernier point, qui vaut pour toute une vie professionnelle. Même un chercheur honnête se trompera **parfois**. La question n'est pas : *comment ne jamais me tromper ?* (personne n'y arrive). C'est : *comment réagir quand je découvre que je me suis trompé·e ?*

Deux attitudes possibles :

- **Mauvaise** : cacher, minimiser, espérer que personne ne le remarque, retourner la critique contre les critiques.
- **Bonne** : publier une correction, retirer le papier, admettre clairement, expliquer ce qu'on a appris.

Seule la **bonne** attitude fait avancer la science — et ta propre carrière à long terme. Une correction publiée est bien vue ; une fausseté cachée est catastrophique si elle finit par sortir.

En entreprise, c'est la même chose : une erreur admise tôt te coûte un peu. Une erreur cachée qui finit par ressortir te coûte ton poste.

## À retenir

- Une portion non négligeable (30-60 %) des résultats publiés ne se répliquent pas — **la crise de la réplication** est réelle.
- Causes : **biais de publication**, **p-hacking**, **HARKing**, **échantillons trop petits**, **pression académique**.
- Garde-fous : **pré-enregistrement**, **open science**, **méta-analyses**.
- **Ne fonde jamais une décision lourde sur une seule étude**.
- Mesures : taille d'échantillon, pré-enregistrement, taille d'effet plausible.
- **Admettre tôt** une erreur te coûte moins cher que la cacher.

---

> **La prochaine fois** : comment tout ça se traduit dans **ton quotidien d'analyste en entreprise** — où les contraintes sont différentes de celles de l'académie, mais où les principes restent.
