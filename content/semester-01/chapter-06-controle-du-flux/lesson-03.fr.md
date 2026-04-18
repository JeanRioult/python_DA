# Boucles : `for` et `while`

*Temps estimé : 15 minutes*

## Rappel

Sans regarder :

1. À partir de quel indice commence une liste Python ?
2. Pourquoi `b = a` ne copie-t-il pas une liste ?
3. Quelle est la syntaxe du slicing et que signifie `liste[::-1]` ?

## Pourquoi on boucle

Sans boucle, pour afficher 100 noms tu écris 100 `print`. Inacceptable. Une **boucle** te permet de dire *« répète cette opération sur chaque élément »*.

Python a deux boucles : `for` et `while`. Chacune a son domaine.

## La boucle `for` — parcourir une collection

La plus utilisée. Tu as une collection, tu veux faire quelque chose sur chaque élément :

```python
notes = [12, 15, 8, 19, 10]

for note in notes:
    print(note)
```

Exécution ligne par ligne :

- Itération 1 : `note` prend la valeur `12`, le bloc s'exécute → affiche `12`.
- Itération 2 : `note` prend `15` → affiche `15`.
- ... jusqu'à ce qu'il n'y ait plus d'éléments.

Le nom `note` est libre — tu choisis. L'idiome : mettre un nom au **singulier** pour l'élément, **pluriel** pour la collection.

```python
for note in notes:              # bon
for n in notes:                 # ok pour très courte boucle
for i in notes:                 # mauvais : i suggère un indice, pas un élément
```

## `range` — générer une séquence d'entiers

Très souvent, on veut boucler **un certain nombre de fois**, sans parcourir une liste préexistante :

```python
for i in range(5):
    print(i)
# Affiche : 0, 1, 2, 3, 4
```

`range(n)` produit les entiers de **0 à n-1**. Variantes :

```python
range(3, 10)        # 3, 4, 5, 6, 7, 8, 9
range(0, 20, 2)     # 0, 2, 4, ..., 18 — pas de 2
range(10, 0, -1)    # 10, 9, 8, ..., 1 — à l'envers
```

Attention : `range` **ne contient pas la borne supérieure**. `range(5)` = 0 à 4, pas 0 à 5. Cette convention est omniprésente en Python (et dans le slicing).

## `enumerate` — avoir l'indice ET l'élément

Quand tu as besoin à la fois de la position et de la valeur :

```python
prenoms = ["Léa", "Tom", "Nour"]

for i, prenom in enumerate(prenoms):
    print(f"{i}. {prenom}")
# 0. Léa
# 1. Tom
# 2. Nour
```

Beaucoup plus lisible que `for i in range(len(prenoms)):` puis `prenoms[i]`. Adopte `enumerate` dès qu'il te faut les deux.

## `zip` — itérer sur plusieurs listes en parallèle

```python
prenoms = ["Léa", "Tom", "Nour"]
ages = [20, 22, 19]

for prenom, age in zip(prenoms, ages):
    print(f"{prenom} a {age} ans")
# Léa a 20 ans
# Tom a 22 ans
# Nour a 19 ans
```

`zip` marche sur n'importe quel nombre de collections. Si les longueurs diffèrent, il s'arrête à la plus courte.

## La boucle `while` — répéter tant que

`while` répète **tant qu'une condition est vraie** :

```python
compteur = 10
while compteur > 0:
    print(compteur)
    compteur -= 1
print("Boom !")
```

À utiliser quand le **nombre d'itérations** n'est pas connu à l'avance. Exemples :

- Lire une entrée utilisateur **jusqu'à ce qu'elle soit valide**.
- Chercher dans un arbre jusqu'à un critère.
- Simuler un processus jusqu'à convergence.

### Le piège : la boucle infinie

```python
compteur = 10
while compteur > 0:
    print(compteur)
    # Oups : on oublie de décrémenter compteur
```

Cette boucle ne s'arrête **jamais**. Ton notebook ou ton programme tourne à l'infini. **Vérifie toujours que la condition peut devenir fausse**.

Pour arrêter une boucle qui tourne : dans un notebook, clique sur le carré « interrompre le kernel ». Dans un terminal : `Ctrl + C`.

## `break` et `continue`

Deux mots-clés pour modifier le flux d'une boucle.

### `break` — sortir de la boucle immédiatement

```python
for n in [1, 2, 3, 4, 5]:
    if n == 3:
        break
    print(n)
# 1, 2 — s'arrête à 3
```

### `continue` — passer à l'itération suivante

```python
for n in [1, 2, 3, 4, 5]:
    if n % 2 == 0:
        continue       # saute les pairs
    print(n)
# 1, 3, 5
```

**Utilise `break` et `continue` avec mesure** — ils rendent la logique moins évidente. Souvent un `if/else` explicite est plus lisible.

## `else` après une boucle (trait rare mais utile)

```python
for n in [1, 2, 3, 4]:
    if n == 10:
        print("Trouvé !")
        break
else:
    print("Pas trouvé")
```

Le `else` s'exécute **si la boucle s'est terminée normalement**, c'est-à-dire **sans `break`**. Utile pour « chercher et signaler l'absence ». Trait peu connu, élégant — mais déroutant pour qui ne le connaît pas. Mentionne-le en commentaire ou préfère un `if/else` classique.

## Les *list comprehensions*

Syntaxe compacte pour créer une liste à partir d'une autre :

```python
nombres = [1, 2, 3, 4, 5]

# Classique
carres = []
for n in nombres:
    carres.append(n * n)

# Comprehension (équivalent)
carres = [n * n for n in nombres]
```

Avec un filtre :

```python
pairs = [n for n in nombres if n % 2 == 0]
```

Avec une transformation conditionnelle :

```python
etiquettes = ["pair" if n % 2 == 0 else "impair" for n in nombres]
```

Les comprehensions sont **idiomatiques** en Python. Pour des transformations simples, elles battent les boucles classiques en lisibilité. Pour des logiques complexes, reste sur une vraie boucle.

## Boucles imbriquées

Une boucle dans une boucle :

```python
for i in range(3):
    for j in range(3):
        print(f"({i}, {j})")
```

Ça produit les 9 couples `(0,0), (0,1), ..., (2,2)`.

**Attention à la complexité** : si la boucle extérieure a $n$ itérations et l'intérieure $n$ aussi, tu fais $n^2$ opérations. Pour $n = 10$, ça fait 100, gérable. Pour $n = 10\,000$, 100 millions — lent.

En analyse de données, dès que tu vois plusieurs boucles imbriquées, demande-toi si `pandas` ou NumPy ne ferait pas mieux en **vectorisant** l'opération (on verra en S3).

## Exemple d'usage analyste

Prenons une liste de revenus et calculons la moyenne des revenus supérieurs à 30 000 € :

```python
revenus = [25000, 32000, 45000, 18000, 52000, 28000, 41000]

# Méthode 1 : boucle classique
total = 0
count = 0
for r in revenus:
    if r > 30000:
        total += r
        count += 1

if count > 0:
    moyenne = total / count
    print(f"Moyenne (> 30k€) : {moyenne:.0f} € sur {count} personnes")
else:
    print("Personne au-dessus de 30 000 €.")

# Méthode 2 : comprehension + fonctions built-in
hauts = [r for r in revenus if r > 30000]
if hauts:
    print(f"Moyenne (> 30k€) : {sum(hauts) / len(hauts):.0f} € sur {len(hauts)} personnes")
```

Les deux marchent. La deuxième est plus lisible **pour les opérations standards** ; la première donne plus de contrôle pour des logiques inhabituelles.

## À retenir

- `for x in collection:` pour **parcourir**.
- `range(n)` pour boucler **n fois** ; `range(a, b)` pour `a` à `b-1` ; `range(a, b, pas)`.
- **`enumerate`** pour indice + valeur ; **`zip`** pour parcourir deux collections en parallèle.
- `while condition:` pour **répéter jusqu'à**. Gare aux **boucles infinies**.
- `break` pour sortir, `continue` pour sauter une itération.
- **List comprehensions** pour des transformations concises.

---

> **La prochaine fois** : ce qui se passe **quand ça rate**. Erreurs, exceptions, et le `try/except` qui te permet de réagir plutôt que de planter.
