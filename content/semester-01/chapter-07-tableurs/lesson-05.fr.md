# Graphiques et leurs pièges

*Temps estimé : 15 minutes*

## Rappel

Sans regarder :

1. Quelles sont les 4 zones d'un TCD ?
2. Pourquoi convertir ses données en **Table** avant de créer un TCD ?
3. Quel piège se cache derrière un **champ calculé** pour un ratio ?

## Un graphique n'est pas un ornement

Un graphique est un **acte de communication**. Bien fait, il éclaire. Mal fait, il trompe — parfois volontairement, souvent par négligence.

Pour un analyste, produire des graphiques de qualité est aussi important que produire des chiffres justes. Un rapport avec un graphique malhonnête *ruine* la crédibilité de toute l'analyse qui l'entoure.

Cette leçon te donne trois choses :

1. Comment **choisir** le bon type de graphique pour une question.
2. Comment **bien le faire** mécaniquement dans un tableur.
3. Comment **reconnaître et éviter** les pièges trompeurs.

## Choisir le bon type

La question-mère : **quelle est la question à laquelle le graphique répond ?**

| Question                                                  | Type de graphique                       |
| --------------------------------------------------------- | --------------------------------------- |
| Comparer des catégories (valeurs absolues)                | Barres / colonnes                       |
| Évolution dans le temps                                   | Courbe (*line chart*)                   |
| Parts d'un tout                                           | Barres empilées, rarement camembert     |
| Distribution d'une variable                               | Histogramme, boîte à moustaches         |
| Relation entre deux variables                             | Nuage de points (*scatter*)             |
| Matrice de corrélations                                   | Heatmap                                 |
| Flux entre catégories                                     | Sankey (hors tableur)                   |
| Données géographiques                                     | Carte (si l'outil le supporte)          |

Ces conventions ne sont pas rigides, mais elles reflètent **ce que le cerveau humain décode le mieux** pour chaque question.

## Les types à éviter (la plupart du temps)

### Le camembert (*pie chart*)

Problème : l'œil humain compare **mal** les angles et les surfaces. Avec plus de 3-4 tranches, l'information devient illisible. Une barre horizontale triée par valeur fait mieux presque toujours.

Quand le camembert est **acceptable** : 2 ou 3 parts clairement différentes, pour un public non-technique qui attend cette forme.

### La 3D

**Évite toute 3D.** Les barres 3D, camemberts 3D, surfaces 3D déforment la lecture (la profondeur cache ou grossit les valeurs). Excel propose ces styles — ne les utilise pas, même quand ça « fait plus joli ». La sobriété est un choix professionnel.

### Le nuage de points sans tendance claire

Si tu mets un nuage de points et que le lecteur ne voit **aucune** tendance, c'est un non-graphique. Soit tu annotes l'absence de relation comme conclusion, soit tu ne le mets pas.

## Créer un graphique proprement

Dans un tableur :

1. **Sélectionne les données** (y compris les en-têtes de colonnes).
2. **`Insertion → Graphique`** (Excel) ou équivalent.
3. Choisis le type. Excel te propose souvent un *recommendation* — utilisable mais toujours **à relire**.
4. **Édite les éléments** : titre, axes, légende, source, annotations.

Les éléments **obligatoires** d'un graphique publiable :

- **Titre** qui donne le message (pas juste le sujet).
- **Axes étiquetés** avec nom et **unité**.
- **Source des données** (en petits caractères, en bas).
- **Date** si les données sont datées.
- **Échelle explicite** (pas de mystère).

Règle : **si tu dois expliquer ton graphique à l'oral**, c'est qu'il lui manque des éléments visuels.

## Les huit pièges les plus fréquents

### 1. L'axe tronqué

Un graphique en barres dont l'axe Y ne commence **pas à zéro** exagère visuellement les différences.

- Données : A = 100, B = 105.
- Axe à zéro : les deux barres sont quasi-identiques. **Véridique**.
- Axe tronqué à 95 : A fait 1 unité de haut, B en fait 10. **5 % de différence affichée comme 10× plus haute**.

**Règle** : pour des barres, l'axe Y doit **toujours commencer à zéro**. Pour une courbe, tronquer est acceptable si tu l'indiques clairement (brisure d'axe dessinée, annotation). Ne tronque jamais pour exagérer.

### 2. La 3D qui déforme

Cf. plus haut. Bannir.

### 3. Les échelles incohérentes

Deux graphiques côte à côte avec des échelles Y différentes → la comparaison visuelle est fausse. Tu dois soit uniformiser, soit **annoter** explicitement.

### 4. Le camembert de trop

Cf. plus haut. Remplacer par des barres horizontales dès qu'il y a > 3 tranches ou des valeurs proches.

### 5. La ligne tendance mensongère

Tracer une droite de tendance sur 4 points et prétendre à une loi. **Anscombe** (chapitre 4 leçon 5) a montré que la même tendance peut cacher des réalités très différentes. Une droite de tendance **doit** s'accompagner du nuage de points, et d'un minimum d'observations (une vingtaine est un plancher raisonnable).

### 6. Le choix de période biaisé (*cherry picking*)

Tu as 20 ans de données, tu choisis les 3 ans qui vont dans ton sens. Classique en communication politique et marketing. **Justifie toujours la période montrée** et, si possible, montre le contexte plus large en sur-impression.

### 7. Le double axe Y trompeur

Un graphique avec **deux axes Y** (un à gauche, un à droite) peut masquer que deux séries qui « bougent ensemble » ne sont pas corrélées — leurs échelles choisies manuellement peuvent les faire paraître synchrones.

Utilise avec extrême prudence. Souvent, **deux graphiques** empilés sont plus honnêtes.

### 8. Le choix de couleurs arbitraire

Rouge/vert pour exprimer « mauvais/bon » est **culturel** (pas universel), et **inaccessible** pour 8 % des hommes daltoniens. Préfère des palettes **colorblind-friendly** (bleu/orange, viridis). Réserve le rouge vif pour alerter, jamais comme couleur décorative.

## Bonnes pratiques de présentation

### Le titre qui dit le message

- Faible : `Ventes par mois`.
- Fort : `Les ventes ont doublé au premier semestre 2026`.

Le **titre doit contenir la conclusion**, pas juste le sujet. Le corps du graphique prouve la conclusion. Cette approche vient du journalisme et du conseil — elle fait passer ton message en 2 secondes au lieu de 20.

### Moins est plus

Enlève :

- Les grilles qui distraient.
- Les légendes redondantes avec les étiquettes.
- Les bordures autour du graphique.
- Les effets d'ombre.
- Les dégradés de couleurs sans signification.

Edward Tufte, théoricien de la visualisation, parle de **ratio donnée/encre** : la proportion des pixels qui portent de l'information. Maximise ce ratio.

### Les annotations directes

Étiquette la valeur importante **directement sur** le graphique plutôt qu'en légende. Le lecteur n'a pas à faire d'aller-retour.

### Trier les catégories

Pour un graphique de barres catégorielles : **trie par valeur**, pas par ordre alphabétique (sauf cas particulier). Un tri par valeur révèle la hiérarchie instantanément.

Exception : les dimensions **naturellement ordonnées** (mois, trimestres, tranches d'âge) doivent rester dans leur ordre naturel.

## L'échelle logarithmique

Quand les valeurs couvrent plusieurs ordres de grandeur (ex : revenus dans un pays, du SMIC à des milliardaires), une échelle log met tout le monde sur un même plan visuel.

- **Échelle linéaire** : les milliardaires écrasent tout, les SMIC sont invisibles.
- **Échelle logarithmique** : on voit la distribution sur toute la plage.

Utilise log quand c'est pertinent, et **mentionne-le clairement** dans le graphique. Un public non-averti peut être surpris — annotation obligatoire.

## Dashboards — principe général (survol)

Un *dashboard* est un ensemble cohérent de graphiques qui répond à **une** question ou surveille **un** processus. Règles minimales :

- **Une seule question / métrique principale** par dashboard.
- **Hiérarchie visuelle** : le chiffre clé en gros, les détails en petit.
- **Contexte temporel** : éviter les chiffres isolés sans comparaison (année précédente, moyenne, cible).
- **Couleurs cohérentes** entre graphiques pour les mêmes catégories.

On approfondira en S8 (« Influence »). Pour un S1, retiens : un bon dashboard **se lit en 10 secondes** pour l'essentiel.

## À retenir

- **Choisir** le bon type selon la question (comparer, évoluer, distribuer, relier…).
- **Barres** : axe Y à zéro. **Courbes** : troncation seulement si annotée.
- **Éviter** camemberts (> 3 tranches), 3D, double axe Y, couleurs non-accessibles.
- **Titre** = message (pas juste sujet). **Sources et unités** obligatoires.
- Trier par valeur (sauf ordre naturel).
- Maximiser le **ratio donnée/encre** (Tufte).

---

> **Fin du chapitre 7.** Tu as les outils mécaniques et visuels du tableur — de la formule au TCD au graphique. Avec Python + tableurs + logique + maths, tu as l'essentiel de la **boîte à outils** d'un analyste débutant.
>
> **Prochain chapitre** : une compétence qui vaut plus qu'on ne le croit — **bien écrire**. Parce qu'un bon chiffre mal raconté est un chiffre invisible.
