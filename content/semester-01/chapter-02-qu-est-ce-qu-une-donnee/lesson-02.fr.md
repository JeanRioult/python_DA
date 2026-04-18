# Types et niveaux de mesure

*Temps estimé : 15 minutes*

## Rappel

Sans regarder :

1. Pourquoi « donnée » est un mot trompeur ?
2. Donne deux raisons pour lesquelles deux équipes comptant « les clics » peuvent aboutir à des chiffres différents.
3. Que signifie « la carte n'est pas le territoire » pour un analyste ?

## Pourquoi classer les données ?

Pas toutes les opérations sont valides sur toutes les données. Calculer la **moyenne** des codes postaux de tes utilisateurs n'a aucun sens — bien que les codes postaux soient des « nombres ». Savoir classer une donnée te dit **ce que tu as le droit de faire avec**.

Le statisticien Stanley Smith Stevens a proposé en 1946 une classification en **quatre niveaux de mesure**. Elle est imparfaite (les statisticiens en débattent encore) mais c'est le langage partagé du métier. Apprends-la.

## Les quatre niveaux de Stevens

### 1. Nominal — des étiquettes

Valeurs sans ordre, sans distance. Juste des catégories.

- Exemples : sexe, couleur de cheveux, marque de voiture, pays, genre de film.
- Opérations valides : **compter**, tester l'égalité (`==`, `!=`).
- Opérations **invalides** : ordre (`<`, `>`), moyenne, soustraction, addition.

Piège : si on code « homme = 1, femme = 2, non-binaire = 3 » dans une base, les nombres **ressemblent** à des nombres. Mais faire `moyenne(sexe) = 1.7` n'a aucun sens.

### 2. Ordinal — des rangs

Valeurs qu'on peut **ordonner**, mais sans distance bien définie entre elles.

- Exemples : niveau de satisfaction (« très mauvais » → « très bon »), rangs d'arrivée (1er, 2e, 3e), niveau de diplôme.
- Opérations valides : compter, **ordonner** (`<`, `>`), médiane, quantiles.
- Opérations **discutables** : moyenne. Elle est souvent calculée dans la pratique (sondages), mais techniquement elle suppose que l'écart entre 2 et 3 est le même qu'entre 4 et 5 — ce qui est faux pour une échelle de Likert.
- Opérations **invalides** : soustraction qui aurait un sens (« 2e place − 5e place = 3 places »… 3 places de quoi ?).

Règle pratique : **médiane** est sûre, **moyenne** demande justification.

### 3. Intervalle — des distances, pas de zéro absolu

Valeurs où la **distance** entre deux points a un sens, mais où le **zéro est conventionnel** (pas un vrai « rien »).

- Exemples : température en °C ou °F, année calendaire, date de naissance.
- Opérations valides : ordre, moyenne, soustraction (différence).
- Opération **invalide** : rapport (multiplication / division). 20 °C n'est **pas** « deux fois plus chaud » que 10 °C — le zéro de Celsius est arbitraire (le point de congélation de l'eau à pression normale), pas un vrai zéro thermique.
- Le vrai zéro thermique, c'est **0 Kelvin**, et là les rapports fonctionnent.

### 4. Ratio — des distances ET un zéro absolu

Valeurs avec une distance et un **zéro qui signifie « absence »**.

- Exemples : âge, revenu, durée, masse, nombre de clics, température en Kelvin.
- Opérations valides : **tout**. Ordre, différences, **rapports** (« deux fois plus »), moyennes géométriques.

## Résumé sous forme de tableau

| Niveau     | Ordre ? | Distance a un sens ? | Zéro absolu ? | Exemple           |
| ---------- | ------- | -------------------- | ------------- | ----------------- |
| Nominal    | non     | non                  | N/A           | Pays              |
| Ordinal    | oui     | non                  | N/A           | Note « bien »     |
| Intervalle | oui     | oui                  | non           | Température (°C)  |
| Ratio      | oui     | oui                  | oui           | Revenu (€)        |

## Variables discrètes ou continues ?

Un axe **indépendant** de la classification Stevens :

- **Discrètes** — valeurs isolées. Nombre d'enfants (0, 1, 2…), nombre de clics. On compte.
- **Continues** — valeurs sur un continuum. Taille, temps, température. On mesure.

Une variable peut être ratio-discrète (nombre de clics : ratio *et* discret) ou ratio-continue (taille : ratio *et* continu). Les statistiques adaptées ne sont pas les mêmes.

## Qualitatif, quantitatif — et pourquoi c'est un peu flou

Tu entendras souvent :

- **Qualitatif** = nominal et ordinal (catégories, étiquettes).
- **Quantitatif** = intervalle et ratio (« vrais » nombres).

C'est utile comme raccourci, mais la frontière est molle. Une note de satisfaction 1–5 est **ordinale** (donc qualitative au sens strict) mais tout le monde la traite souvent comme quantitative. Ce n'est pas un crime — c'est une **convention qu'il faut justifier et dont il faut connaître les limites**.

## Conséquences pour les graphiques

Le niveau de mesure détermine la **représentation** adaptée :

| Niveau     | Graphiques adaptés                                           | À éviter              |
| ---------- | ------------------------------------------------------------ | --------------------- |
| Nominal    | Barres, camemberts (si peu de catégories), tableaux          | Courbes, histogrammes |
| Ordinal    | Barres (dans l'ordre), stacked bars, boîtes à moustaches     | Camemberts            |
| Intervalle | Histogrammes, courbes, nuages de points                      | Camemberts            |
| Ratio      | Histogrammes, courbes, nuages, box plots, échelles log       | Rien d'exclu          |

Une erreur fréquente : tracer une *courbe* reliant les barres d'une variable **nominale**. Ça suggère une progression qui n'existe pas.

## Conséquences pour les statistiques

| Niveau     | Centre          | Dispersion                         |
| ---------- | --------------- | ---------------------------------- |
| Nominal    | Mode            | Fréquences                         |
| Ordinal    | Mode, médiane   | Étendue, intervalles interquartiles |
| Intervalle | + Moyenne       | + Écart-type                       |
| Ratio      | + Moyenne géométrique | + Coefficient de variation        |

Une moyenne calculée sur du nominal est un non-sens. Une médiane sur de l'ordinal est correcte. Un écart-type sur du nominal est faux. Apprends à refuser.

## À retenir

- **Quatre niveaux** : nominal, ordinal, intervalle, ratio.
- Chaque niveau autorise **certaines** opérations, en interdit d'autres.
- Connaître le niveau d'une variable, c'est savoir **quelles questions sont légitimes**.
- Discret vs continu est un autre axe, indépendant.

---

> **La prochaine fois** : les sources d'erreur dans une mesure — bruit, biais, et pourquoi « plus de données » ne règle pas tout.
