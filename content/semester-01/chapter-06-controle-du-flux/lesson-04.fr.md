# Erreurs et `try/except`

*Temps estimé : 15 minutes*

## Rappel

Sans regarder :

1. Quelle est la différence entre `for` et `while` ?
2. Que fait `enumerate(liste)` ?
3. Comment calculer les carrés d'une liste en une ligne avec une *list comprehension* ?

## Quand ton programme se casse la figure

Jusqu'ici, quand un problème survenait dans ton code, Python affichait une trace d'erreur et **s'arrêtait**. Exemple :

```python
int("bonjour")
# ValueError: invalid literal for int() with base 10: 'bonjour'
```

Dans la vie réelle, on veut souvent **gérer l'erreur**, pas s'arrêter :

- L'utilisateur tape « vingt » au lieu de 20 → redemande-lui.
- Un fichier n'existe pas → essaie un autre chemin ou affiche un message clair.
- Une API répond timeout → ré-essaye.

C'est le rôle des **exceptions** et du bloc `try/except`.

## Anatomie d'une erreur Python

Quand Python lève une erreur, il affiche une *traceback* — une pile d'appels qui explique **où** ça a planté :

```
Traceback (most recent call last):
  File "script.py", line 5, in <module>
    age = int(input("Âge : "))
ValueError: invalid literal for int() with base 10: 'vingt'
```

À lire **de bas en haut** :

1. Le **type d'erreur** (en bas) : `ValueError`. C'est la catégorie.
2. Le **message** : « invalid literal for int() ». Le détail.
3. La **dernière ligne de ton code** concernée (en remontant).
4. Les appels qui ont mené jusque-là (au-dessus).

**Règle de débutant** : lis toujours la *traceback*. Elle donne souvent la réponse dans les trois premières lignes. Beaucoup de débutants paniquent et collent la trace dans Google sans la lire — erreur.

## Les exceptions courantes

| Exception            | Cause typique                                            |
| -------------------- | -------------------------------------------------------- |
| `SyntaxError`        | Code mal formé (oubli de `:`, parenthèse non fermée).    |
| `IndentationError`   | Indentation incorrecte.                                  |
| `NameError`          | Variable utilisée avant d'être définie.                  |
| `TypeError`          | Opération entre types incompatibles (`"a" + 2`).         |
| `ValueError`         | Valeur du bon type mais inacceptable (`int("abc")`).     |
| `IndexError`         | Index hors des limites d'une liste.                      |
| `KeyError`           | Clé absente d'un dictionnaire.                           |
| `ZeroDivisionError`  | Division par zéro.                                       |
| `FileNotFoundError`  | Fichier qui n'existe pas.                                |
| `AttributeError`     | Attribut ou méthode inexistante sur un objet.            |
| `ImportError` / `ModuleNotFoundError` | Bibliothèque introuvable.                   |

Connaître les cinq premières te fait gagner des heures de recherche.

## Le bloc `try/except`

```python
try:
    age = int(input("Âge : "))
    print(f"Dans 10 ans, tu auras {age + 10} ans.")
except ValueError:
    print("Ce n'était pas un nombre valide.")
```

- Python **essaie** d'exécuter le bloc `try`.
- Si une erreur de type `ValueError` survient, il saute dans le `except`.
- Sinon, le `except` est ignoré.

Le programme **ne s'arrête pas**. Il continue après le bloc.

## Attraper plusieurs exceptions

Plusieurs `except` possibles :

```python
try:
    resultat = 10 / int(input("Nombre : "))
except ValueError:
    print("Ce n'est pas un nombre.")
except ZeroDivisionError:
    print("Division par zéro interdite.")
```

Ou, si la réaction est la même :

```python
try:
    resultat = 10 / int(input("Nombre : "))
except (ValueError, ZeroDivisionError):
    print("Entrée invalide.")
```

## Récupérer le message d'erreur

```python
try:
    int("bonjour")
except ValueError as e:
    print(f"Erreur : {e}")
# Erreur : invalid literal for int() with base 10: 'bonjour'
```

Le mot-clé `as e` (pour *exception*) attache l'objet erreur à une variable, que tu peux logger, afficher, relancer.

## `else` et `finally`

```python
try:
    fichier = open("data.csv", "r")
except FileNotFoundError:
    print("Fichier introuvable.")
else:
    # Exécuté si PAS d'erreur
    contenu = fichier.read()
    print(f"{len(contenu)} caractères lus.")
finally:
    # Exécuté DANS TOUS LES CAS
    print("Tentative terminée.")
```

- `else` : le code qui s'exécute **si le `try` a réussi**. Sépare proprement la logique.
- `finally` : le code qui s'exécute **toujours** — succès ou échec. Typiquement pour libérer une ressource (fermer un fichier, une connexion).

## Le piège absolu : `except:` nu

```python
# NE FAIS JAMAIS CA
try:
    ...
except:
    pass
```

Un `except:` **sans type** attrape **toutes** les erreurs, y compris celles qu'il ne fallait pas attraper (Ctrl+C, erreurs système, bugs de ton code). `pass` signifie « ne rien faire » — tu masques le problème sans le régler.

**Règle** : attrape **l'exception la plus spécifique** que tu peux gérer. Laisse les autres remonter.

```python
# Bon
try:
    ...
except ValueError:
    print("Valeur invalide")

# Acceptable dans un cas bien précis (avec log)
try:
    ...
except Exception as e:
    log_error(e)
    raise    # relance l'exception après avoir loggé
```

## `raise` — lever une exception toi-même

Tu peux déclencher une exception volontairement :

```python
def diviser(a, b):
    if b == 0:
        raise ValueError("Division par zéro impossible.")
    return a / b
```

Utile pour **valider les arguments** d'une fonction : mieux vaut un message clair tout de suite qu'un comportement bizarre plus loin.

## Application analyste : nettoyage robuste

Un cas typique — convertir une colonne de « revenu » qui contient parfois du texte.

```python
revenus_bruts = ["25000", "3000e", "", "45000", "-1", "N/A"]

revenus_nettoyes = []
for r in revenus_bruts:
    try:
        valeur = int(r)
        if valeur < 0:
            raise ValueError("Revenu négatif")
        revenus_nettoyes.append(valeur)
    except ValueError:
        revenus_nettoyes.append(None)    # marque comme manquant

print(revenus_nettoyes)
# [25000, None, None, 45000, None, None]
```

Ce pattern — essayer de convertir, marquer comme `None` en cas d'échec — est un des plus utilisés en préparation de données.

## Les *warnings* (pour info)

Python distingue **erreurs** (le code s'arrête) et **warnings** (message, le code continue). Les warnings apparaissent souvent pour signaler :

- Utilisation de code obsolète (deprecated).
- Comportement qui pourrait changer dans une version future.
- Signal statistique (dans pandas / NumPy).

Ne les ignore pas — ce sont souvent des alertes utiles. On verra plus tard comment les filtrer ou les transformer en erreurs quand on veut les traiter strictement.

## Quand NE PAS utiliser `try/except`

Le *try/except* est pour des cas **exceptionnels** — pas pour le flot de contrôle normal.

```python
# Mauvais — on utilise une exception comme un if
try:
    valeur = liste[10]
except IndexError:
    valeur = None

# Bon — on teste avant
valeur = liste[10] if len(liste) > 10 else None
```

**Règle** : « ask forgiveness, not permission » (EAFP) est une tradition Python, mais pour des situations **rares**. Si ton `except` se déclenche 1 fois sur 2, tu es en train d'utiliser un marteau pour visser.

## À retenir

- Les exceptions ont un **type** (`ValueError`, `FileNotFoundError`…) et un **message**.
- **Lis la traceback de bas en haut** — la réponse est souvent dedans.
- `try / except / else / finally` — chaque bloc a son rôle.
- **N'attrape jamais** `except:` nu. Préfère le type spécifique.
- `raise` pour lever toi-même une exception, valider des arguments.

---

> **La prochaine fois** : la compétence qui distingue un vrai pro — la **méthode mentale du débogage**. Que faire quand ton code ne marche pas et que tu ne comprends pas pourquoi.
