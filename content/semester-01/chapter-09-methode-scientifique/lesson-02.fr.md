# Tester : contrôles et groupes témoins

*Temps estimé : 15 minutes*

## Rappel

Sans regarder :

1. Quelles sont les sept étapes du cycle scientifique ?
2. Qu'est-ce qui distingue une bonne hypothèse d'une mauvaise ?
3. Pourquoi un résultat négatif est-il aussi utile qu'un résultat positif ?

## On ne peut rien conclure sans comparer

« Notre campagne a généré 2 000 ventes en avril. Succès ! »

Vraiment ? Combien de ventes aurions-nous eu **sans** la campagne ? Peut-être 2 200 (la campagne a été contre-productive). Peut-être 500 (elle a quadruplé). Sans un point de **comparaison**, le chiffre seul ne dit **rien**.

C'est la raison d'être du **groupe témoin** (*control group*) : une référence à laquelle comparer l'intervention. Sans comparaison, il n'y a pas de science — seulement des anecdotes.

## Le groupe témoin

Le principe :

- **Groupe traité** : reçoit l'intervention (le médicament, la nouvelle interface, la campagne).
- **Groupe témoin** (ou groupe contrôle) : ne reçoit **pas** l'intervention, mais est autrement comparable.

La **différence** entre les deux groupes est attribuable à l'intervention — sous des conditions précises.

Les conditions :

1. Les deux groupes doivent être **comparables au départ** (mêmes caractéristiques, même distribution).
2. L'intervention doit être la **seule différence** entre eux.
3. Les deux groupes doivent être **observés de la même manière** pendant la même période.

Si ces trois conditions sont réunies, la comparaison est **informative**.

## La randomisation — l'outil d'or

Comment garantir que les deux groupes sont comparables ? **Tirage au sort**.

- **Essai contrôlé randomisé** (*randomized controlled trial*, RCT) : on assigne les sujets au groupe traité ou au groupe témoin par pur hasard.
- Sur un **échantillon assez grand**, toutes les caractéristiques (connues et inconnues) se répartissent également entre les deux groupes.
- La différence mesurée à la fin est donc **causée** par l'intervention, pas par un biais de sélection.

C'est **le gold standard** (cf. chapitre 3 leçon 5). Tout ce qu'on peut randomiser, on devrait.

### Pourquoi la randomisation est magique

Imagine que tu compares des utilisateurs qui ont **choisi** de s'inscrire à ta newsletter avec ceux qui ne l'ont pas choisi. Ces deux groupes **ne sont pas comparables** — les abonnés sont probablement plus engagés **au départ**. Toute différence de comportement peut venir de cet engagement **préexistant**, pas de la newsletter.

Avec une randomisation, le hasard décide : « tu reçois la newsletter, tu ne la reçois pas, indépendamment de ton profil ». La différence observée à la fin est alors attribuable à la newsletter elle-même.

## Les A/B tests

En produit numérique, l'A/B test est la version quotidienne du RCT :

1. On implémente deux variantes d'une fonctionnalité (A et B).
2. On montre aléatoirement A ou B à chaque utilisateur.
3. On mesure une métrique cible (taux de clic, conversion, temps passé).
4. Si la différence est **statistiquement significative** et **de taille utile**, on déploie la variante gagnante.

Exemples :

- Bouton vert vs bouton bleu (test classique).
- Page d'accueil actuelle vs nouvelle version.
- Formulation A du titre vs formulation B.

L'A/B test a ses conditions :

- **Échantillon suffisant** pour détecter l'effet (calcul de puissance — en S4).
- **Une seule variable changée** entre A et B. Si tu changes 10 choses à la fois, tu ne peux pas attribuer la différence.
- **Durée suffisante** pour capturer toute variation temporelle (ex : éviter de tester uniquement le lundi).
- **Pas de « peeking »** — regarder les résultats pendant le test pour décider de s'arrêter biaise les statistiques. Fixe la durée à l'avance.

## Les quasi-expériences

Quand on **ne peut pas** randomiser (éthique, faisabilité, coût), on approche une expérience avec des astuces.

### Différences-en-différences (*diff-in-diff*)

On compare l'**évolution** d'un groupe qui a subi un changement à celle d'un groupe non touché.

Exemple : un magasin change sa disposition ; les autres magasins ne changent pas. On compare l'évolution des ventes **avant/après** dans le magasin modifié à celle des magasins témoins. Si l'écart change, l'hypothèse causale est renforcée.

### Régression par discontinuité (RDD)

Quand une règle crée un **seuil net** — par exemple un dispositif d'aide à partir d'un revenu donné — on compare les gens juste au-dessus au seuil à ceux juste en-dessous. Ils sont **presque** identiques, sauf l'un a l'aide et l'autre non. La différence de résultat mesure l'effet de l'aide.

### Variables instrumentales

Quand une variable externe influence la cause sans influencer directement l'effet, elle sert de « randomisation naturelle ». Avancé — en S8.

Ces méthodes sont **puissantes mais exigeantes**. Elles demandent des hypothèses qu'il faut défendre. À l'inverse, un RCT propre ne demande presque aucune hypothèse externe.

## Les contrôles non-expérimentaux

Pour une analyse observationnelle (pas d'expérience possible), on peut « contrôler » pour des variables confondantes :

- **Stratifier** — comparer par sous-groupes homogènes. Exemple : comparer le salaire hommes/femmes **à ancienneté égale, secteur égal, type de poste égal**.
- **Régression multivariée** (S4) — inclure les confondeurs comme variables dans un modèle pour isoler l'effet de la variable d'intérêt.
- **Matching** — apparier chaque individu traité à un individu non-traité qui lui ressemble.

Ces méthodes **réduisent** le risque de confondeurs connus — mais **ne suppriment pas** les confondeurs inconnus. Seule la randomisation le garantit.

## Le test en aveugle

Dans les expériences humaines, on ajoute souvent une couche de protection :

- **Simple aveugle** : les participants ne savent pas dans quel groupe ils sont. Évite l'effet placebo et l'effet Hawthorne (cf. chapitre 2 leçon 4).
- **Double aveugle** : les participants **ET** les expérimentateurs qui interagissent avec eux ne savent pas. Évite que les attentes des expérimentateurs biaisent les mesures.

En entreprise, tout ne peut pas être en aveugle. Mais la logique est la même : **moins d'information consciente = moins de biais inconscient**.

## Le placebo

Dans un essai médicamenteux, le placebo (pilule sans principe actif) est donné au groupe témoin. Raison : **l'effet placebo** est réel — croire qu'on est soigné améliore souvent les symptômes. Comparer un traitement à « rien » mélange effet actif + effet placebo. Comparer à un placebo isole l'effet actif.

Équivalents en entreprise :

- Une **version « fictive »** d'une nouvelle fonctionnalité pour démêler l'effet « nouveauté » de l'effet « qualité ».
- Un **groupe témoin actif** qui reçoit un traitement alternatif pour démêler « effet du traitement » de « effet d'être dans l'étude ».

## Le piège du non-groupe-témoin

Beaucoup d'études en entreprise font un **avant/après** sans groupe témoin : on change quelque chose, on mesure, on compare au mois précédent.

Problème : **le mois précédent n'est pas un bon témoin**. Entre-temps, mille choses ont changé : saison, concurrence, actualité, météo. La différence mesurée peut venir de n'importe quoi.

Un vrai groupe témoin doit :

- **Co-exister dans le temps** avec le groupe traité.
- **Être comparable** (même distribution démographique, même contexte).

Si c'est impossible, **admets-le honnêtement** dans la section Limites de ton rapport. Ne présente pas un avant/après comme une preuve causale — c'est une corrélation temporelle, rien de plus.

## Le témoin historique

Variante parfois utilisée : on utilise **la même population** comme son propre témoin, sur deux périodes. On traite une partie de l'année, l'autre non. On compare.

Ça aide si les autres facteurs sont stables (saisonnalité faible). Ça trompe si le contexte change (effet covid, nouvelle réglementation).

Règle : **utilise un témoin historique uniquement si tu peux argumenter** que les conditions sont stables entre les deux périodes. Et garde le radar sur les facteurs externes.

## À retenir

- **Sans comparaison**, pas de conclusion causale.
- Le **groupe témoin** doit être comparable, simultané, observé pareil.
- La **randomisation** est l'outil d'or ; l'A/B test en est la version quotidienne.
- Sans randomisation : quasi-expériences (diff-in-diff, RDD) ou contrôles statistiques.
- **Aveugle** et **placebo** pour éviter les effets d'attente.
- **Avant/après sans témoin** = corrélation temporelle, **pas** de causalité.

---

> **La prochaine fois** : même avec un bon protocole, des biais persistent. Quatre biais « survivants » — placebo résiduel, effet Hawthorne, biais de publication interne, biais du chercheur — et comment les atténuer.
