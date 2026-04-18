# Corrélation n'est pas causalité

*Temps estimé : 15 minutes*

## Rappel

Sans regarder :

1. Qu'est-ce qu'un *strawman*, et quel est son antidote ?
2. Quelle est la différence entre un appel à l'autorité **légitime** et un appel à l'autorité **sophistique** ?
3. Qu'est-ce que le p-hacking ?

## La confusion la plus coûteuse en analyse

Presque toutes les grosses erreurs en analyse de données viennent de **confondre corrélation et causalité**. Des politiques publiques mal orientées, des médicaments prescrits à tort, des décisions marketing aberrantes, des modèles IA qui encodent des biais — beaucoup tournent autour de cette confusion.

Elle mérite sa propre leçon parce qu'elle ne se résout **pas** juste en « faisant attention ». Il y a des outils précis, un vocabulaire précis, une littérature précise.

## Définitions précises

- **Corrélation** : quand deux variables *varient ensemble*. Statistiquement mesurable (coefficient de Pearson, Spearman, etc.).
- **Causalité** : quand **une variable influence l'autre**. Pas directement mesurable dans les données seules.

Corrélation n'implique pas causalité, et réciproquement la causalité peut exister sans corrélation visible (si d'autres variables la masquent). **Les deux notions sont indépendantes**. Ne jamais les confondre.

## Les quatre explications possibles d'une corrélation entre A et B

Quand tu observes que A et B varient ensemble, **quatre** hypothèses doivent être considérées :

### 1. A cause B

L'hypothèse tentante. Mais c'est **une** des quatre, pas forcément la bonne.

### 2. B cause A (causalité inversée)

Exemple classique : on observe que les hôpitaux avec plus de médecins ont plus de décès. L'hypothèse naïve : plus de médecins → plus de décès. La vraie explication : les hôpitaux complexes (oncologie, grands traumatismes) recrutent plus de médecins *et* ont des patients plus gravement atteints. La causalité va du type de patient vers les deux (médecins, mortalité).

### 3. Une troisième variable C cause les deux (confondeur)

Les *confondeurs* sont la source n°1 de fausses causalités.

- Observation : les enfants qui lisent plus **sont plus grands**.
- Hypothèse naïve : la lecture fait grandir.
- Réalité : **l'âge** explique tout. Les enfants plus âgés lisent plus *et* sont plus grands. L'âge est le confondeur ; sans lui, la corrélation lecture-taille disparaît.

### 4. La corrélation est un pur hasard

Avec assez de variables, on trouve des corrélations fortuites. Le site *Spurious Correlations* de Tyler Vigen en collectionne : *« consommation de margarine par habitant »* corrèle à 0.99 avec *« taux de divorce dans le Maine »*. Évidemment, pas de lien causal.

## Le cadre causal moderne : Judea Pearl

Dans les années 1990-2000, Judea Pearl (Prix Turing 2011) a formalisé le raisonnement causal avec les **DAGs** (*Directed Acyclic Graphs* — graphes orientés acycliques) et le ***do-calculus***. C'est le cadre que tout analyste sérieux devrait connaître — on le reverra en profondeur au semestre 8. Pour l'instant, les notions clés.

### La "ladder of causation" (échelle de Pearl)

Pearl identifie **trois niveaux** de questions causales :

1. **Association** — « quand je vois X, que puis-je prédire sur Y ? » (niveau des corrélations, des statistiques classiques, du machine learning prédictif)
2. **Intervention** — « si je *force* X à une valeur, que devient Y ? » (niveau des expérimentations, des essais randomisés, de `do(X=x)`)
3. **Contrefactuel** — « si X avait été différent, qu'est-ce qui se serait passé pour **ce cas précis** ? » (niveau des regrets, des attributions de responsabilité)

Les modèles classiques d'apprentissage automatique ne répondent qu'au niveau 1. Pour monter au niveau 2 ou 3, il faut un **modèle causal** explicite — pas seulement des données.

### Le confondeur, visuellement

Un DAG pour notre exemple lecture-taille :

```
      âge
       |  \
       v   v
   lecture  taille
```

L'âge cause à la fois la lecture et la taille. Il y a un **chemin ouvert** `lecture ← âge → taille` qui crée une corrélation *non-causale* entre lecture et taille. Pour isoler l'éventuel effet causal de la lecture sur la taille, il faut **contrôler pour l'âge** (stratifier, ajuster, comparer à âge égal).

Ces décisions (« contrôler pour quoi ? ») ne se déduisent **pas** des données. Elles demandent un **modèle causal** fondé sur la connaissance du domaine.

## Comment établir la causalité

Trois voies, par ordre croissant de rigueur :

### Voie 1 — Les critères de Hill (1965)

Bradford Hill a proposé 9 critères qui *renforcent* (sans prouver) une hypothèse causale à partir d'observations :

- **Force** de l'association (une corrélation de 0.9 est plus suggestive que 0.1)
- **Consistance** (observée par plusieurs équipes, dans plusieurs contextes)
- **Spécificité** (l'effet apparaît dans une population précise, pas partout au hasard)
- **Temporalité** (la cause précède l'effet — indispensable)
- **Gradient dose-réponse** (plus de cause → plus d'effet)
- **Plausibilité** (mécanisme biologique / physique envisageable)
- **Cohérence** (avec le reste de la connaissance)
- **Expérience** (on peut manipuler la cause et voir l'effet)
- **Analogie** (avec d'autres cas causaux établis)

Aucun de ces critères n'est suffisant seul. Plusieurs ensemble *rendent* une causalité plausible.

### Voie 2 — Les quasi-expériences

Quand tu ne peux pas randomiser (éthique, coût) mais que la nature t'offre un « accident » :

- **Différences-en-différences** : comparer l'évolution d'un groupe touché par un changement à celle d'un groupe non-touché.
- **Régression par discontinuité** (RDD) : quand une règle crée un seuil net (par ex. aide sociale à partir d'un revenu donné), comparer juste au-dessus et juste en-dessous.
- **Variables instrumentales** : quand une variable externe affecte la cause sans affecter directement l'effet, elle sert de « quasi-randomisation ».

On les reverra au semestre 8.

### Voie 3 — L'essai contrôlé randomisé (*RCT*)

L'**étalon-or**. Tu as deux groupes, tu attribues au hasard qui reçoit le traitement et qui reçoit le placebo, tu compares les effets. Si les groupes sont assez grands, tous les confondeurs (connus et inconnus) se répartissent également — et la différence observée est causalement due au traitement.

Un RCT n'est pas toujours faisable (éthique : on ne peut pas randomiser un cancer ; coût : un RCT sérieux coûte des millions ; temps : certains effets sont à 20 ans). Mais quand il est faisable, rien d'autre ne rivalise.

## Les red flags dans un rapport

Quand tu lis ou tu rédiges un rapport, ces formulations doivent **alerter** :

- « X **entraîne** Y », « X **cause** Y », « X **conduit à** Y » — ces verbes sont causaux. Sont-ils justifiés par un RCT ou une quasi-expérience ? Si on a juste une corrélation, réécris en « X **est associé à** Y », « X **corrèle avec** Y ».
- « **Grâce à** X, Y a augmenté » — attribution causale. Preuve ?
- « **Plus on fait X, plus Y augmente** » sans modèle causal — c'est une corrélation présentée comme une mécanique.

Inverse, formulations honnêtes :

- « Les données suggèrent une association entre X et Y. La direction causale n'est pas établie à partir de ces seules observations. »
- « Contrôlant pour Z, l'effet marginal de X sur Y est... »
- « Un essai randomisé serait nécessaire pour conclure sur un effet causal. »

## À retenir

- **Corrélation ≠ causalité**. Ni dans un sens, ni dans l'autre.
- Face à une corrélation, **quatre hypothèses** : A→B, B→A, confondeur, hasard.
- Pour **établir** une causalité : critères de Hill, quasi-expériences, et surtout **RCT**.
- Dans ton vocabulaire : réserve « cause », « entraîne », « grâce à » aux cas **prouvés**. Sinon : « associé », « corrélé », « lié à ».

---

> **Fin du chapitre 3.** Tu as maintenant un langage propre pour raisonner sur les données : logique formelle, trois modes d'inférence, détection des sophismes, distinction corrélation-causalité.
>
> **Prochain chapitre** : mathématiques fondamentales. On passe de la logique au chiffre. Arithmétique, fractions, pourcentages, algèbre, fonctions — tout ce qu'il faut pour ne jamais se sentir perdu devant une formule.
