# Pourquoi la logique, pour un analyste

*Temps estimé : 15 minutes*

## Rappel

Sans regarder :

1. Cite les 8 étapes de la check-list quand tu reçois un dataset.
2. Pourquoi les outliers demandent-ils un jugement avant d'être exclus ?
3. Pourquoi la question « une ligne = quoi ? » est-elle critique ?

## Un analyste raisonne avant de calculer

La plupart des gens imaginent le métier d'analyste comme *calculer des choses*. Moyennes, médianes, graphiques, modèles. C'est faux, ou plus exactement c'est très incomplet : **le calcul est le dernier maillon d'une chaîne de raisonnement**.

Avant le calcul :

- **Qu'est-ce qu'on cherche à savoir ?** — formulation du problème
- **Comment le saurait-on si c'était vrai ?** — critère de vérité
- **De quoi a-t-on besoin pour trancher ?** — plan d'analyse
- **Les chiffres qu'on va produire *pourraient*-ils trancher ?** — validité logique

Si l'une de ces quatre étapes est bâclée, même les calculs les plus sophistiqués donneront des réponses à **une autre question**. Une réponse juste à une mauvaise question n'a aucune valeur.

Ce chapitre enseigne les outils de raisonnement sur lesquels repose toute analyse sérieuse. Ils viennent de la philosophie, pas des maths — et c'est normal : avant d'être une discipline mathématique, l'analyse de données est une discipline *critique*.

## L'analyste comme avocat et comme juge

Un bon analyste joue deux rôles en permanence :

1. **L'avocat** — tu as une hypothèse, tu cherches ce qui la soutient.
2. **Le juge** — tu pèses l'évidence, y compris ce qui contredit l'hypothèse.

Le débutant reste avocat. Il trouve des chiffres qui vont dans son sens et s'arrête. Le professionnel s'oblige à devenir *juge* : il cherche activement les contre-exemples, les explications alternatives, les angles morts de sa donnée.

Cette gymnastique mentale — alterner *argumentation* et *évaluation critique* — se pratique. Ce chapitre te donne les outils. Les autres chapitres te donneront les occasions.

## Trois compétences logiques à acquérir

Ce chapitre construit, dans l'ordre :

1. **La logique formelle** (leçon 2) — manipuler rigoureusement des propositions, comprendre ce qu'implique *vraiment* une affirmation.
2. **Les modes de raisonnement** (leçon 3) — savoir si l'on déduit, induit, ou abduque, et ce que chacun *garantit* ou non.
3. **La détection d'erreurs** (leçons 4-5) — repérer les sophismes dans un argument, et la plus coûteuse des confusions : corrélation vs causalité.

Ces trois compétences sont **transversales**. Elles servent au débat public comme en réunion, à la lecture d'une étude comme à la rédaction d'un rapport, à la programmation comme à la méthode scientifique.

## Un cas d'école

Prenons une phrase qu'on entend tous les jours :

> « Les jeunes qui font du sport ont de meilleurs résultats scolaires. Donc le sport aide à mieux réussir à l'école. »

Question : est-ce un raisonnement valide ?

Réponse : **non — et plusieurs choses ne vont pas**.

- La prémisse (« ont de meilleurs résultats ») est une **corrélation**. Elle ne dit rien sur la direction (le sport cause les bons résultats ? Les bons élèves ont plus de temps pour le sport ?).
- Il peut exister une **cause tierce** — par exemple l'origine sociale (des familles aisées s'offrent des clubs de sport *et* des cours particuliers).
- Même si l'effet existe, le raisonnement **l'attribue entièrement au sport**, sans considérer la dose, la régularité, le type d'activité.
- La conclusion généralise à « l'école » alors que l'étude ne portait peut-être que sur une tranche d'âge, un type d'établissement, un pays.

Quatre erreurs en une phrase de 20 mots. Multiplie par la quantité de telles phrases produites chaque jour dans les médias, les rapports d'entreprise et les publications scientifiques — tu as une mesure du besoin d'analystes qui savent raisonner.

## Le principe de charité

Quand tu évalues un argument — y compris le tien — applique **le principe de charité** : interprète-le dans sa *version la plus forte possible*, puis critique cette version.

Pourquoi ? Parce que critiquer une version caricaturale d'un argument (un *strawman*, que nous verrons leçon 4) ne prouve rien. Tu n'as démonté qu'une caricature. Si tu veux vraiment savoir si l'argument tient, démonte-le dans sa version la plus défendable.

Appliqué à l'exemple précédent : avant de dire « corrélation ≠ causation donc l'argument est nul », demande-toi s'il existe une littérature sérieuse qui étaie l'effet. Pour le sport et les résultats scolaires, il en existe une — sophistiquée, avec des études randomisées, des effets modestes mais réels, des conditions précises. L'argument du café-du-commerce est mauvais ; la question sous-jacente est vraie et intéressante.

## Logique et gentillesse

Une dernière chose, qu'on ne dit pas assez. La logique n'est pas une arme pour écraser les autres. C'est un **outil collectif** pour se rapprocher du vrai. Quand tu repères une faille dans le raisonnement d'un collègue ou d'un commanditaire :

- Formule-la comme une question, pas comme une accusation.
- Suppose la bonne foi jusqu'à preuve du contraire.
- Propose la reformulation que tu trouverais valide.
- Accepte que tu puisses avoir manqué un argument.

Un analyste qui a raison mais qui est insupportable n'a pas raison pour longtemps — personne ne l'écoutera.

## À retenir

- Le calcul est le **dernier** maillon. Avant : bien poser la question, bien penser.
- Un analyste alterne **avocat** et **juge** — toujours chercher aussi ce qui contredit.
- Trois outils à venir : **logique formelle, modes de raisonnement, détection des sophismes**.
- **Principe de charité** : critique la version la plus forte d'un argument, pas une caricature.

---

> **La prochaine fois** : les briques de la logique formelle. Propositions, opérateurs, tables de vérité. Ce n'est pas juste de la philosophie — tu retrouveras exactement la même logique en Python et en SQL.
