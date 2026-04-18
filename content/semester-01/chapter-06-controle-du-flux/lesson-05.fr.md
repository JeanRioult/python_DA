# Déboguer : la méthode mentale

*Temps estimé : 15 minutes*

## Rappel

Sans regarder :

1. Comment lit-on une *traceback* Python ?
2. Pourquoi ne faut-il **jamais** écrire `except:` tout nu ?
3. Dans quel cas utilise-t-on `raise` ?

## Le déboguage est un métier

« Déboguer » n'est pas un défaut à cacher — c'est **la moitié du métier**. Tous les développeurs, tous les analystes, tous les data scientists passent beaucoup de temps à **comprendre pourquoi leur code ne fait pas ce qu'ils croient**. Les bons ne sont pas ceux qui font moins d'erreurs ; ce sont ceux qui les **localisent vite**.

Cette leçon t'apprend à déboguer **par la méthode**, pas par la chance.

## Le principe fondamental

Le déboguage est une **enquête scientifique** en miniature.

- Tu as une **hypothèse** sur ce que fait ton code.
- Tu observes un **comportement différent**.
- Le débogage = trouver **où** l'hypothèse et la réalité divergent.

Le piège est de **refuser** l'évidence. « C'est impossible », « le code ne peut pas faire ça », « Python est buggué ». Non. Le code **fait exactement ce qu'il fait**. C'est ta compréhension qui est incomplète.

**Règle d'or** : si ton code fait un truc que tu ne comprends pas, **ton modèle mental est faux** quelque part. Trouve où.

## La méthode en cinq étapes

### Étape 1 — Reproduire fiablement

Peux-tu reproduire le bug **à volonté** ? Si le bug est intermittent, tu dois d'abord trouver une façon de le déclencher systématiquement. Sans reproduction fiable, tu tâtonnes.

- Note les conditions exactes qui déclenchent le bug.
- Crée un **exemple minimal** (MCVE — *minimal complete verifiable example*) : le plus petit code qui reproduit l'erreur. Souvent, le simple fait de réduire l'exemple te montre le problème.

### Étape 2 — Lire la *traceback*

Si une exception est levée, la *traceback* est la plus grosse source d'information. Lis-la lentement, de bas en haut :

1. **Quel type** d'erreur ? (`ValueError`, `KeyError`, etc.)
2. **Quel message** ?
3. **Quelle ligne** dans ton code ?
4. **Quels appels imbriqués** ont mené là ?

90 % des bugs de débutant se résolvent après une lecture honnête de la traceback. Les 10 % restants demandent les étapes suivantes.

### Étape 3 — Isoler en ajoutant des `print`

Le plus ancien outil de déboguage, et toujours le plus efficace : **afficher l'état des variables** à des endroits stratégiques.

```python
for ligne in donnees:
    print(f"DEBUG: ligne = {ligne!r}")      # affiche le contenu
    print(f"DEBUG: type(ligne) = {type(ligne)}")
    traitement(ligne)
```

Quelques bonnes pratiques :

- **Préfixe tes prints de debug** (`DEBUG:`, `>>>`, etc.) pour les reconnaître et les retirer facilement.
- Utilise `repr()` ou `{variable!r}` dans une f-string pour voir la représentation **exacte** (avec les guillemets, pour distinguer `5` de `"5"`).
- Affiche le **type** si tu doutes.
- Affiche **avant et après** une opération pour voir ce qu'elle change.

```python
print(f">>> avant: {liste}")
liste.append(x)
print(f">>> après: {liste}")
```

### Étape 4 — Former une hypothèse et la tester

Tu as identifié une zone suspecte. Formule **une** hypothèse précise :

> « Je pense que `ligne` est parfois `None`, ce qui fait échouer `traitement`. »

Puis teste-la :

```python
for ligne in donnees:
    if ligne is None:
        print(f"DEBUG: ligne None trouvée à {i}")
    traitement(ligne)
```

Si tu vois un print, hypothèse confirmée. Sinon, formule-en une autre.

**Piège classique** : essayer plusieurs hypothèses à la fois en changeant plusieurs choses. Tu ne sauras plus ce qui a corrigé quoi. Change **une chose à la fois**, teste, puis passe à la suivante.

### Étape 5 — Corriger, vérifier, comprendre

Quand la cause est identifiée :

1. **Corrige** — idéalement la cause, pas juste le symptôme.
2. **Re-teste** avec le cas qui a planté, puis avec d'autres cas similaires.
3. **Comprends** — pourquoi ton modèle mental initial était faux ? Tu apprendras beaucoup plus en comprenant qu'en patchant aveuglément.

Si tu ne comprends pas pourquoi ta correction marche, tu es dans un état dangereux : tu as « résolu » le symptôme mais le bug va revenir.

## Le débogueur de PyCharm

Au-delà des `print`, PyCharm a un vrai débogueur :

- Clique à gauche du numéro de ligne pour poser un **point d'arrêt** (*breakpoint*) — un rond rouge.
- Lance ton code en mode debug : `Shift + F9` (Windows) / `Ctrl + D` (macOS), ou clique sur le petit insecte vert.
- Le programme s'arrête au point d'arrêt. Tu peux alors :
  - Voir **toutes les variables** en cours (panneau « Variables »).
  - **Avancer ligne par ligne** (`F8`).
  - **Entrer dans une fonction** (`F7`).
  - **Continuer jusqu'au prochain point d'arrêt** (`F9`).

Le débogueur est **indispensable** dès que le bug est complexe. Apprends-le tôt.

Dans un notebook : tu peux aussi insérer `breakpoint()` dans ton code et lancer la cellule en mode debug. Ou, plus simple, utiliser des `print` — les notebooks se prêtent bien à cette approche.

## Le canard en plastique (*rubber duck*)

Une technique célèbre et étonnamment efficace : **explique ton problème à voix haute à un canard en plastique** (ou à n'importe quel objet inanimé, ou à un collègue qui ne connaît pas le code).

Pourquoi ça marche : en formulant le problème en langage naturel, tu es **forcé·e** d'articuler ce que tu attends, ce qui se passe, et ta théorie. Très souvent, **tu trouves la solution à mi-chemin de ta propre explication**, avant même que le canard ait « répondu ».

Ce n'est pas une blague. Les meilleurs programmeurs du monde font ça.

## Les bugs les plus fréquents en Python

### 1. Indentation / espaces mélangés aux tabs

Symptômes : `IndentationError`, `TabError`. PyCharm signale.

### 2. Confusion `=` / `==`

En dehors d'un `if`, Python ne te prévient pas. Si tu écris `total = 0` quand tu voulais `total == 0`, tu as silencieusement écrasé ta variable.

### 3. Modification pendant l'itération

Vu au chapitre 6 leçon 2 — ne modifie pas une liste qu'on itère.

### 4. Alias de listes

```python
a = [1, 2, 3]
b = a
# Modifier b modifie a aussi
```

Cause de bugs silencieux très fréquents.

### 5. Comparaison de floats

`0.1 + 0.2 == 0.3` est `False`. Utilise `math.isclose`.

### 6. Valeur par défaut mutable dans une fonction

```python
# PIÈGE CÉLÈBRE
def ajouter_un(liste=[]):
    liste.append(1)
    return liste

ajouter_un()    # [1]
ajouter_un()    # [1, 1] !!!  — la même liste est réutilisée
```

Convention : mettre `None` et créer la liste à l'intérieur.

```python
def ajouter_un(liste=None):
    if liste is None:
        liste = []
    liste.append(1)
    return liste
```

### 7. Scope des variables

Une variable définie dans une fonction est **locale** à cette fonction. Si tu essaies d'y accéder de l'extérieur, `NameError`. On approfondira en S2.

## Attitude mentale

- **Sérénité**. Le bug ne t'en veut pas. Il est reproductible, explicable, corrigeable.
- **Humilité**. 95 % des bugs sont de ta faute. 5 % sont dans les bibliothèques — et quand c'est le cas, **prouve-le** avant de l'affirmer.
- **Patience**. Un bug qui résiste 2 heures n'est pas un bug plus grave. C'est un bug plus caché. La méthode reste la même.
- **Notes**. Quand tu résous un bug non-trivial, **écris** ce que tu as appris. Dans ton Zettelkasten, dans un carnet. Tu vas le revoir.

## À retenir

- Le débogage est une **enquête méthodique**, pas de la divination.
- **Lis la traceback** de bas en haut avant d'agir.
- **`print` + `repr()`** suffit pour 80 % des bugs.
- Une hypothèse à la fois. Une modification à la fois.
- **Rubber duck** — explique à voix haute, tu trouveras souvent seul·e.
- Apprends **le débogueur** de PyCharm pour les bugs sérieux.

---

> **Fin du chapitre 6.** Tu sais faire décider, répéter et réagir aux erreurs — le trio qui transforme des scripts jouets en vrais programmes.
>
> **Prochain chapitre** : les **tableurs**. Python n'a pas remplacé Excel — il le complète. Un bon analyste maîtrise les deux.
