# Cellules, références, formules

*Temps estimé : 15 minutes*

## Rappel

Sans regarder :

1. Quand préférer Python à un tableur et vice-versa ?
2. Quelles sont les trois bonnes habitudes d'organisation d'un tableur ?
3. Pourquoi séparer données brutes et analyses en feuilles distinctes ?

## Une formule commence par `=`

Toute cellule qui contient `=` au début est **une formule** — une expression calculée. Sans le `=`, c'est juste du texte.

```
A1 : 10
A2 : 5
A3 : =A1+A2        → affiche 15
```

Clique sur `A3` et tu verras la formule dans la **barre de formule** en haut ; la cellule affiche le **résultat**.

Principes :

- `+` addition, `-` soustraction, `*` multiplication, `/` division, `^` puissance.
- Parenthèses comme en maths : `=(A1+A2)*B1`.
- Priorité PEMDAS : puissances, puis ×/÷, puis +/−.
- `:` désigne une plage : `A1:A10` = de A1 à A10 inclus.

Exemple concret :

```
A1 : prix_ht = 100
A2 : taux_tva = 0,20
A3 : =A1*A2                 → 20 (la TVA)
A4 : =A1+A3                 → 120 (TTC)
A5 : =A1*(1+A2)             → 120 (équivalent en une étape)
```

## Références relatives vs absolues

**La notion à maîtriser absolument.**

Quand tu **copies** une formule d'une cellule à une autre, les références se **décalent** automatiquement. C'est souvent ce qu'on veut. Parfois, non.

### Relative : ce qui se décale

```
A1 : 10      B1 : 5      C1 : =A1+B1     → 15
A2 : 20      B2 : 7      C2 : (copie de C1)
```

Si tu copies `C1` vers `C2`, Excel écrit **automatiquement** `=A2+B2` dans C2. Il comprend que tu voulais « la somme de la colonne A et de la colonne B sur **la même ligne** ». C'est la référence **relative** : la formule est relative à sa position.

Résultat en C2 : `=A2+B2` → 27. **Pratique.**

### Absolue : ce qui reste fixe

Maintenant, imagine une colonne TVA :

```
A1 : taux_tva = 0,20
B2 : prix_ht 100       C2 : =B2*A1     → 20
B3 : prix_ht 200       C3 : (copie de C2)
B4 : prix_ht 300       C4 : (copie de C2)
```

Si tu copies C2 en C3, Excel écrit `=B3*A2`. **Mauvais** — A2 est vide ! Tu voulais dire : « B3 fois le taux qui est **toujours en A1** ».

Solution : **fige** la référence A1 en mettant des dollars `$` :

```
C2 : =B2*$A$1
C3 : (copie de C2)  → devient =B3*$A$1  ✓
C4 : (copie de C2)  → devient =B4*$A$1  ✓
```

Les `$` fixent la lettre et/ou le numéro. Trois formes possibles :

| Notation   | Ce qui reste fixe lors d'une copie |
| ---------- | ---------------------------------- |
| `A1`       | Rien (relative classique)          |
| `$A1`      | La colonne (ligne variable)        |
| `A$1`      | La ligne (colonne variable)        |
| `$A$1`     | La cellule entière (absolue)       |

**Astuce clavier** : en éditant une formule, sélectionne une référence et appuie **F4** pour cycler entre ces quatre modes.

## Nommer des plages

Une façon plus propre que `$A$1` : donner un **nom** à une cellule ou une plage.

- Sélectionne la cellule `A1`.
- Tape un nom dans la zone « nom » en haut à gauche : `taux_tva`.
- Appuie Entrée.

Désormais, tu peux écrire : `=B2*taux_tva`. C'est **nettement plus lisible** que `=B2*$A$1`, et ça se comporte comme une absolue.

Utilise des noms nommés pour **toutes** les constantes importantes de ton classeur. Quand le taux de TVA change, tu modifies UN endroit, et tout se recalcule.

## Formater proprement

Le **format** d'une cellule est une couche au-dessus de la valeur. La valeur reste la même ; ce qui change, c'est l'affichage.

Formats essentiels :

- **Nombre** — contrôle le nombre de décimales, le séparateur des milliers.
- **Pourcentage** — multiplie par 100 à l'affichage. `0,20` affiché `20%` ; sous-jacent reste `0,20`.
- **Devise** — `100` affiché `100,00 €` (selon la locale).
- **Date** — contrôle l'ordre `JJ/MM/AAAA` vs `AAAA-MM-JJ` vs `DD mon yyyy`.
- **Personnalisé** — tu peux tout inventer.

**Attention aux formats de date** : internationalement, tu retrouveras JJ/MM/AAAA (France), MM/JJ/AAAA (US), AAAA-MM-JJ (ISO 8601 — le seul qui ne trompe pas). Quand tu partages, préfère ISO.

## Le piège du format — la valeur n'est pas ce qu'on voit

Plusieurs bugs classiques viennent d'un format qui masque la vraie valeur :

- Une cellule affiche `20%` mais contient `0,2`. Si tu fais `=A1*100`, tu obtiens `20`, pas `2000`.
- Une cellule affiche `12 345,00` mais contient en réalité `12345,6789`. Ton addition précédente affiche `100,00` mais stocke `100,004` — qui se propage.
- Une cellule affiche `01/05/2025` mais contient en réalité le texte `"01/05/2025"` (pas une date). Les formules de date ne fonctionnent pas dessus.

**Pour voir la vraie valeur** : clique sur la cellule et regarde la barre de formule. Si c'est un nombre, il apparaît sans format.

## Saisir une plage dans une formule

Au lieu de taper `A1:A10` à la main, sélectionne la plage **avec la souris** pendant que tu tapes la formule — Excel insère la plage automatiquement. Plus rapide, moins d'erreurs.

Exemple typique :

```
=SOMME(A2:A100)        → somme des prix
=MOYENNE(B2:B100)      → moyenne des revenus
=MAX(C2:C100)          → plus grande valeur
=NB(D2:D100)           → nombre de cellules numériques
=NBVAL(D2:D100)        → nombre de cellules non-vides (Excel FR)
```

Équivalents anglais : `SUM`, `AVERAGE`, `MAX`, `COUNT`, `COUNTA`. Sheets / Calc utilisent les noms anglais par défaut.

## Les plages dynamiques (pour plus tard)

Une limite d'une formule comme `=SOMME(A2:A100)` : si tu ajoutes une ligne 101, elle n'est pas prise en compte.

Solutions :

- **Tables** (Insertion → Tableau, Ctrl+T) — Excel crée une zone qui s'étend automatiquement. Les formules qui y pointent se mettent à jour.
- **Références structurées** — une fois en mode Tableau, tu peux écrire `=SOMME(VentesTable[montant])` au lieu de `=SOMME(B2:B100)`.
- **Plages dynamiques manuelles** avec `DECALER` / `OFFSET` (technique plus avancée).

Transformer tes données brutes en **Table** dès la saisie est un excellent réflexe — tout ton classeur devient plus robuste.

## Erreurs courantes

Un tableur affiche un code d'erreur quand une formule casse :

- **`#REF!`** — référence détruite (souvent après une suppression de colonne).
- **`#VALUE!`** — mauvais type d'argument (ex : somme avec une cellule texte).
- **`#NAME?`** — nom de fonction inconnu (faute de frappe).
- **`#DIV/0!`** — division par zéro.
- **`#N/A`** — valeur non applicable (souvent d'un `RECHERCHEV` qui ne trouve rien).
- **`#NUM!`** — erreur numérique (ex : racine carrée d'un négatif).

Comme en Python, ces messages sont utiles. Lis-les plutôt que de les « contourner ».

## `SIERREUR` / `IFERROR` — rattraper proprement

Quand tu *sais* qu'une formule peut échouer (par exemple un RECHERCHEV qui peut ne rien trouver), enveloppe-la dans `SIERREUR` :

```
=SIERREUR(RECHERCHEV(...), "non trouvé")
=IFERROR(VLOOKUP(...), "not found")     (version anglaise)
```

Première tentative : ta formule. Si erreur : renvoie la seconde valeur (ici « non trouvé »). C'est **l'équivalent tableur du try/except** Python.

## À retenir

- Une formule commence par `=` ; opérateurs `+ - * / ^` ; parenthèses comme en maths.
- **Référence relative** (`A1`) se décale ; **absolue** (`$A$1`) reste fixe ; mixte possible.
- Les **noms de plage** rendent les formules lisibles et maintenables.
- Le **format** est une couche d'affichage — attention à confondre valeur et affichage.
- **Table / Tableau structuré** (`Ctrl+T`) pour des plages qui s'étendent automatiquement.
- `SIERREUR` / `IFERROR` pour rattraper une formule qui peut échouer.

---

> **La prochaine fois** : les fonctions **indispensables** du tableur — agrégations, conditions, et surtout les **lookups** (RECHERCHEV / XLOOKUP) qui font la moitié du travail d'un analyste débutant.
