# Listes : la collection de base

*Temps estimé : 15 minutes*

## Rappel

Sans regarder :

1. Comment écrire un intervalle dans une condition Python (ex : `age` entre 18 et 65) ?
2. Qu'est-ce qui structure un bloc `if` en Python ?
3. Pourquoi `if not revenu:` peut être piégeux ?

## Pourquoi les listes

Tu ne traites presque jamais **une** donnée — tu en traites **beaucoup**. Les noms de 100 employés, les ventes de 365 jours, les tweets d'une heure, les 10 000 lignes d'un export CSV. Pour stocker une **séquence** de valeurs en Python, la structure de base est la **liste** (`list`).

## Créer une liste

```python
notes = [12, 15, 8, 19, 10]
prenoms = ["Léa", "Tom", "Nour", "Ali"]
vide = []
mixed = [1, "texte", 3.14, True, None]    # types mélangés autorisés
```

Syntaxe : crochets `[ ]`, éléments séparés par virgules. Les types peuvent être mélangés — mais dans la pratique **une liste devrait contenir un seul type** (homogène) pour être exploitable.

Longueur d'une liste :

```python
len(notes)      # 5
len(vide)       # 0
```

## Accéder aux éléments : l'indexation

Chaque élément a une **position** (un *index*). **Python commence à zéro.**

```python
notes = [12, 15, 8, 19, 10]
#        0   1   2   3   4    (indices)

notes[0]        # 12 — premier
notes[2]        # 8  — troisième
notes[4]        # 10 — dernier
notes[5]        # IndexError : out of range
```

Les **indices négatifs** comptent depuis la fin :

```python
notes[-1]       # 10 — dernier (plus pratique que notes[len(notes) - 1])
notes[-2]       # 19 — avant-dernier
```

## Modifier une liste

Les listes sont **mutables** — on peut les changer après création.

```python
notes = [12, 15, 8, 19, 10]

notes[2] = 11           # modifie la troisième note
# notes vaut maintenant [12, 15, 11, 19, 10]

notes.append(20)        # ajoute à la fin
# [12, 15, 11, 19, 10, 20]

notes.insert(0, 14)     # insère 14 à l'indice 0
# [14, 12, 15, 11, 19, 10, 20]

notes.remove(11)        # retire la première occurrence de 11
# [14, 12, 15, 19, 10, 20]

supprime = notes.pop()  # retire et renvoie le dernier
# notes : [14, 12, 15, 19, 10] ; supprime = 20

notes.clear()           # vide complètement
# []
```

## Le *slicing* : extraire une tranche

```python
notes = [12, 15, 8, 19, 10, 7, 18]

notes[1:4]      # [15, 8, 19] — de l'index 1 inclus à 4 exclu
notes[:3]       # [12, 15, 8] — du début à l'index 3 exclu
notes[4:]       # [10, 7, 18] — de l'index 4 à la fin
notes[:]        # [12, 15, 8, 19, 10, 7, 18] — copie complète
notes[::2]      # [12, 8, 10, 18] — un élément sur deux
notes[::-1]     # [18, 7, 10, 19, 8, 15, 12] — inverse
```

Le slicing est l'une des **forces** de Python — tu retrouveras la même syntaxe sur les chaînes (`str`), les tableaux NumPy, les DataFrames pandas. Apprends-la bien ici.

## Les opérations globales

Concaténation et répétition, comme les strings :

```python
[1, 2, 3] + [4, 5]      # [1, 2, 3, 4, 5]
[0] * 5                 # [0, 0, 0, 0, 0] — utile pour initialiser
```

Tests d'appartenance :

```python
15 in notes             # True ou False
20 not in notes         # True si 20 n'y est pas
```

Fonctions numériques utiles :

```python
min(notes)              # plus petite valeur
max(notes)              # plus grande
sum(notes)              # somme
sorted(notes)           # nouvelle liste triée (ne modifie pas notes)
```

Pour trier **en place** (modifie `notes`) :

```python
notes.sort()            # tri croissant
notes.sort(reverse=True)# tri décroissant
```

## Itérer sur une liste (teaser)

Le cas le plus utile : **parcourir** tous les éléments :

```python
for note in notes:
    print(note)
```

On détaille les boucles à la prochaine leçon.

## Les pièges des listes mutables

### Les alias inattendus

```python
a = [1, 2, 3]
b = a
b.append(4)

print(a)    # [1, 2, 3, 4] !!!
```

`b = a` ne **copie pas** la liste — il crée un **deuxième nom** pour la même liste. Modifier `b` modifie `a`.

Pour une vraie copie :

```python
a = [1, 2, 3]
b = a.copy()      # ou b = a[:] ou b = list(a)
b.append(4)

print(a)          # [1, 2, 3] — inchangée
print(b)          # [1, 2, 3, 4]
```

### Modifier une liste en itérant dessus

```python
# MAUVAIS : comportement imprévisible
nombres = [1, 2, 3, 4, 5]
for n in nombres:
    if n % 2 == 0:
        nombres.remove(n)

print(nombres)   # [1, 3, 5] ? Non : [1, 3, 5] *peut* marcher, mais c'est fragile.
```

Règle : **ne jamais modifier une liste** qu'on est en train d'itérer. Construis une nouvelle liste :

```python
nombres = [1, 2, 3, 4, 5]
impairs = [n for n in nombres if n % 2 != 0]
print(impairs)   # [1, 3, 5]
```

(Cette syntaxe `[... for ... if ...]` s'appelle une **list comprehension** — très puissante, tu la verras à la prochaine leçon.)

## Les autres collections (survol)

Python a trois autres collections de base, qu'on détaillera en S2 :

- **`tuple`** — comme une liste mais **immutable** : `(1, 2, 3)`. Utilisé quand la séquence ne doit pas changer.
- **`set`** — collection d'éléments **uniques**, sans ordre : `{1, 2, 3}`. Très rapide pour tester l'appartenance.
- **`dict`** (dictionnaire) — associe des **clés** à des **valeurs** : `{"nom": "Léa", "age": 20}`. **La** structure la plus utile de Python après la liste.

On les reverra. Pour aujourd'hui, focus sur les listes.

## Listes et analyse de données

En pur Python, les listes sont **la** structure pour manipuler des séries de valeurs. Pour des datasets plus gros et plus structurés (tabulaires), on passe à `pandas.DataFrame` (S3). Mais les opérations de base — indexer, slicer, filtrer — suivent la même philosophie.

Exemple typique : calculer la moyenne d'une série de valeurs.

```python
notes = [12, 15, 8, 19, 10, 7, 18]

moyenne = sum(notes) / len(notes)
print(f"Moyenne : {moyenne:.2f}")    # f-string avec 2 décimales
```

## À retenir

- Les listes se créent avec `[ ]`, s'indexent à partir de **0**, et acceptent les index **négatifs**.
- **Mutables** : `append`, `insert`, `remove`, `pop`, `sort`.
- **Slicing** `liste[début:fin:pas]` — syntaxe qu'on retrouve partout.
- `b = a` **ne copie pas** ; utilise `a.copy()` ou `a[:]`.
- **Ne jamais modifier** une liste qu'on itère — construit une nouvelle liste.

---

> **La prochaine fois** : parcourir ces listes avec `for` et `while`. L'outil qui transforme « écrire 100 lignes » en « écrire 3 lignes ».
