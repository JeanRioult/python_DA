# Pourquoi les tableurs (même à l'époque de Python)

*Temps estimé : 15 minutes*

## Rappel

Sans regarder :

1. Comment déboguer une *traceback* Python efficacement ?
2. Pourquoi `b = a` ne copie-t-il pas une liste ?
3. Quand utiliser `try/except` — et quand ne pas l'utiliser ?

## Le tableur est partout

Tu viens d'apprendre Python — et tu as raison d'investir dedans, c'est l'outil principal de l'analyste moderne. Mais il serait **absurde** d'ignorer les tableurs. Voici les faits :

- **Plus d'un milliard** d'utilisateurs Excel / Google Sheets / LibreOffice Calc dans le monde.
- **Chaque entreprise**, chaque administration, chaque association en utilise.
- C'est l'outil **universel de partage** de données tabulaires : un fichier `.xlsx` ou `.csv` est le format d'échange de facto.
- Un collègue non-technique ne peut **pas** ouvrir ton notebook Python ; il peut ouvrir un fichier Excel.
- Pour des analyses rapides (< 100 000 lignes, quelques colonnes), un tableur est **plus rapide** que Python, de la mise en page à la diffusion.

**Un analyste qui refuse les tableurs se coupe de la moitié du monde.** Ce chapitre te rend fluide dans Excel / Calc / Sheets — vocabulaire identique, syntaxe des formules quasi-identique.

## Python OU tableur ? Les deux, selon le cas

Voici une grille honnête pour choisir :

| Cas                                               | Outil recommandé          |
| ------------------------------------------------- | ------------------------- |
| Moins de 10 000 lignes, analyse ponctuelle        | Tableur                   |
| Partager avec des non-techniques                  | Tableur                   |
| Dashboard exécutif rapide                         | Tableur (ou Power BI)     |
| Calcul visible et manipulable à la main           | Tableur                   |
| > 100 000 lignes                                  | Python (ou SQL)           |
| Reproductibilité critique (même résultat à chaque fois) | Python                |
| Opérations complexes, statistiques avancées       | Python                    |
| Automatisation récurrente                          | Python                    |
| Collaboration sur le code                          | Python (versionable avec Git) |
| Travail avec des sources multiples                | Python                    |

**Règle pratique** : exploration / découverte → tableur ; modèle / production → Python. Beaucoup d'analystes **commencent en tableur** pour comprendre la donnée, **finissent en Python** pour industrialiser.

## Excel vs LibreOffice Calc vs Google Sheets

Les trois principaux tableurs du moment :

- **Excel** (Microsoft) — standard du marché, le plus puissant, payant (sauf Excel en ligne gratuit limité).
- **LibreOffice Calc** — libre, gratuit, très capable, légèrement en retrait sur les fonctions les plus récentes.
- **Google Sheets** — cloud, collaboratif en temps réel, un peu moins puissant que Excel pour les gros fichiers mais excellent pour le travail en équipe.

**Bonne nouvelle** : les trois ont **la même logique**, les mêmes références (`A1`, `B5`), et la plupart des formules portent le même nom. Ce que tu apprends en Excel tourne à 95 % en Calc et Sheets — avec parfois quelques ajustements de noms (`SIERREUR` vs `IFERROR` selon la langue) ou de disponibilité.

Pour ce chapitre, j'utiliserai les **noms anglais** (qui sont les plus portables) et je mentionnerai les équivalents français d'Excel quand ils diffèrent.

## La grille — anatomie d'un classeur

Un fichier tableur (**classeur**, *workbook*) contient une ou plusieurs **feuilles** (*sheets*). Chaque feuille est une grille de **cellules**.

- Les **colonnes** sont lettrées : A, B, C, …, Z, AA, AB, … jusqu'à XFD (16 384 colonnes en Excel moderne).
- Les **lignes** sont numérotées : 1, 2, 3, …, jusqu'à 1 048 576 en Excel moderne.
- Une **cellule** est désignée par sa colonne + sa ligne : `A1`, `C5`, `AZ100`.
- Une **plage** (*range*) est une rectangle de cellules : `A1:B10` (10 lignes × 2 colonnes).

Ça te donne un maximum de ~17 milliards de cellules par feuille. En pratique, un tableur devient lent au-delà de quelques millions de cellules ; au-delà, passe à un outil adapté (Python, SQL, Power BI).

## Types de contenu

Une cellule peut contenir :

- Un **nombre** (entier, décimal, pourcentage selon le format).
- Un **texte**.
- Une **date** (stockée comme un nombre : nombre de jours depuis une date de référence — attention aux formats).
- Un **booléen** (`TRUE`/`FAUX`).
- Une **formule** — commence par `=`. C'est là que ça devient intéressant.

## Trois bonnes habitudes dès le début

### 1. Les en-têtes en ligne 1

La première ligne contient les **noms des colonnes**. Ne saute pas cette étape, même pour une feuille jetable. Les en-têtes rendent les formules lisibles et les tableaux croisés dynamiques utilisables.

```
A              B         C           D
nom_employe    service   anciennete  salaire
Léa Dupont     RH        5           45000
Tom Martin     IT        2           38000
```

### 2. Une donnée par cellule

**Jamais** de « 45000 € (estimé) » dans une cellule numérique — tu casses les calculs. Sépare : une colonne `salaire` avec 45000, une colonne `note` avec « estimé ».

### 3. Pas de lignes ni colonnes vides au milieu des données

Les tableurs détectent une « table » comme une région contigüe. Une ligne vide casse cette détection et ruine les analyses. Si tu veux aérer : utilise plusieurs feuilles, pas des trous.

## Ce que tu vas apprendre dans ce chapitre

- **Leçon 2** — Les références et formules : `=A1+B1`, références absolues vs relatives.
- **Leçon 3** — Les fonctions essentielles : SOMME, MOYENNE, SI, RECHERCHEV / XLOOKUP.
- **Leçon 4** — Les tableaux croisés dynamiques : résumer des milliers de lignes en quelques clics.
- **Leçon 5** — Les graphiques et leurs pièges (manipulation visuelle, axes tronqués…).

À la fin du chapitre, tu auras de quoi analyser **la plupart** des datasets que tu croiseras — et tu sauras quand il faut passer à Python.

## Un conseil d'hygiène : sépare données et analyse

Une erreur courante chez les débutants : mettre les **données brutes** et les **analyses** (formules, graphiques, résumés) **dans la même feuille**. Résultat : quand les données changent, les formules cassent ; quand on veut partager, on partage tout ; quand on veut auditer, on ne sait plus ce qui est source et ce qui est calculé.

**Bonne pratique** :

- Feuille **`donnees`** (ou **`raw`**) : les données brutes, ne les modifie pas.
- Feuille **`analyses`** : formules, pivots, synthèses qui **pointent vers** `donnees`.
- Feuille **`graphiques`** : les visualisations pour le rapport final.

Cette séparation t'évitera des heures de galère quand ton dataset se met à jour.

## Sources de données d'exercice

Dans ce cours, je pointerai régulièrement vers l'**INSEE** (Institut national de la statistique et des études économiques) :

- **insee.fr/fr/statistiques** — toutes les statistiques publiées, par thème (population, emploi, revenus, entreprises…).
- Les fichiers sont téléchargeables en `.xlsx` ou `.csv`, prêts à être analysés.
- Exemples utiles pour commencer : démographie communale, revenus par département, créations d'entreprises, évolution des prix.

Utilise des **vraies données** dès que possible. Un dataset inventé ne te fait pas rencontrer les vrais problèmes (incohérences, manquants, cas bizarres) — et c'est précisément en rencontrant ces problèmes qu'on apprend.

## À retenir

- Les tableurs sont **partout** — les ignorer coupe d'une partie du métier.
- **Tableur** pour explorer et diffuser ; **Python** pour industrialiser et scaler.
- Excel, Calc, Sheets : **95 % de syntaxe commune**.
- Trois réflexes : en-têtes en ligne 1, une donnée par cellule, pas de trous.
- **Sépare** données brutes et analyses.

---

> **La prochaine fois** : comment les cellules communiquent entre elles via des **références**, et pourquoi la différence entre une référence *relative* et *absolue* sauvera ta vie.
