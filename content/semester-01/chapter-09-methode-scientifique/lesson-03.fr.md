# Les biais qui survivent à un bon protocole

*Temps estimé : 15 minutes*

## Rappel

Sans regarder :

1. Pourquoi un groupe témoin simultané est-il meilleur qu'un « avant/après » ?
2. Qu'est-ce que la randomisation garantit sur la comparabilité des groupes ?
3. À quoi sert un test **en aveugle** ?

## Même le meilleur protocole laisse passer des biais

Tu as randomisé. Tu as un groupe témoin. Tu as tout fait en double aveugle. **Et pourtant**, des biais peuvent rester. Cette leçon nomme les plus fréquents et propose des parades.

## 1. Le biais de non-adhérence

Dans une expérience humaine, tous les participants ne **suivent pas** le protocole :

- Le groupe traité contient des gens qui n'ont **pas pris** le traitement.
- Le groupe témoin contient des gens qui, curieux, se sont **procurés** le traitement ailleurs.

Deux analyses possibles :

- **Intention-to-treat** (ITT) : tu analyses les gens **comme ils ont été assignés**, peu importe ce qu'ils ont réellement fait. Garde la randomisation.
- **Per-protocol** : tu analyses **seulement ceux qui ont bien suivi**. Garde une mesure plus « pure » de l'effet — **mais** perd la randomisation (les non-adhérents ne sont pas un échantillon aléatoire).

En sciences de la santé, **l'ITT est l'analyse de référence**. Elle sous-estime peut-être l'effet, mais elle ne crée pas de biais nouveau.

Équivalent en entreprise : un A/B test où l'utilisateur n'a pas vu la variante (bug, désactivation volontaire). Analyse comme ils ont été **assignés**, pas comme ils ont **effectivement vu**.

## 2. Le biais d'attrition

Des participants **abandonnent** l'étude avant la fin. Et — piège — ceux qui abandonnent ne sont **pas aléatoires** : ils ont souvent des caractéristiques spécifiques.

Exemples :

- Dans un essai médical, les patients qui ne tolèrent pas bien le traitement abandonnent plus. L'analyse finale porte sur les « survivants », qui tolèrent mieux. L'effet mesuré est surévalué.
- Dans un A/B test, les utilisateurs qui n'aiment pas la nouvelle interface ferment l'app et ne reviennent pas. L'analyse porte sur les utilisateurs restés, qui aiment mieux.

C'est un **biais de survivant** (cf. chapitre 2 leçon 4) appliqué à une expérience.

Parades :

- Suivre **activement** les participants qui abandonnent — pourquoi partent-ils ?
- Reporter explicitement le **taux d'attrition** et ses caractéristiques.
- Éviter de trop longues études quand tu peux.

## 3. L'effet d'attente de l'expérimentateur

Même dans un aveugle, l'expérimentateur peut subtilement orienter les résultats — par le ton de voix, les questions posées, la façon de coder une réponse ambiguë.

Exemple célèbre : l'expérience de Clever Hans (cheval qui « résolvait » des maths). Hans répondait correctement — parce qu'il lisait les micro-expressions faciales des humains qui connaissaient la réponse. Dès qu'on isolait Hans des humains informés, il échouait.

Parades :

- **Double aveugle** (vu en leçon 2).
- **Procédures standardisées** pour les mesures et les questions.
- **Outils automatisés** pour coder les réponses (élimine le codeur humain).

## 4. Le biais de confirmation (du chercheur)

L'analyste a une **hypothèse** qu'il aimerait voir confirmée. Sans contrôle, il va :

- Vérifier les chiffres qui le contredisent plus strictement que ceux qui le confortent.
- Arrêter l'analyse **dès qu'un résultat positif apparaît** (au lieu de continuer à explorer).
- Voir un pattern dans un bruit aléatoire.

Parades :

- **Pré-enregistrement** — écrire à l'avance ce qu'on va analyser et quels résultats invalideraient l'hypothèse. En science académique, c'est devenu une pratique recommandée (plateformes comme OSF). En entreprise, c'est plus souple — mais le **principe** se transpose.
- **Peer review** — faire relire par quelqu'un qui n'a **pas** d'investissement dans le résultat.
- **Adversarial collaboration** — collaborer avec quelqu'un qui a l'hypothèse *opposée*. Vous vous accordez sur le protocole **avant** de regarder les données.

## 5. Le *p-hacking* (vu au chapitre 3)

On teste 20 hypothèses, une sort « significative » (p < 0.05) par pur hasard, on publie celle-là en oubliant les 19 autres. Classique de la mauvaise science.

Parades :

- **Correction multi-tests** (Bonferroni, Benjamini-Hochberg — en S4). Si tu fais 20 tests, le seuil de significativité baisse d'autant.
- **Déclarer à l'avance** ce qu'on va tester.
- **Reproduire** sur un autre jeu de données avant de conclure.

## 6. L'erreur de type S et l'erreur de signe

Andrew Gelman a nommé ces erreurs pour les statistiques :

- **Erreur de type S** (*sign*) : tu conclus à un effet **positif** alors qu'il est négatif (ou l'inverse).
- **Erreur de type M** (*magnitude*) : tu conclus à un effet **énorme** alors qu'il est modeste, ou l'inverse.

Ces erreurs sont **fréquentes** quand l'effet réel est faible et que l'échantillon est petit. Dans ce régime, la puissance statistique est insuffisante pour mesurer l'effet proprement — mais elle n'empêche pas de tomber sur un résultat significatif par hasard, avec le mauvais signe ou une magnitude loufoque.

**Règle** : méfie-toi des **effets gigantesques** sur petit échantillon. Plus l'effet annoncé est fort par rapport à ce qu'on attendrait, plus il faut chercher l'erreur de méthode.

## 7. Le biais de publication interne

En entreprise, une version locale du biais de publication : **seules les analyses « utiles » remontent**. Les analyses qui ne trouvent rien sont oubliées, les tentatives ratées ne sont pas documentées.

Conséquence : ton entreprise croit avoir identifié les facteurs qui comptent — parce que seuls ceux-ci sont remontés. Les « non-facteurs » testés et écartés ne laissent pas de trace, mais leur absence biaise la vision collective.

Parade : **documenter les négatifs**. Un fichier `analyses_ratees.md` ou un ticket fermé avec conclusion « rien trouvé » vaut de l'or à long terme.

## 8. L'effet Hawthorne (rappel, chapitre 2)

Le simple fait d'être observé change le comportement. Même dans une expérience bien faite, si les participants **savent** qu'ils sont étudiés, ils changent.

Parades :

- **Mesure passive** quand possible (traces comportementales, capteurs) plutôt qu'auto-déclarations.
- **Étude de longue durée** — l'effet Hawthorne s'atténue avec le temps, les gens oublient qu'ils sont observés.
- **Étude discrète** — sans communication explicite de ce qui est mesuré (éthiquement acceptable si le principe général est connu et consenti).

## La meilleure défense : le scepticisme interne

Aucune parade ne rattrape un analyste qui ne **cherche pas** les biais. La compétence fondamentale :

**Avant de publier un résultat, passe 30 minutes à essayer de le démonter toi-même.**

- Est-ce que ce résultat pourrait être dû au hasard ? (petit N, test unique)
- Est-ce que ce résultat pourrait être dû à un confondeur oublié ?
- Est-ce que ce résultat dépend d'une fenêtre temporelle particulière ?
- Est-ce qu'il se reproduirait sur un autre sous-groupe ?
- Quels sont les deux ou trois scénarios qui, s'ils étaient vrais, invalideraient ma conclusion ?

Si tu n'as pas de réponse à la dernière question, **tu n'as pas fini**.

## Pourquoi ça vaut le coup

Tout ça peut sembler paranoïaque. Il ne l'est pas. Voici ce qui arrive quand un analyste **ne** fait **pas** ces contrôles :

- Des médicaments sans effet sont approuvés (plusieurs exemples historiques).
- Des politiques publiques sont déployées sur des effets qui n'existaient pas.
- Des modèles d'IA sont déployés en production avec des biais qu'on ne voit qu'après.
- Des rapports d'entreprise guident des décisions de millions d'euros sur des illusions statistiques.

Le **temps investi dans les contrôles** est toujours rentabilisé. L'analyste paresseux **paye plus cher** — en crédibilité perdue quand le résultat s'effondre.

## À retenir

- Même un bon protocole laisse passer des biais : **adhérence**, **attrition**, **attentes**, **confirmation**, **p-hacking**, **types S/M**, **biais de publication interne**, **Hawthorne**.
- **Intention-to-treat** > per-protocol en analyse principale.
- **Pré-enregistrement**, **peer review**, **adversarial collaboration** : les trois parades sociales.
- **Documenter les négatifs** pour ne pas recycler de fausses évidences.
- **Avant de publier, démonte ton propre résultat** : scénarios qui l'invalideraient.

---

> **La prochaine fois** : un mot sur la **crise de la réplication** en science — pourquoi même la science « officielle » est truffée de résultats fragiles, et ce que tu peux faire pour ne pas répéter l'erreur.
