# Déduction, induction, abduction

*Temps estimé : 15 minutes*

## Rappel

Sans regarder :

1. Donne les lois de De Morgan.
2. Pourquoi `P → Q` est-il vrai quand `P` est faux ?
3. Quelle est la différence entre la contraposition et la réciproque d'une implication ?

## Trois manières de raisonner, trois prétentions différentes

Il existe **trois modes fondamentaux** de raisonnement. Chacun part d'un type d'information et garantit un type de conclusion. **Confondre les modes** est une source majeure d'erreurs.

| Mode           | Part de                 | Conclut sur            | Garantie         |
| -------------- | ----------------------- | ---------------------- | ---------------- |
| **Déduction**  | Règle + cas             | Conclusion             | **Certaine** (si prémisses vraies) |
| **Induction**  | Observations            | Règle générale         | Probable         |
| **Abduction**  | Observation + règles connues | Meilleure explication | Plausible        |

Les philosophes depuis Aristote, et Charles Sanders Peirce au XIXᵉ siècle pour la distinction moderne, ont formalisé ces distinctions. Un analyste sérieux sait toujours **dans lequel de ces trois modes il opère**.

## La déduction — certaine mais limitée

Tu pars d'une **règle générale** et d'un **cas particulier**, tu en tires une conclusion *forcée*.

Exemple classique :

- Règle : *Tous les humains sont mortels.*
- Cas : *Socrate est humain.*
- **Donc** : *Socrate est mortel.*

Si les prémisses sont vraies, **la conclusion est vraie**. C'est non-négociable. C'est le mode du théorème mathématique, de la preuve formelle, du code qui respecte sa spécification.

### Force et limites

La force : **certitude absolue** de la conclusion (modulo les prémisses).

La limite : **tu ne peux déduire que ce qui était déjà contenu dans les prémisses**. La déduction ne crée pas de connaissance nouvelle — elle la révèle. Si tes prémisses ne disent rien de Socrate, aucune déduction ne t'apprendra quoi que ce soit sur lui.

En analyse de données, la déduction apparaît :

- Quand on applique des règles métier (« si statut = closed ET date > hier, alors considérer comme expiré »).
- Quand on dérive une quantité d'autres (« marge = CA − coûts »).
- Dans tout calcul exact.

### Piège

Une déduction est valide même si ses prémisses sont **fausses**. La validité logique ne dit rien sur la vérité des prémisses. Exemple :

- Règle : *Tous les oiseaux volent.* (fausse — les pingouins, kiwis, autruches)
- Cas : *Un manchot est un oiseau.*
- Conclusion : *Un manchot vole.* **Faux**, mais la déduction était valide.

Règle : une déduction valide avec prémisses fausses → conclusion non fiable. Toujours questionner les prémisses, pas juste la logique.

## L'induction — généralisation fragile

Tu pars **d'observations** et tu généralises à une **règle**.

Exemple :

- J'ai vu 1000 cygnes, tous blancs.
- **Donc** : tous les cygnes sont blancs.

C'est l'induction. Elle est **utile et nécessaire** — toute la science expérimentale est inductive. Mais **elle ne garantit jamais la conclusion**. Un seul cygne noir (il en existe en Australie) suffit à ruiner la règle.

### Force et limites

La force : **tu construis des connaissances nouvelles** à partir d'observations. Pas cantonné aux prémisses.

La limite : **aucune quantité d'observations ne prouve la règle**. 1000 cygnes blancs rendent « tous les cygnes sont blancs » plus probable, pas certaine.

C'est **le mode par défaut de la donnée** :

- Tu observes un comportement sur 10 000 utilisateurs et tu généralises à *tous* les utilisateurs.
- Tu vois un effet marketing sur 3 mois et tu extrapoles à l'année.
- Tu entraînes un modèle ML sur un training set et tu l'appliques à de nouvelles données.

### Le piège fondamental

Ton échantillon est fini. La population que tu veux décrire est plus large. Le saut entre les deux est *toujours* spéculatif. Les leçons du chapitre 2 (biais de sélection, survivant, etc.) sont exactement les raisons pour lesquelles une induction peut dérailler.

**Règle d'or** : une conclusion inductive doit **toujours** être accompagnée d'une estimation de son incertitude — intervalle de confiance, marge d'erreur, conditions de validité.

### Le problème de Hume

Le philosophe David Hume (XVIIIᵉ s.) a posé une question qu'aucune école philosophique n'a jamais bien résolue : **pourquoi avons-nous le droit de croire que le futur ressemblera au passé ?** Le soleil s'est levé chaque jour, donc il se lèvera demain ? Cette inférence n'a pas de justification purement logique — elle repose sur la *régularité présumée* de l'univers.

Appliqué à l'analyse de données : ton modèle fonctionne parce que les lois qui régissaient tes données hier s'appliquent encore aujourd'hui. Si quelque chose change (covid, guerre, nouveau concurrent, changement de réglementation), ton modèle décroche. C'est le *data drift* de la leçon 3 du chapitre précédent, vu côté épistémologique.

## L'abduction — la meilleure explication

Tu observes un **fait** qui demande une explication. Tu connais un ensemble de **règles** et de **causes possibles**. Tu choisis **celle qui explique le mieux** le fait observé.

Exemple :

- Fait : *L'herbe est mouillée ce matin.*
- Explications possibles : il a plu, l'arroseur s'est déclenché, la rosée.
- **Meilleure explication** : il a plu (vu le ciel nuageux, le sol a les pieds d'enfants pas les traces de l'arroseur, etc.).

L'abduction est le raisonnement du **détective**, du **médecin**, du **diagnosticien**. Sherlock Holmes ne « déduit » pas — il **abduque** (même s'il appelle ça déduction, le vocabulaire moderne l'a clarifié après lui).

### Force et limites

La force : **extrêmement productive** pour générer des hypothèses. C'est le mode du débogage, du diagnostic, de l'enquête journalistique, de l'analyse exploratoire.

La limite : elle n'est **jamais conclusive**. La meilleure explication que tu as à un moment peut être remplacée par une meilleure plus tard. Si tu n'as imaginé que trois causes possibles, tu choisiras la meilleure des trois — et la vraie cause peut être la quatrième, qui ne t'est pas venue à l'esprit.

### En analyse de données

L'abduction apparaît dès que tu explores :

- Un chiffre est anormal → tu cherches **l'explication la plus probable** (collecte ratée ? événement externe ? erreur de code ?).
- Une corrélation inattendue → tu formules **l'hypothèse la plus plausible**, puis tu la testes.
- Un modèle se trompe → tu cherches **ce qui expliquerait le mieux** l'échec.

L'abduction **produit des hypothèses** ; la déduction et l'induction **les testent**. Le cycle complet de l'analyse exploratoire ressemble à ça :

```
observation → abduction (meilleure explication)
    → déduction (quelles conséquences, si cette explication est vraie ?)
    → induction (les données confirment-elles ces conséquences ?)
    → nouvelle observation → ...
```

## Trois prétentions, trois vocabulaires

Quand tu conclus, **sois honnête sur le mode** :

- Mode déductif : « *Étant donné X et Y, Z est nécessairement vrai.* »
- Mode inductif : « *Les données observées suggèrent que Z tient dans Y% des cas, avec un intervalle de confiance de...* »
- Mode abductif : « *L'explication la plus plausible des données observées est Z, qui reste à tester.* »

Un rapport qui prétend à la certitude déductive alors qu'il fait de l'induction est trompeur. Un rapport qui parle de « corrélation suggestive » alors qu'il a fait une déduction est faussement modeste. Le vocabulaire doit correspondre au mode.

## À retenir

- **Trois modes** : déduction (certaine), induction (probable), abduction (plausible).
- Chacun a sa force et sa limite ; aucun n'est « meilleur ».
- L'analyse de données utilise les **trois en cycles** — abduction pour explorer, induction pour mesurer, déduction pour calculer.
- Ton vocabulaire de conclusion doit refléter le **mode** utilisé.

---

> **La prochaine fois** : les sophismes — les *mauvais raisonnements* qui ont l'air convaincants. Onze à connaître, parce que tu les verras partout.
