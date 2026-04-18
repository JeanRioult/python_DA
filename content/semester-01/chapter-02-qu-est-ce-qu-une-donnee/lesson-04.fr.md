# Les biais de collecte

*Temps estimé : 15 minutes*

## Rappel

Sans regarder :

1. Quelle est la différence entre bruit et biais ?
2. Pourquoi « plus de données » ne corrige pas un biais ?
3. Cite trois défauts de qualité courants dans un dataset.

## L'erreur qu'on ne voit pas

Les défauts du dernier cours (manquants, doublons, formats) sont *visibles* dans la table : tu peux les détecter en regardant. Les biais de *collecte* sont plus insidieux — ils concernent ce qui n'est **pas** dans ta table.

Un biais de collecte dit : « mon échantillon ne représente pas ma population d'intérêt ». Le problème n'est pas les lignes qui sont là, c'est les lignes qui **manquent parce qu'elles n'ont jamais été collectées**.

Voici les sept à connaître.

## 1. Le biais de sélection

Ton échantillon n'est pas un tirage aléatoire de ta population. **Quelqu'un a choisi qui entre — implicitement ou explicitement**.

Exemple classique : tu sondes la satisfaction de tes clients via un questionnaire envoyé par e-mail. Ceux qui répondent sont ceux qui **ouvrent tes e-mails**. Qui ouvre tes e-mails ? Les gens engagés — pas les clients insatisfaits qui t'ignorent. Ta satisfaction mesurée sera **surestimée**.

Autre exemple : tu évalues l'efficacité d'un traitement médical à partir des patients qui sont revenus pour un contrôle. Ceux qui ne sont pas revenus — morts, mécontents, guéris trop tôt — ne sont pas dans ton dataset. Tes conclusions ne valent que pour les *revenants*.

**Règle** : avant de conclure sur une population, demande-toi *comment* cette population est arrivée dans le dataset. Qui a été filtré en amont ?

## 2. Le biais du survivant

Cas particulier — fameux — du biais de sélection. Tu analyses seulement les cas qui ont « survécu » à un processus.

L'exemple historique : en 1943, l'US Navy veut blinder les avions de bombardiers. Elle étudie les impacts de balles sur les avions qui sont rentrés. Conclusion naïve : blinder là où il y a le plus d'impacts.

Le statisticien Abraham Wald dit l'inverse : **blindez là où il n'y a PAS d'impacts sur les rentrés**. Pourquoi ? Parce que les avions qui ont pris des balles à ces endroits-là **ne sont pas rentrés** — ils ne sont donc pas dans ton dataset. Les impacts que tu vois sont ceux qu'un avion peut encaisser et revenir.

Appliqué aujourd'hui :

- Étudier les entreprises qui réussissent pour « trouver la recette » — mais les entreprises *ratées*, qui avaient peut-être la même recette, ne sont pas dans ton panel.
- « J'ai appris à coder sans diplôme et j'ai un super boulot, donc c'est faisable pour tout le monde » — les autres qui ont essayé et n'y sont pas arrivés ne racontent pas leur histoire.

**Règle** : demande-toi toujours *qui manque* parce qu'ils n'ont pas survécu au processus qui a produit le dataset.

## 3. Le biais de non-réponse

Lié au biais de sélection, mais spécifique aux enquêtes. Ceux qui répondent à un sondage diffèrent systématiquement de ceux qui ne répondent pas.

- Les non-répondants sont souvent plus occupés, moins intéressés, ou plus méfiants.
- Sur des sujets sensibles (revenu, opinions politiques), les non-réponses ne sont **pas aléatoires** — elles concentrent des profils spécifiques.

Solution partielle : **pondération** des répondants par des variables démographiques (redonner du poids aux groupes sous-représentés). Ça aide mais ça ne supprime pas le biais — les pondérateurs supposent que les non-répondants d'un groupe pensent comme les répondants du même groupe. Ce n'est pas garanti.

## 4. Le biais de désirabilité sociale

Les gens mentent — surtout dans des sondages, surtout sur des sujets où une réponse est jugée « bonne » socialement.

- Alcool, drogues : sous-déclarés.
- Activité physique, générosité, habitudes saines : sur-déclarées.
- Opinions « inacceptables » (racisme, extrême-droite) : très sous-déclarées, d'où les surprises électorales.

Solutions : questions indirectes, questionnaires anonymes, techniques de *randomized response*, triangulation avec des données de comportement (cartes de paiement, capteurs).

## 5. Le biais de l'observateur (Hawthorne)

Le simple fait de **mesurer** modifie ce qu'on mesure. L'effet Hawthorne tire son nom d'expériences menées dans l'usine Hawthorne de Western Electric dans les années 1920 : chaque changement des conditions de travail augmentait la productivité — y compris revenir aux conditions initiales. Ce qui changeait la productivité, c'était **le fait d'être observé**.

Appliqué :

- Des employés qui savent qu'ils sont chronométrés travaillent plus vite (pas forcément mieux).
- Des utilisateurs qui savent qu'ils sont dans un panel A/B peuvent modifier leur comportement.
- Des enfants qui savent qu'on mesure leur sommeil dorment différemment.

Solutions : **mesure passive** quand c'est possible (capteurs, traces de comportement), **pas d'annonce** de ce qui est mesuré spécifiquement (éthique-compatible si l'objet d'étude général est communiqué), **aveugle** quand c'est applicable.

## 6. Le biais de confirmation (pour l'analyste)

Pas dans la donnée, mais dans **toi**. Tu arrives avec une hypothèse et tu cherches (inconsciemment) les chiffres qui la confirment, en ignorant ceux qui la contredisent.

Symptômes :

- Tu t'arrêtes dès que tu as une analyse qui va dans ton sens.
- Tu explores davantage les pistes « intéressantes » (= celles qui confirment).
- Tu considères les contre-exemples comme « des cas particuliers ».

Contre-mesures :

- **Pré-enregistrer** ton analyse : écris *avant* de regarder les données ce que tu comptes faire et quel résultat invaliderait ton hypothèse.
- **Chercher explicitement la falsification** : pose-toi « qu'est-ce qui, dans les données, me prouverait que j'ai tort ? » — et va le chercher.
- **Peer review** : fais relire par quelqu'un qui n'est pas investi.

## 7. Le biais de publication (méta-niveau)

Tu consomme des résultats d'études (recherche scientifique, rapports d'entreprise). Les études qui ne trouvent **rien** sont rarement publiées. Tu ne vois que les résultats positifs.

Conséquence : si 20 équipes testent un traitement inefficace, une d'entre elles trouvera par hasard un résultat « significatif à p<0.05 » (c'est la définition de 5 %). Cette étude sera publiée. Les 19 autres seront rangées dans un tiroir. Un lecteur ne verra que la publiée et croira à l'efficacité.

Quand tu cites une littérature, **demande-toi combien d'études négatives tu ne vois pas**. Des méta-analyses sérieuses font du *funnel plot* pour détecter ce biais — c'est un métier. Minimum pour toi : méfie-toi d'un résultat unique, préfère les résultats *répliqués*.

## Simpson : quand le tout contredit les parties

Pas un biais de collecte stricto sensu, mais un piège lié. Un exemple célèbre (Berkeley, 1973) :

- Université accepte 44 % des candidats hommes, 35 % des candidates femmes. Biais ?
- Département par département, chaque département accepte **plus** de femmes que d'hommes.

Les deux sont vrais. L'explication : les femmes candidatent plus souvent à des départements très sélectifs (faible taux d'admission global), les hommes à des départements peu sélectifs. L'effet global s'inverse par rapport à l'effet départemental.

Moralité : **l'agrégation peut renverser le signe**. Toujours segmenter par variable pertinente avant de conclure sur un effet global.

## À retenir

- Les biais de collecte concernent ce qui **manque** dans ton dataset, pas ce qui s'y trouve.
- Sept à connaître : **sélection, survivant, non-réponse, désirabilité sociale, observateur, confirmation, publication**.
- Le paradoxe de Simpson : un effet global peut s'inverser quand on segmente.
- **Qui n'est pas dans ma donnée ?** est souvent la question la plus puissante.

---

> **La prochaine fois** : synthèse pratique. Une check-list à appliquer *à chaque fois* que tu reçois un nouveau dataset.
