# Une donnée n'est pas un fait

*Temps estimé : 15 minutes*

## Rappel

Sans regarder :

1. Pourquoi les pauses pendant un pomodoro sont-elles indispensables ?
2. Qu'est-ce qu'une « difficulté désirable » ?
3. Cite deux stratégies spécifiques pour un cerveau TDAH.

## Le mot « donnée » est piégé

En français comme en anglais (*data*, du latin *datum* — « ce qui est donné »), le mot suggère qu'une donnée est **quelque chose qu'on reçoit**. Comme si elle tombait du ciel, pure, neutre, déjà là.

Ce n'est presque jamais vrai.

Une donnée, c'est le résultat d'une **chaîne de décisions humaines** :

- Quelqu'un a décidé qu'il fallait mesurer **quelque chose**.
- Quelqu'un a décidé **comment** le mesurer.
- Quelqu'un a décidé **qui** ou **quoi** inclure, et qui ou quoi exclure.
- Quelqu'un a décidé du **format**, des unités, des catégories.
- Quelqu'un a réalisé la mesure — avec son attention, ses erreurs, ses raccourcis.
- Quelqu'un a stocké, transféré, peut-être agrégé ou nettoyé.

À chaque étape, des choix. Certains visibles, d'autres invisibles. **Certains défendables, d'autres discutables**. Une donnée n'est pas *donnée*, elle est **construite**.

Le nom latin *capta* (« ce qui est saisi ») serait plus honnête. Il ne s'est pas imposé. Le mot *datum* a gagné — et il est menteur.

## Un exemple : le chômage

Le « taux de chômage » en France. Il existe au moins **trois mesures différentes**, données par trois institutions :

- **Pôle emploi** : nombre d'inscrits en catégorie A (sans emploi, tenus de chercher).
- **Insee** : enquête Emploi, basée sur la définition du Bureau international du travail (BIT).
- **Eurostat** : standard européen, proche du BIT mais avec des différences méthodologiques.

Ces trois chiffres **ne mesurent pas la même chose**. Ils incluent et excluent des populations différentes. Ils donnent des pourcentages différents. Chacun est « vrai » — chacun répond à une question légèrement différente.

Un politique qui cite « le taux de chômage » sans préciser lequel fait, au choix :
- Une faute d'ignorance.
- Un choix stratégique (il prend celui qui l'arrange).

Toi, analyste, tu dois **toujours** savoir **quelle** mesure tu utilises et **pourquoi**.

## Un exemple plus insidieux : le « click »

Tu analyses les clics sur un bouton. Simple, non ? Un clic, c'est un clic.

Mais :

- Un double-clic compte pour **un** ou pour **deux** ?
- Un clic depuis un bot (script automatisé) compte-t-il ?
- Et un clic sur un lecteur qui accélère la page (Facebook, Twitter) ?
- Un clic suivi d'un retour immédiat (l'utilisateur voulait autre chose) ?
- Un clic enregistré par un navigateur qui précharge les pages (Chrome, Safari) ?
- Un clic qui n'est jamais arrivé au serveur (perte réseau) ?
- Un clic sur un appareil mobile vs desktop — même événement ?

Chaque réponse est un **choix méthodologique**. Deux équipes qui « comptent les clics » sans être alignées sur ces choix produisent des chiffres différents — parfois du double au simple. Et personne ne ment.

## La carte n'est pas le territoire

Le linguiste Alfred Korzybski a popularisé la formule :

> *La carte n'est pas le territoire, le mot n'est pas la chose.*

Appliqué à notre sujet : **la donnée n'est pas le phénomène**. C'est une carte qu'on a dressée du phénomène. Une carte utile, parfois précise — mais toujours partielle, toujours simplifiée, toujours filtrée par les choix de celui qui l'a dessinée.

Un bon analyste garde toujours cette distinction à l'esprit. Quand un chiffre dit quelque chose, la bonne question n'est pas « que dit le chiffre ? » mais :

> **Qu'est-ce qui a été mesuré exactement, par qui, comment, avec quelles exclusions, et à quelle fin ?**

## La donnée est toujours « pour quoi »

Une donnée est toujours collectée **pour une raison**. Cette raison modèle **ce qu'on mesure** et **ce qu'on ignore**.

- Un questionnaire RH mesure ce que l'entreprise veut savoir — pas nécessairement ce qui compte pour l'employé.
- Un dataset d'entraînement de modèle reflète ce que les humains ont voulu annoter — avec leurs biais.
- Des données de capteurs reflètent ce que le constructeur du capteur a décidé de rendre mesurable.

Quand tu reçois un dataset, demande-toi : **pour répondre à quelle question quelqu'un l'a-t-il construit ?** Si tu utilises la donnée pour une *autre* question, tu t'exposes à des angles morts que le dataset ne peut pas voir, parce qu'il n'a pas été fait pour ça.

## Conséquences pratiques pour l'analyste

1. **Toujours lire le data dictionary**. Pas de dictionnaire ? Tu travailles à l'aveugle. Demande-le.
2. **Connais la définition précise** de chaque champ. « Revenu » — brut ou net ? Annuel ou mensuel ? De qui ? Sur quelle période ?
3. **Sache quelles populations sont exclues** du dataset. Les exclus ne répondent pas à la requête. Ce n'est pas parce qu'on ne les voit pas qu'ils n'existent pas.
4. **Méfie-toi des mots de tous les jours** qui cachent des définitions techniques : « chômeur », « actif », « utilisateur », « ménage », « défaut »…
5. **Demande « qui a construit cette donnée et pour quoi ? »** avant de répondre à la question du commanditaire.

## À retenir

- Une donnée n'est pas « donnée », elle est **construite** par une chaîne de choix.
- « Le taux de chômage » ou « le nombre de clics » ne sont pas des nombres uniques : ce sont des familles de nombres.
- Toujours se demander : **quoi exactement, par qui, pour quoi, avec quelles exclusions**.
- La carte n'est pas le territoire. Les chiffres non plus.

---

> **La prochaine fois** : comment classifier les types de données — et pourquoi cette classification détermine ce que tu as le droit de faire avec.
