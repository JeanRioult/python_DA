# Variables, types et affectation

*Temps estimé : 15 minutes*

## Rappel

Sans regarder :

1. Quelle est la différence entre une cellule Code et une cellule Markdown ?
2. Qu'est-ce que le kernel d'un notebook ?
3. Pourquoi « redémarrer et tout relancer » est-il un test important ?

## Une variable, c'est une étiquette

En Python, une **variable** est un *nom* auquel tu attaches une valeur. Tu crées la variable en faisant une **affectation** avec le signe `=` :

```python
age = 20
prenom = "Léa"
est_majeure = True
```

Trois variables, trois types. `age` vaut `20`, `prenom` vaut `"Léa"`, `est_majeure` vaut `True`.

**Le signe `=` en Python n'est pas un égal mathématique.** C'est l'ordre « range cette valeur sous ce nom ». En maths on écrirait `age = 20` pour dire que la variable `age` vaut 20, point final. En Python, `age = 20` *assigne* la valeur 20 à la variable `age` — et tu peux réassigner :

```python
age = 20
age = 21      # pas d'erreur : l'étiquette "age" pointe maintenant vers 21
```

La variable n'est pas la valeur. C'est un **nom** qui pointe vers une valeur.

## Les types primitifs

Python te donne gratuitement plusieurs **types** de données. Les cinq à connaître pour l'instant :

### `int` — entier

```python
annee = 2026
nb_employes = -5
grand_nombre = 10_000_000   # les underscores sont ignorés, aident à lire
```

### `float` — nombre à virgule flottante

```python
prix = 19.99
pi_approx = 3.14159
zero_virgule = 1.0          # noter le .0 : c'est un float, pas un int
notation_sci = 1.5e6        # = 1.5 × 10⁶ = 1 500 000.0
```

**Piège important** : les floats sont *approximatifs*, pas exacts.

```python
0.1 + 0.2       # renvoie 0.30000000000000004, pas 0.3
```

Ce n'est pas un bug de Python — c'est la norme IEEE 754 commune à tous les langages. On reviendra dessus en chapitre de maths. Règle : **jamais tester l'égalité entre deux floats avec `==`**. Utilise plutôt `abs(a - b) < 0.001` ou `math.isclose(a, b)`.

### `str` — chaîne de caractères (*string*)

Texte, entre guillemets simples ou doubles — indifféremment, tant que tu ouvres et fermes avec le même.

```python
ville = "Paris"
salutation = 'Bonjour'
avec_apostrophe = "L'hôpital"      # guillemets doubles car apostrophe à l'intérieur
multi_ligne = """Ceci
s'étend
sur plusieurs lignes."""
```

Opérations sur les strings :

```python
a = "Bonjour "
b = "le monde"
a + b               # "Bonjour le monde" — concaténation
a * 3               # "Bonjour Bonjour Bonjour " — répétition
len(a)              # 8 — longueur
a.upper()           # "BONJOUR "
"monde" in b        # True — test d'appartenance
```

Les **f-strings** sont la manière moderne et propre de formatter :

```python
prenom = "Léa"
age = 20
message = f"{prenom} a {age} ans."
# "Léa a 20 ans."
```

Préfère **toujours** les f-strings à la concaténation `prenom + " a " + str(age) + " ans."`. C'est plus lisible, moins buggy.

### `bool` — booléen

Deux valeurs seulement : `True` et `False` (majuscule obligatoire).

```python
est_connecte = True
a_fini = False
```

Les booléens résultent naturellement des comparaisons :

```python
10 > 5          # True
"a" == "b"      # False
x != y          # True si x différent de y
```

Les opérateurs logiques du chapitre 3 en Python : `and`, `or`, `not`.

```python
est_majeure = age >= 18
est_adulte_actif = est_majeure and est_connecte
```

### `None` — l'absence de valeur

Une seule valeur : `None`. Sert à représenter « rien », « pas encore défini », « absent ».

```python
resultat = None
if resultat is None:
    print("Pas encore calculé")
```

Attention : pour tester `None`, utilise `is None` / `is not None`, **pas** `== None`. C'est la convention.

## Trouver le type d'une variable

```python
type(age)         # <class 'int'>
type(prix)        # <class 'float'>
type(ville)       # <class 'str'>
type(est_connecte)# <class 'bool'>
type(resultat)    # <class 'NoneType'>
```

Utile en debug quand une variable ne se comporte pas comme tu crois.

## Les conversions (*casting*)

Tu peux convertir entre types, avec des fonctions qui portent le nom du type cible :

```python
int("42")         # 42 (int)
int(3.9)          # 3 — attention : tronque, ne pas arrondir !
float("3.14")     # 3.14
str(2026)         # "2026"
bool(0)           # False
bool(1)           # True
bool("")          # False
bool("a")         # True
```

Pour un arrondi propre, préfère `round(3.9)` → 4, pas `int(3.9)` → 3.

Pour `bool`, tout ce qui est « vide ou nul » est `False` : `0`, `0.0`, `""`, `[]`, `None`, `False`. Tout le reste est `True`. On appelle ça des valeurs **falsy** et **truthy**. Utile pour les tests.

## Règles de nommage

Python impose peu de choses, mais l'usage (PEP 8) impose beaucoup. Voici les règles à respecter **dès maintenant** :

- **Minuscules et underscores** (`snake_case`) pour les variables et fonctions.

  ```python
  age_moyen = 32         # bon
  ageMoyen = 32          # mauvais (camelCase — réservé à d'autres langages)
  AGE_MOYEN = 32         # mauvais (MAJUSCULES — réservé aux constantes)
  ```

- **Pas d'accents** dans les noms. Python les accepte techniquement, mais ça casse la portabilité.

  ```python
  année = 2026           # techniquement valide, mais évite
  annee = 2026           # mieux
  ```

- **Pas de mots réservés**. Python refuse `class`, `for`, `if`, `True`, `None`, etc. comme noms de variables.

- **Noms parlants, pas minimaux**. `n` pour un compteur OK, `nb_utilisateurs` bien mieux que `nbu`.

  ```python
  a = 0.19 * p           # incompréhensible
  tva = 0.19 * prix_ht   # lisible
  ```

- **Longueur**. Une variable qui vit 2 lignes peut être courte (`i`, `tmp`). Une variable qui vit 200 lignes doit être explicite.

**Ton code est lu plus souvent qu'écrit.** Optimise pour la lecture.

## Variables dans un notebook

Dans un notebook, une variable définie dans une cellule est **visible dans toutes les cellules suivantes** — tant que le kernel tourne.

```python
# Cellule 1
age = 20
```

```python
# Cellule 2
print(age)          # affiche 20 — la variable de la cellule 1 est disponible
```

Cette portée globale est **pratique** pour explorer, mais c'est aussi **le piège** de la leçon précédente : une variable fantôme peut exister dans le kernel sans être visible dans les cellules actuelles. Le test du « redémarrer et tout relancer » est ton garde-fou.

## À retenir

- Une variable est un **nom** qui pointe vers une valeur ; `=` est une **affectation**, pas une égalité.
- Cinq types primitifs : `int`, `float`, `str`, `bool`, `None`.
- **Pas de `==` entre floats**. Pas de `== None` (utilise `is None`).
- f-strings pour formatter : `f"{variable}"`.
- `snake_case`, **noms parlants**, pas d'accents.

---

> **La prochaine fois** : faire quelque chose avec ces variables — lire l'entrée de l'utilisateur, afficher proprement, calculer.
