# Entrées, sorties et arithmétique

*Temps estimé : 15 minutes*

## Rappel

Sans regarder :

1. Pourquoi `0.1 + 0.2 == 0.3` donne `False` en Python ?
2. Quelle est la convention de nommage recommandée pour les variables Python ?
3. Quelle fonction renvoie le type d'une variable ?

## Sortie standard : `print`

La fonction de base pour afficher : `print`.

```python
print("Bonjour")                    # Bonjour
print("Bonjour", "Léa")             # Bonjour Léa (espace inséré entre arguments)
print(2 + 2)                        # 4
print("Il fait", 22, "°C.")         # Il fait 22 °C.
```

Options utiles :

```python
print("a", "b", "c", sep=" — ")     # a — b — c
print("sans saut de ligne", end="") # ne va pas à la ligne à la fin
print("suite")                      # se colle au précédent
```

Dans un notebook, la **dernière expression** d'une cellule est affichée automatiquement — sans `print`. Mais si tu veux afficher **plusieurs choses** dans une cellule, tu dois utiliser `print` explicitement, sauf pour la dernière ligne.

```python
# Cellule :
x = 5
y = 10
x + y       # 15 — la dernière expression s'affiche
x - y       # -5 — remplacé par la ligne suivante
x * y       # 50 — seul ceci s'affichera à la fin
```

Pour tout voir : utilise `print` ou sépare en plusieurs cellules.

## Entrée standard : `input`

La fonction `input` demande une saisie à l'utilisateur. **Elle renvoie toujours une chaîne de caractères**, même si l'utilisateur tape un nombre.

```python
prenom = input("Quel est ton prénom ? ")
print(f"Bonjour, {prenom}.")
```

Pour obtenir un nombre, il faut **convertir** :

```python
age_str = input("Quel âge as-tu ? ")    # "20" — une string
age = int(age_str)                       # 20 — un int
print(f"Dans 10 ans tu auras {age + 10} ans.")
```

Plus concis :

```python
age = int(input("Quel âge as-tu ? "))
```

**Piège** : si l'utilisateur tape « vingt » au lieu de « 20 », `int("vingt")` lève une erreur. En Ch6 on verra comment gérer ça avec `try/except`. Pour l'instant, suppose des entrées bien formées.

`input` est rarement utilisé dans les notebooks d'analyse (on travaille sur des fichiers, pas sur la saisie). Mais c'est la manière de base d'avoir de l'interaction, et tu le croiseras.

## Les opérateurs arithmétiques

Les classiques :

```python
2 + 3       # 5   — addition
10 - 4      # 6   — soustraction
6 * 7       # 42  — multiplication
20 / 3      # 6.666666666666667 — division (toujours en float)
```

Les moins classiques mais essentiels :

```python
20 // 3     # 6   — division entière (quotient, sans reste)
20 % 3      # 2   — modulo (reste de la division)
2 ** 10     # 1024 — puissance (pas ^, qui est un autre opérateur en Python)
```

**Note importante** : `^` en Python n'est **pas** la puissance — c'est le XOR bit-à-bit. Une erreur fréquente pour qui vient d'autres langages.

### Pourquoi `//` et `%` comptent

Pour un analyste, `//` (division entière) et `%` (modulo) apparaissent tout le temps :

- Combien de semaines complètes dans 100 jours ? `100 // 7` → 14
- Quel est le jour restant ? `100 % 7` → 2
- Ce nombre est-il pair ? `n % 2 == 0`
- Afficher une heure en HH:MM à partir d'un nombre de minutes : `heures = minutes // 60; minutes_restantes = minutes % 60`

## Priorité des opérateurs

Comme en maths : parenthèses, puissances, multiplication/division, addition/soustraction — dans cet ordre.

```python
2 + 3 * 4           # 14, pas 20
(2 + 3) * 4         # 20
2 ** 3 ** 2         # 512 — les puissances s'évaluent de droite à gauche : 2 ** (3**2) = 2**9
```

**Règle pratique** : en cas de doute, **mets des parenthèses**. Python ne te reproche pas les parenthèses redondantes, et ton code devient lisible.

## Affectation combinée

Raccourcis utiles :

```python
x = 10
x += 5      # équivalent à : x = x + 5   → x vaut 15
x -= 3      # x = x - 3                 → 12
x *= 2      # x = x * 2                 → 24
x /= 4      # x = x / 4                 → 6.0
x //= 2     # x = x // 2                → 3.0
x %= 2      # x = x % 2                 → 1.0
x **= 3     # x = x ** 3                → 1.0 (ha ha)
```

Ces formes sont **idiomatiques** — on les voit partout, habitue-toi tôt.

## Le module `math` pour le reste

Pour les opérations qui ne sont pas dans les opérateurs de base, le module standard `math` :

```python
import math

math.sqrt(16)       # 4.0         — racine carrée
math.pi             # 3.14159...  — constante pi
math.e              # 2.71828...  — constante e
math.log(100)       # 4.605...    — logarithme naturel (base e)
math.log10(100)     # 2.0         — log en base 10
math.log2(8)        # 3.0         — log en base 2
math.sin(math.pi/2) # 1.0         — sinus (en radians, pas en degrés)
math.floor(3.7)     # 3           — arrondi vers le bas (partie entière)
math.ceil(3.2)      # 4           — arrondi vers le haut
```

L'`import math` doit apparaître **une fois** dans le notebook (cellule des imports en haut). Après ça, `math.sqrt`, `math.log`, etc. sont disponibles partout.

## `round` — l'arrondi intelligent

```python
round(3.5)          # 4
round(3.49)         # 3
round(2.675, 2)     # 2.67 — oui, pas 2.68 : bizarrerie des floats
round(12345.678, -1)# 12350.0 — arrondi à la dizaine
```

Deux choses à savoir :

1. Python utilise l'**arrondi bancaire** (*round half to even*) pour les valeurs exactement à .5. `round(0.5) == 0` et `round(1.5) == 2` — les deux arrondissent au pair le plus proche. C'est statistiquement plus juste qu'un arrondi systématique au-dessus.
2. La représentation des floats crée parfois des surprises : `round(2.675, 2)` renvoie `2.67` parce que `2.675` n'est pas représentable exactement en binaire. Pour de l'argent, utilise le module `decimal` (qu'on verra plus tard).

## Exercice mental

Avant de voir les résultats, essaie de calculer de tête :

```python
7 % 3               # ?
2 ** 3 * 4          # ?
(2 + 3) ** 2        # ?
10 // 3 + 10 % 3    # ?
```

Résultats : `1`, `32`, `25`, `4`.

Si tu t'es trompé·e sur la deuxième, tu as oublié que la puissance a priorité sur la multiplication. Sur la dernière, c'est un classique : `10 // 3 = 3`, `10 % 3 = 1`, somme 4.

## Pièges courants

- **`type(10 / 2)` est `float`, pas `int`.** La division `/` renvoie **toujours** un float en Python 3, même si le résultat est un entier exact. Pour un entier : `10 // 2`.
- **Concaténer des nombres à des strings** : `"âge: " + 20` → erreur. Utilise `f"âge: {20}"` ou `"âge: " + str(20)`.
- **Diviser par zéro** : `1 / 0` → erreur `ZeroDivisionError`. On gérera avec `try/except` en Ch6.
- **Entrée `input` utilisée comme nombre sans conversion** : `input() + 5` → erreur, parce que `input` renvoie une string. Convertis d'abord.

## À retenir

- `print(...)` pour afficher, `input(...)` pour lire (et toujours convertir).
- Opérateurs : `+`, `-`, `*`, `/` (division float), `//` (division entière), `%` (modulo), `**` (puissance).
- `^` n'est **pas** la puissance en Python.
- `math.sqrt`, `math.log`, `math.pi`, `math.floor`, `math.ceil`.
- **Parenthèses dès que tu hésites** ; `round` utilise l'arrondi bancaire.

---

> **La prochaine fois** : un code qui marche, ce n'est pas assez. Un code **lisible** — voilà la différence entre un amateur et un pro.
