# Conditions : if, elif, else

*Temps estimé : 15 minutes*

## Rappel

Sans regarder :

1. Pourquoi faut-il éviter d'utiliser `==` pour comparer deux floats en Python ?
2. Quelle est la convention de nommage PEP 8 pour les variables ?
3. Que fait l'opérateur `%` en Python ?

## Pourquoi le contrôle du flux

Jusqu'ici, tes programmes s'exécutent **ligne après ligne**, dans l'ordre, toujours. C'est insuffisant pour traiter des données — dans la vie réelle :

- Certaines lignes d'un dataset sont valides, d'autres non.
- Certains utilisateurs sont majeurs, d'autres non.
- Certains fichiers s'ouvrent, d'autres plantent.

Un programme doit savoir **décider** (selon les conditions), **répéter** (sur des collections), et **gérer les erreurs**. C'est le **contrôle du flux**.

## La structure `if`

La décision la plus simple :

```python
age = 20

if age >= 18:
    print("Majeur")
```

Quatre choses à noter :

1. **Le mot-clé `if`** introduit la condition.
2. **La condition** est n'importe quelle expression qui vaut `True` ou `False`.
3. **Les deux points `:`** terminent la ligne d'entête — obligatoires.
4. **L'indentation** de 4 espaces marque ce qui est dans le bloc `if`.

Python **n'utilise pas d'accolades** (à la différence de C/Java/JavaScript) : l'indentation **est** la structure. Indenter de 2 espaces, 8 espaces, ou mélanger tabs/spaces → erreurs obscures.

## `else` — la branche alternative

```python
age = 15

if age >= 18:
    print("Majeur")
else:
    print("Mineur")
```

`else` est exécuté **uniquement** quand la condition du `if` est fausse. Pas besoin de préciser « sinon » : `else` suffit.

## `elif` — plusieurs cas

Quand il y a plus de deux branches :

```python
age = 15

if age < 13:
    print("Enfant")
elif age < 18:
    print("Adolescent")
elif age < 65:
    print("Adulte")
else:
    print("Senior")
```

`elif` = *else if*. Python évalue les conditions **dans l'ordre**, s'arrête à la **première** qui est vraie. Les suivantes sont ignorées, même si elles seraient vraies aussi.

**Piège classique** : écrire les conditions dans le désordre.

```python
# Mauvais
if age < 65:
    print("Adulte")
elif age < 18:
    print("Adolescent")    # jamais atteint — un ado a age < 65 déjà
elif age < 13:
    print("Enfant")        # jamais non plus
```

Règle : **du plus spécifique au plus général**.

## Les conditions composées

Tu peux combiner plusieurs conditions avec les opérateurs logiques vus au chapitre 3 :

```python
age = 25
a_permis = True

if age >= 18 and a_permis:
    print("Peut conduire")

if jour == "samedi" or jour == "dimanche":
    print("Weekend")

if not est_banni:
    print("Accès autorisé")
```

Opérateurs :
- `and` — les **deux** doivent être vraies.
- `or` — au moins **une** doit être vraie (inclusif).
- `not` — inverse.

### Comparaisons chaînées

Python permet une syntaxe élégante pour les intervalles :

```python
if 18 <= age < 65:
    print("Adulte actif")
```

C'est équivalent à `age >= 18 and age < 65` — plus lisible. Peu de langages autorisent ça ; profite en Python.

## L'indentation : tout le sujet

Répétons-le, parce que c'est la source numéro un d'erreurs chez les débutants Python :

```python
# Ces DEUX lignes sont DANS le if
if note >= 10:
    print("Admis")
    print("Bravo")
print("Fin")    # toujours exécutée, hors du if
```

```python
# UNE seule ligne dans le if
if note >= 10:
    print("Admis")
print("Bravo")  # toujours exécutée !
print("Fin")
```

Les deux blocs ci-dessus ne font **pas** la même chose. La différence est uniquement visuelle — et pourtant c'est elle qui structure le programme. PEP 8 impose **4 espaces** pour l'indentation ; PyCharm les insère automatiquement quand tu tapes `Tab`.

## Les conditions dans un contexte d'analyse

Conditions typiques chez un analyste :

```python
# Flag un utilisateur inactif
if derniere_connexion < seuil_inactivite:
    utilisateur.statut = "inactif"

# Catégoriser un revenu
if revenu < 20_000:
    categorie = "bas"
elif revenu < 50_000:
    categorie = "moyen"
else:
    categorie = "élevé"

# Filtrer une donnée aberrante
if age < 0 or age > 120:
    age = None  # valeur marquée comme invalide
```

Tu verras en S3 que `pandas` te permet de faire ça **sur un dataset entier** d'un coup (sans écrire de boucle). Mais la logique en dessous est toujours celle de `if/elif/else`.

## Truthy et falsy

Rappel du chapitre 5 : en Python, une valeur est considérée comme « fausse » dans un `if` quand elle est **vide ou nulle** :

```python
liste_vide = []
chaine_vide = ""
zero = 0
nothing = None

if not liste_vide:
    print("Liste vide")          # affiché
if not chaine_vide:
    print("Chaîne vide")         # affiché
if not zero:
    print("Zéro")                # affiché
if not nothing:
    print("None")                # affiché
```

**Pratique** mais **piège** : `if x:` renvoie `False` pour `x = 0` *et* pour `x = None` *et* pour `x = []`. Pour distinguer un zéro d'une valeur manquante, il faut tester explicitement :

```python
# Mauvais — on ne distingue pas 0 de None
if not revenu:
    print("Pas de revenu")

# Bon — on distingue
if revenu is None:
    print("Donnée manquante")
elif revenu == 0:
    print("Revenu nul")
else:
    print(f"Revenu : {revenu}")
```

## L'opérateur ternaire

Pour une affectation conditionnelle d'une ligne :

```python
statut = "majeur" if age >= 18 else "mineur"
```

C'est équivalent à :

```python
if age >= 18:
    statut = "majeur"
else:
    statut = "mineur"
```

L'opérateur ternaire est **concis** pour des cas simples. Ne pas l'utiliser pour des expressions complexes — un `if/else` explicite est plus lisible.

## Erreurs classiques

### `=` au lieu de `==`

```python
if age = 18:    # SyntaxError
if age == 18:   # correct
```

Python te protège : `=` est l'affectation, pas la comparaison, et une affectation en condition est refusée.

### Oublier le `:`

```python
if age >= 18
    print("Majeur")  # SyntaxError — il manque les deux points
```

### Indentation incohérente

```python
if age >= 18:
    print("Majeur")
     print("Bravo")   # IndentationError : 5 espaces au lieu de 4
```

PyCharm détecte ces erreurs en temps réel ; lis les soulignés rouges.

## À retenir

- `if / elif / else` : **ordre des conditions du plus spécifique au plus général**.
- **Indentation de 4 espaces** structure le code — c'est obligatoire, pas décoratif.
- Conditions combinées avec `and`, `or`, `not` ; intervalles avec `18 <= age < 65`.
- Pour distinguer `0` de `None`, **teste explicitement** avec `is None`.
- Opérateur ternaire `x if cond else y` pour les cas courts.

---

> **La prochaine fois** : avant de faire boucler quoi que ce soit, il faut une **collection**. On rencontre la structure de données la plus fondamentale de Python : la **liste**.
