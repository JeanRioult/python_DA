# Code lisible : commentaires, style, nommage

*Temps estimé : 15 minutes*

## Rappel

Sans regarder :

1. Quelle est la différence entre `/` et `//` en Python ?
2. Pourquoi `input` demande souvent une conversion de type ?
3. Que signifie `n % 2 == 0` ?

## Le code est lu plus souvent qu'écrit

Tu écris un bout de code en 5 minutes. Tu le relis trois semaines plus tard pour le corriger. Ton collègue le lit pour le comprendre. Un recruteur le lit dans ton portfolio. Toi, dans six mois, tu le relis sans avoir aucun souvenir de pourquoi tu l'as écrit comme ça.

**Ton code est lu bien plus souvent qu'il n'est écrit.** Investir 10 % de temps supplémentaire pour écrire lisiblement te fait économiser 10× ce temps en maintenance.

## PEP 8 — le guide de style

Python a un document officiel de style : **PEP 8**. Tout le monde en Python le connaît ; s'en écarter, c'est parler avec un accent bizarre. Les éditeurs modernes (PyCharm inclus) le signalent automatiquement — traite ses avertissements comme des erreurs.

Les règles les plus importantes pour débuter :

### Indentation

Python **force** l'indentation. Contrairement à d'autres langages, ce n'est pas décoratif.

```python
if age >= 18:
    print("Majeur")         # 4 espaces d'indentation, obligatoire
    print("Deuxième ligne") # même indentation que la 1ère
```

- **4 espaces**, pas des tabulations (PyCharm les insère pour toi quand tu appuies Tab).
- **Pas de mélange** tab/espaces dans le même fichier. PyCharm te prévient si ça arrive.

### Espaces autour des opérateurs

```python
# Bon
x = 10
y = x + 2
if x > 5:
    pass

# Mauvais
x=10
y=x+2
if x>5:
    pass
```

Un espace autour de `=`, `+`, `>`, etc. Sauf dans les arguments par défaut : `fonction(x=5)`, pas `fonction(x = 5)`.

### Lignes pas trop longues

PEP 8 recommande **79 caractères max** par ligne (ou 99 dans un projet moderne). Une ligne trop longue est illisible — découpe-la.

```python
# Trop long
resultat = fonction_au_nom_tres_long(argument_un, argument_deux, argument_trois, argument_quatre)

# Mieux
resultat = fonction_au_nom_tres_long(
    argument_un,
    argument_deux,
    argument_trois,
    argument_quatre,
)
```

PyCharm a une ligne verticale (souvent à 120) qui te signale visuellement la limite.

### Deux lignes vides entre fonctions / deux espaces entre phrases

Aère ton code. Les blocs collés fatiguent l'œil.

## Nommer bien

### Règles de base (rappel)

- `snake_case` pour variables et fonctions.
- `PascalCase` pour les classes (en S2).
- `MAJUSCULES_AVEC_UNDERSCORES` pour les constantes (`TAUX_TVA = 0.2`).

### Noms parlants, pas cryptiques

```python
# Mauvais
d = {}
l = [1, 2, 3]
for x in l:
    d[x] = x * 2

# Bon
carrés_par_valeur = {}
valeurs = [1, 2, 3]
for valeur in valeurs:
    carrés_par_valeur[valeur] = valeur * 2
```

Exception légitime : les variables de boucle très courtes (`i`, `j`, `k` pour des indices), les variables temporaires très locales.

### Évite les abréviations non-standard

```python
# Mauvais
nb_ut_act = 100       # nombre d'utilisateurs actifs ? nettoyeur ultra-tonique ?
pr = 99.99            # prix ? progrès ? probabilité ?

# Bon
nb_utilisateurs_actifs = 100
prix = 99.99
```

Les abréviations qui sont devenues du vocabulaire (comme `df` pour DataFrame, `ax` pour matplotlib axes, `url`, `id`) sont acceptables **parce qu'elles sont standards**. Les tiennes, non.

### Noms booléens

Un booléen doit se lire comme une question à laquelle on répond vrai/faux :

```python
est_connecte = True                 # bon
a_fini = False                      # bon
existe = True                       # bon
peut_modifier = user.has_permission # bon

connexion = True                    # mauvais (ambigu — ce n'est pas une question)
```

Préfixes usuels : `est_`, `a_`, `peut_`, `doit_`, `existe`, `has_`, `can_`, `should_`.

### Noms de fonctions

Un verbe, ou verbe + objet :

```python
calculer_total()        # bon
afficher_resultat()     # bon
total()                 # mauvais — ambigu, c'est une fonction ou une variable ?
le_gros_calcul()        # mauvais — quel verbe ?
```

## Commentaires : le paradoxe

**Règle générale** : n'écris un commentaire que quand le **pourquoi** n'est pas évident. Le *quoi* doit transparaître dans des noms bien choisis.

### Mauvais commentaire

```python
# On incrémente x de 1
x += 1
```

On voit bien qu'on incrémente. Le commentaire parasite.

### Bon commentaire

```python
# Offset de 1 parce que l'API externe compte à partir de 1, pas de 0.
# Documenté ici : https://api.example.com/docs#pagination
page += 1
```

Là, le *pourquoi* n'était pas évident. Le commentaire a une vraie valeur.

### Quand un commentaire est utile

- **Choix non-évident** : « on utilise la médiane car les outliers dominent la moyenne dans cette distribution ».
- **Avertissement** : « ATTENTION : cette fonction modifie `df` en place ».
- **Référence** : « Basé sur l'algorithme de Welford, 1962 ».
- **TODO / FIXME** : « # TODO: gérer le cas des utilisateurs supprimés » — et tu crées un ticket pour ne pas oublier.

### Quand un commentaire est inutile (voire nuisible)

- Paraphrase le code : « # On fait la somme ».
- Explique un nom qui devrait être clair : « # c est la capacité ».
- Commentaire obsolète : la fonction a changé, le commentaire n'a pas suivi. Un commentaire menteur est pire qu'un code sans commentaire.

**Règle** : chaque fois que tu as envie d'écrire un commentaire, demande-toi d'abord si renommer une variable ou extraire une fonction aux rendrait le commentaire inutile.

## Les docstrings (pour plus tard)

Quand tu écriras tes premières fonctions (Ch6), tu leur donneras une **docstring** — une chaîne de documentation juste sous la signature :

```python
def calculer_tva(prix_ht: float, taux: float = 0.20) -> float:
    """Calcule la TVA applicable à un prix hors taxe.

    Args:
        prix_ht: le prix avant TVA, en euros.
        taux: le taux de TVA applicable (défaut 20 %).

    Returns:
        Le montant de la TVA, en euros.
    """
    return prix_ht * taux
```

Les docstrings sont lues par les outils (auto-complétion, génération de doc). Écris-en pour toute fonction non-triviale.

## Les annotations de type (pour plus tard aussi)

Python n'oblige pas à typer, mais tu peux :

```python
age: int = 20
prenom: str = "Léa"

def double(x: float) -> float:
    return x * 2
```

Les `: int`, `: str`, `-> float` ne sont **pas vérifiés à l'exécution** par Python. Ce sont des indications pour le lecteur et les outils (comme `mypy`). On les intègre graduellement à partir de S2.

## Formateurs automatiques

Il existe des outils qui reformatent ton code selon PEP 8 automatiquement. Les deux principaux :

- **black** — formatage strict, pas d'options. Tu lui passes un fichier, il le reformate.
- **ruff** — plus récent, très rapide, formatage + détection d'erreurs de style.

Installe l'un des deux dès maintenant :

```bash
pip install black
```

Puis dans PyCharm : `Settings → Tools → Black → On save`. À partir de là, tes fichiers sont automatiquement reformatés à chaque sauvegarde. **Fin des débats de style**.

## Un petit exercice — relis ton code

Prends n'importe quel morceau de code que tu as écrit (même un `main.py` jeté hier). Lis-le **à voix haute**, ligne par ligne.

- Les noms se comprennent-ils sans que tu doives regarder les commentaires ?
- Y a-t-il des abréviations qu'un étranger ne décoderait pas ?
- Une ligne dépasse-t-elle 99 caractères ?
- Les espaces autour des opérateurs sont-ils cohérents ?

Si tu hésites ou bute sur un passage, c'est le signal qu'il faut refactoriser avant d'ajouter du code.

## À retenir

- **Le code est lu plus souvent qu'écrit** — optimise pour la lecture.
- **PEP 8** est la référence partagée : suis-la, même quand ça paraît pédant.
- **Noms parlants**, snake_case, pas d'abréviations maison, booléens qui se lisent comme des questions.
- Un **commentaire** documente le **pourquoi** — pas le quoi.
- **black** ou **ruff** pour ne plus débattre du style.

---

> **Fin du chapitre 5.** Tu as Python installé, tu sais manipuler des variables et faire de l'arithmétique, et tu sais écrire du code lisible. Tu es prêt·e pour la suite — le contrôle du flux (conditions, boucles, erreurs) en chapitre 6.
>
> Mais avant, un détour : **chapitre 4 — les mathématiques fondamentales**. Pour qu'aucune formule ne te perde plus jamais.
