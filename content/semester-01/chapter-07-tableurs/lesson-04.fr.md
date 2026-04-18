# Tableaux croisés dynamiques

*Temps estimé : 15 minutes*

## Rappel

Sans regarder :

1. Quelle fonction somme seulement les cellules respectant plusieurs critères ?
2. Pourquoi préférer XLOOKUP à VLOOKUP ?
3. Comment calculer l'âge à partir d'une date de naissance en A2 ?

## L'outil le plus sous-estimé

Le **tableau croisé dynamique** (TCD) — *pivot table* en anglais — est probablement **l'outil d'analyse le plus puissant** d'un tableur. En 5 clics, tu transformes 10 000 lignes brutes en un tableau de synthèse prêt à présenter.

Malgré cette puissance, des analystes travaillent pendant des années sans jamais l'utiliser, et pondent à la main ce qu'un TCD aurait produit en 10 secondes. Après cette leçon, ce ne sera pas ton cas.

## Le principe

Un TCD fait **trois opérations** sur tes données, en même temps :

1. **Regrouper** par une ou plusieurs dimensions (par service, par mois, par catégorie…).
2. **Calculer** une agrégation sur une mesure (somme, moyenne, compte…).
3. **Afficher** le résultat sous forme de tableau, avec des totaux.

En SQL (S2), ça s'écrira `SELECT dimension, SUM(mesure) FROM table GROUP BY dimension`. En pandas (S3), `df.groupby("dimension").agg(...)`. Le TCD est la version visuelle.

## Exemple — partons d'INSEE

Imagine que tu télécharges de l'INSEE un tableau de 2 000 lignes — une ligne par commune avec `region`, `departement`, `population`, `revenu_median`, `taux_pauvrete`.

Question : **quelle est la population moyenne par région ?**

Sans TCD : tu trieras par région, tu feras des AVERAGEIFS pour chaque région, tu copieras les résultats dans un tableau. Une heure de travail.

Avec TCD : 5 clics, 30 secondes.

## Créer un TCD — étape par étape

### 1. Préparer les données

Pré-requis :

- **Une ligne = une observation**.
- **Une colonne = une variable** avec un nom en ligne 1 (l'en-tête).
- **Pas de cellules fusionnées**, pas de lignes vides au milieu.
- **Un type cohérent** par colonne (pas de texte dans une colonne de nombres).

Si ces règles sont respectées, ton dataset est dit « **propre** » ou *tidy*. C'est le format attendu de **tous** les outils d'analyse, pas juste des TCD.

### 2. Lancer le TCD

Clique n'importe où dans ta table. Puis :

- **Excel** : `Insertion → Tableau croisé dynamique` → OK.
- **LibreOffice Calc** : `Données → Tableau croisé dynamique → Insérer ou modifier`.
- **Google Sheets** : `Insertion → Tableau croisé dynamique`.

Excel te propose de placer le TCD sur une nouvelle feuille — **accepte**. (Cf. bonne pratique : séparer données et analyses.)

### 3. Configurer le TCD

Tu vois maintenant **une zone de tableau vide** et **un panneau à quatre zones** :

- **Lignes** (*Rows*) — dimensions qui forment les lignes du résumé.
- **Colonnes** (*Columns*) — dimensions en-tête.
- **Valeurs** (*Values*) — ce qu'on agrège (somme, moyenne…).
- **Filtres** — pour limiter les données considérées.

Tu **glisses-déposes** les colonnes de ta table vers ces zones.

### Pour notre question :

- `region` → **Lignes**.
- `population` → **Valeurs**. Excel propose `Somme` par défaut. Clique sur la flèche, choisis **Moyenne**.

Résultat en 10 secondes :

```
Région              Moyenne de population
Auvergne-Rhône-Alpes  47 200
Bretagne              38 500
...
Total général         45 000
```

### Pousser plus loin

- Ajoute `departement` sous `region` dans **Lignes** → le TCD devient hiérarchique, avec des sous-totaux par région.
- Ajoute `revenu_median` dans **Valeurs** avec agrégation **Moyenne** → deux mesures côte à côte.
- Mets `tranche_annee` en **Colonnes** → matrice 2D.
- Filtre sur les régions d'outre-mer seulement via **Filtres**.

Chaque action reconfigure le tableau en temps réel. **Explore**.

## Les agrégations disponibles

Par défaut, un TCD propose :

| Agrégation      | Que ça calcule                              |
| --------------- | ------------------------------------------- |
| Somme           | total                                       |
| Moyenne         | moyenne arithmétique                        |
| Compte          | nombre de cellules numériques               |
| Compte (valeurs)| nombre de cellules non-vides                |
| Maximum         | plus grande valeur                          |
| Minimum         | plus petite                                 |
| Produit         | multiplication de toutes les valeurs        |
| Écart-type      | dispersion                                  |
| Variance        | dispersion²                                 |

Pour changer : clique sur la flèche à côté de ta mesure dans **Valeurs** → *Paramètres des champs de valeurs*.

## Grouper une dimension

Tu as une colonne `date_achat` avec 365 valeurs distinctes (une par jour). Un TCD par `date_achat` te donne 365 lignes — inutile.

Solution : **grouper** la dimension.

- Clic droit sur une date dans le TCD → `Grouper` → choisir `Mois` et/ou `Année` et/ou `Trimestre`.
- Pour une variable numérique continue : `Grouper` → définir les bornes et le pas (ex : revenus par tranches de 10 000 €).

Le TCD **segmente** ainsi la donnée en intervalles, ce qui la rend lisible.

## Le pourcentage du total

Une mesure très utilisée : **la part de chaque ligne dans le total**.

- Dans *Paramètres des champs de valeurs* → onglet *Afficher les valeurs* → choisir `% du total général` ou `% du total de la ligne/colonne`.

Exemple : TCD avec `region` en Lignes et `population` en Valeur. Au lieu d'afficher les valeurs absolues, tu affiches le pourcentage de la population totale par région — très parlant pour un rapport.

## Le champ calculé

Tu veux une **mesure qui n'existe pas** dans tes données ?

- Excel : `Analyse de tableau croisé dynamique → Champs → Champ calculé`.
- Exemple : `densite = population / superficie`. Le TCD affiche alors la densité moyenne, calculée *après* agrégation.

**Attention** : les champs calculés ne sont **pas** évalués ligne par ligne puis moyennés — ils sont calculés à partir des agrégats (ici `Moyenne(population) / Moyenne(superficie)`), ce qui peut donner un résultat différent de la vraie densité moyenne (qui serait `Moyenne(population / superficie)`).

Règle : pour les ratios et les variables dérivées, **calcule la variable dans la donnée brute** avant le TCD, quand c'est possible. Mets `densite` comme une colonne dans la feuille `donnees`, et tu peux alors l'agréger proprement.

## Actualiser et pérenniser

Si tes données changent (lignes ajoutées, valeurs corrigées), **le TCD ne se met pas à jour automatiquement**. Il faut :

- Clic droit sur le TCD → `Actualiser`.
- Ou `Ctrl + Alt + F5` pour tout actualiser.

Si la **zone** de la table change (nouvelles colonnes, nouvelles lignes en dehors de la zone initiale), il faut redéfinir la source via *Changer la source de données*. **C'est pour ça** que convertir tes données en Table (`Ctrl + T`) avant de créer le TCD est un réflexe d'or : la Table s'étend dynamiquement, et le TCD suit.

## Slicers et chronologies (bonus)

Pour un rapport interactif :

- **Slicer** (segment) — un bouton filtrable, visuel. `Insertion → Segment`.
- **Chronologie** (*timeline*) — un slicer de dates. `Insertion → Chronologie`.

Ces éléments permettent à un lecteur (collègue, manager) de filtrer le TCD sans savoir utiliser les menus. Utile pour construire un mini-dashboard.

## Les pièges classiques

### Le TCD ne voit pas mes nouvelles lignes

Cause : la source n'est pas une Table. Solution : `Ctrl+T` avant de créer le TCD.

### Le TCD affiche « (vide) »

Cause : des cellules vides dans une dimension. Soit tu as des manquants, soit des lignes vides de plus dans ta zone source. Va voir.

### Des doublons apparaissent (« Paris » et « paris »)

Cause : incohérence de format / casse. Les TCD sont **sensibles à la casse** et aux espaces invisibles. Nettoie avant avec `TRIM`, `UPPER` / `LOWER`.

### Moyenne qui paraît fausse

Cause : le TCD calcule la moyenne des valeurs **numériques** seulement. Des vides ou des textes dans la colonne sont ignorés. Vérifie le `Compte` pour comprendre combien de lignes contribuent réellement.

### Champ calculé qui donne un résultat surprenant

Cause : cf. note plus haut — l'agrégation se fait **après**, pas avant. Pour les ratios, crée la colonne dans la donnée source.

## À retenir

- Le TCD regroupe, agrège, affiche — en quelques clics.
- **4 zones** : Lignes, Colonnes, Valeurs, Filtres. Glisse-dépose les colonnes dedans.
- **Moyenne, somme, compte, % du total** sont les quatre agrégations qui couvrent 95 % des cas.
- Convertis ta source en **Table** (`Ctrl+T`) avant, pour qu'elle s'étende dynamiquement.
- Pour les ratios / variables dérivées, **calcule-les dans la donnée brute**, pas en champ calculé.
- **Actualise** après modification des données.

---

> **La prochaine fois** : les **graphiques** — comment bien les faire, et les **pièges** les plus fréquents (axes tronqués, 3D trompeuse, choix de type inadapté). Parce qu'un bon TCD mérite un bon visuel.
