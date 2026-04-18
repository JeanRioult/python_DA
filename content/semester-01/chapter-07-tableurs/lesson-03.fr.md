# Fonctions essentielles et lookups

*Temps estimé : 15 minutes*

## Rappel

Sans regarder :

1. Quelle est la différence entre `A1` et `$A$1` ?
2. Que fait `SIERREUR(formule; valeur_si_erreur)` ?
3. Pourquoi vaut-il mieux convertir une zone en **Table** qu'écrire `A2:A100` ?

## Les fonctions fondamentales

Dans ce cours, je donne les noms **anglais** (portables) et signale la version française Excel entre parenthèses quand elle diffère.

### Agrégations numériques

```
SUM(plage)         (SOMME)        somme
AVERAGE(plage)     (MOYENNE)      moyenne arithmétique
MEDIAN(plage)      (MEDIANE)      médiane
MIN(plage)         (MIN)          minimum
MAX(plage)         (MAX)          maximum
COUNT(plage)       (NB)           nombre de cellules numériques
COUNTA(plage)      (NBVAL)        nombre de cellules non-vides
STDEV(plage)       (ECARTYPE)     écart-type (échantillon)
```

Exemple :

```
=AVERAGE(B2:B100)           moyenne de la colonne B
=COUNTA(A2:A100)            combien de lignes non-vides
```

### Agrégations conditionnelles (avec filtre)

Version `...IF` : agrège seulement les cellules qui respectent un critère.

```
SUMIF(plage_critere; critere; plage_somme)       (SOMME.SI)
COUNTIF(plage; critere)                           (NB.SI)
AVERAGEIF(plage_critere; critere; plage_moyenne) (MOYENNE.SI)
```

Exemple : sur une feuille d'employés avec `C` = service et `D` = salaire :

```
=SUMIF(C2:C100; "RH"; D2:D100)       → total des salaires du service RH
=COUNTIF(C2:C100; "RH")              → nombre d'employés du RH
=AVERAGEIF(C2:C100; "RH"; D2:D100)   → salaire moyen du RH
```

Version à plusieurs critères : `SUMIFS`, `COUNTIFS`, `AVERAGEIFS` — beaucoup plus puissantes et donc plus importantes à connaître.

```
=SUMIFS(
    D2:D100;           ← plage à sommer
    C2:C100; "RH";     ← critère 1 : service
    E2:E100; ">5"      ← critère 2 : ancienneté > 5 ans
)
```

Cette formule donne **le total des salaires des RH avec plus de 5 ans d'ancienneté**.

### Conditions

```
IF(test; valeur_si_vrai; valeur_si_faux)                  (SI)
IF(AND(t1; t2); ...)                                      (ET)
IF(OR(t1; t2); ...)                                       (OU)
IFS(t1; v1; t2; v2; ...; TRUE; v_par_defaut)              (SI.CONDITIONS)
```

Exemple : catégoriser un revenu.

```
=IF(A2<20000; "bas";
   IF(A2<50000; "moyen"; "élevé"))
```

Équivalent plus lisible avec `IFS` (Excel 2019+) :

```
=IFS(A2<20000; "bas";
     A2<50000; "moyen";
     TRUE; "élevé")
```

Le `TRUE` final est le cas par défaut (toujours vrai). Pattern à retenir.

## Les lookups — chercher dans une table

**Le travail le plus fréquent d'un analyste tableurs** : tu as deux feuilles, tu veux **rapprocher** des informations. Exemple :

- Feuille **`ventes`** : id_produit, quantité, date.
- Feuille **`produits`** : id_produit, nom, prix, catégorie.
- Tu veux ajouter à `ventes` le nom du produit et le montant total.

C'est un *lookup* — chercher une valeur dans une table et rapporter une info correspondante.

### `VLOOKUP` / `RECHERCHEV` — l'historique

Signature :

```
VLOOKUP(
    valeur_cherchée;
    table_où_chercher;
    numéro_de_colonne_à_renvoyer;
    correspondance_approximative    ← mettre FALSE / FAUX
)
```

Exemple : dans la feuille `ventes`, cellule E2 où tu veux le nom du produit :

```
=VLOOKUP(A2; produits!A:D; 2; FALSE)
```

Traduction : « cherche la valeur de A2 (id_produit) dans la **première colonne** de `produits!A:D`, et quand tu la trouves, renvoie la valeur de la **2e** colonne (nom) ; correspondance exacte ».

**Pièges de VLOOKUP** :

1. **Cherche toujours dans la PREMIÈRE colonne** de la table. Si `id` n'est pas en colonne A, tu dois réarranger ou utiliser une autre fonction.
2. **Toujours mettre `FALSE`** pour le dernier argument. Le défaut `TRUE` est la correspondance *approximative* — source infinie de bugs silencieux.
3. Si la valeur n'est pas trouvée, renvoie `#N/A`. Toujours envelopper dans `SIERREUR`.
4. Lent sur de grosses tables.

### `XLOOKUP` — le successeur moderne

Excel 2021, Microsoft 365, Sheets, LibreOffice récent : `XLOOKUP` remplace `VLOOKUP` et résout ses défauts.

```
XLOOKUP(
    valeur_cherchée;
    plage_de_recherche;
    plage_de_retour;
    valeur_si_absent          ← optionnel, remplace SIERREUR
)
```

Même exemple :

```
=XLOOKUP(A2; produits!A:A; produits!B:B; "non trouvé")
```

Avantages :

- Les plages de recherche et de retour sont **indépendantes** (plus besoin que la clé soit en première colonne).
- Le cas « non trouvé » est intégré — plus besoin de `SIERREUR`.
- Marche aussi de droite à gauche.
- Plus rapide.

**Utilise XLOOKUP dès que ton Excel / tableur le supporte.** Si tu es bloqué·e en version ancienne, VLOOKUP marche, avec plus de prudence.

### `INDEX` / `MATCH` — la combinaison historique

Avant XLOOKUP, les utilisateurs avancés combinaient `INDEX` et `MATCH` (EQUIV) :

```
=INDEX(colonne_à_retourner; MATCH(valeur; colonne_de_recherche; 0))
```

Plus flexible que VLOOKUP, plus verbeux que XLOOKUP. Utile à connaître pour lire du code existant, mais XLOOKUP est recommandé en nouveau code.

## Fonctions de texte

```
LEN(texte)                    (NBCAR)            longueur
UPPER(texte)                  (MAJUSCULE)        en majuscules
LOWER(texte)                  (MINUSCULE)        en minuscules
TRIM(texte)                   (SUPPRESPACE)      enlève les espaces superflus
LEFT(texte; n)                (GAUCHE)           n premiers caractères
RIGHT(texte; n)               (DROITE)           n derniers
MID(texte; début; n)          (STXT)             sous-chaîne
CONCATENATE(a; b; c) ou a&b   (CONCATENER)       concaténation
SUBSTITUTE(texte; a; b)       (SUBSTITUE)        remplacer
SEARCH(trouver; dans_texte)   (CHERCHE)          position (insensible à la casse)
```

Exemple : extraire le nom de famille d'une colonne « Prénom Nom » :

```
=TRIM(RIGHT(A2; LEN(A2) - SEARCH(" "; A2)))
```

Traduction : cherche la position de l'espace ; prends tout après ; enlève les espaces parasites. Méthode fragile (et si deux prénoms ?) — mais illustre le pattern de *parsing* texte.

## Fonctions de date

```
TODAY()                       (AUJOURDHUI)       date du jour
NOW()                         (MAINTENANT)       date + heure
YEAR(date), MONTH(date), DAY(date)  (ANNEE/MOIS/JOUR)
WEEKDAY(date)                 (JOURSEM)          jour de la semaine (1=dim par défaut)
DATEDIF(d1; d2; "Y")          (DATEDIF)          différence en années
EOMONTH(date; n)              (FIN.MOIS)         fin du mois décalé de n mois
```

Calculer l'âge depuis une date de naissance en A2 :

```
=DATEDIF(A2; TODAY(); "Y")
```

Nombre de jours entre deux dates :

```
=B2 - A2
```

(Les dates étant des nombres sous le capot, la soustraction marche directement — si les deux cellules sont bien typées *date*.)

## Arrondir, grouper

```
ROUND(nombre; décimales)      (ARRONDI)
ROUNDUP(nombre; décimales)    (ARRONDI.SUP)
ROUNDDOWN(nombre; décimales)  (ARRONDI.INF)
MROUND(nombre; multiple)      (ARRONDI.AU.MULTIPLE)
```

Exemples :

```
=ROUND(12,345; 1)      → 12,3
=MROUND(147; 50)       → 150  (multiple le plus proche de 50)
```

## Stratégie de rédaction d'une formule complexe

Tu ne dois **pas** écrire d'emblée une formule à quatre fonctions imbriquées. Méthode :

1. **Décompose** en étapes dans des cellules intermédiaires :
   ```
   D2 : =VLOOKUP(...)            → nom du produit
   E2 : =D2 & " — " & UPPER(...) → mise en forme
   F2 : =SIERREUR(E2; "?")       → rattrape erreur
   ```
2. **Vérifie** que chaque étape donne ce que tu attends.
3. **Compacte** si tu veux, en imbriquant, **une fois** que tout marche.

Beaucoup d'analystes chevronnés gardent la version décomposée **pour la lisibilité**. C'est un choix valide — la compacité n'est pas toujours une vertu.

## À retenir

- Agrégations avec critères : **`SUMIFS`, `COUNTIFS`, `AVERAGEIFS`** — le trio qui remplace 90 % des boucles.
- `IF` imbriqué → préférer `IFS` si disponible.
- **XLOOKUP** > VLOOKUP > INDEX/MATCH. Utilise XLOOKUP si ton logiciel le supporte.
- Toujours mettre `FALSE` au dernier argument de VLOOKUP.
- Les dates sont des nombres ; les formats influencent l'affichage, pas le fond.
- **Décompose** une formule complexe en étapes avant de la compacter.

---

> **La prochaine fois** : comment résumer 10 000 lignes en un tableau en **cinq clics** — avec les **tableaux croisés dynamiques**. L'outil le plus magique du tableur.
