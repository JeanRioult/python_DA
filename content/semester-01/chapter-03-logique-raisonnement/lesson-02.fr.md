# Logique propositionnelle et tables de vérité

*Temps estimé : 15 minutes*

## Rappel

Sans regarder :

1. Quels sont les deux rôles mentaux d'un analyste ?
2. Qu'est-ce que le principe de charité ?
3. Pourquoi « le sport aide à mieux réussir à l'école » est-il un raisonnement fragile ?

## Une proposition, c'est vrai ou faux

La **logique propositionnelle** manipule des énoncés qui sont soit **vrais**, soit **faux**. Pas « peut-être vrai », pas « un peu vrai » — on est dans un monde binaire.

Exemples de propositions :

- *Il pleut.*
- *Le fichier contient plus de 1000 lignes.*
- *L'utilisateur est connecté.*

On note ces propositions par des lettres : `P`, `Q`, `R`. La valeur de vérité est `V` (vrai) ou `F` (faux), parfois notée `1` / `0` (tu retrouveras ça en code).

Les **non-propositions** (qu'on ne peut classer ni vrai ni faux) existent aussi : « Quelle heure est-il ? », « Passe-moi le sel. » La logique propositionnelle ne les traite pas.

## Les cinq opérateurs fondamentaux

À partir de propositions, on en construit de plus complexes avec cinq connecteurs.

### 1. NON — la négation (`¬P`)

Inverse la valeur de vérité.

| `P` | `¬P` |
| --- | ---- |
| V   | F    |
| F   | V    |

En Python : `not p`. En SQL : `NOT p`.

### 2. ET — la conjonction (`P ∧ Q`)

Vrai **seulement si les deux** sont vrais.

| `P` | `Q` | `P ∧ Q` |
| --- | --- | ------- |
| V   | V   | V       |
| V   | F   | F       |
| F   | V   | F       |
| F   | F   | F       |

En Python : `p and q`. En SQL : `p AND q`.

### 3. OU — la disjonction (`P ∨ Q`)

Vrai si **au moins un** des deux est vrai. (C'est le « ou inclusif ».)

| `P` | `Q` | `P ∨ Q` |
| --- | --- | ------- |
| V   | V   | V       |
| V   | F   | V       |
| F   | V   | V       |
| F   | F   | F       |

En Python : `p or q`. En SQL : `p OR q`.

**Attention** : « ou » en français est souvent **exclusif** (« fromage ou dessert » : pas les deux). En logique et en code, `or` est **inclusif** par défaut. Cette différence cause de vrais bugs chez les débutants.

### 4. IMPLIQUE — l'implication (`P → Q`)

« Si P alors Q ». C'est le plus piégeux. Vrai **sauf** dans un cas : quand P est vrai et Q est faux.

| `P` | `Q` | `P → Q` |
| --- | --- | ------- |
| V   | V   | V       |
| V   | F   | **F**   |
| F   | V   | V       |
| F   | F   | V       |

Ce qui surprend : **quand `P` est faux, `P → Q` est toujours vrai**, peu importe `Q`. « Si la lune est en fromage, alors 2+2=5 » est logiquement vrai — parce que l'antécédent est faux, l'implication tient par défaut. On appelle ça le *vide de sens* : on ne peut pas prouver qu'elle est fausse, donc elle est vraie par convention.

Conséquence concrète : si quelqu'un te dit « *si* ce client a + de 50 ans *alors* il doit être en catégorie Senior », et que le client a 30 ans, la règle n'est **ni violée, ni respectée** — elle ne s'applique pas. On ne peut pas dire si elle marche.

### 5. ÉQUIVAUT — l'équivalence (`P ↔ Q`)

Vrai quand **les deux ont la même valeur**.

| `P` | `Q` | `P ↔ Q` |
| --- | --- | ------- |
| V   | V   | V       |
| V   | F   | F       |
| F   | V   | F       |
| F   | F   | V       |

« P si et seulement si Q ». L'équivalence est double implication : `P ↔ Q` ≡ `(P → Q) ∧ (Q → P)`.

## Comment lire une expression complexe

L'expression `(P ∧ ¬Q) ∨ R` se lit :

1. Priorité aux **parenthèses**, puis `¬`, puis `∧`, puis `∨`, puis `→`, puis `↔`.
2. On calcule d'abord `¬Q`, puis `P ∧ ¬Q`, puis le `∨ R`.

Pour connaître la valeur de vérité, on construit une **table de vérité** avec **toutes les combinaisons** des variables de base.

Avec 3 variables (`P`, `Q`, `R`), il y a 2³ = 8 lignes.

## Les équivalences à connaître

Certaines expressions sont équivalentes — elles ont la même table de vérité, donc même sens logique. Les quatre plus utiles :

### Double négation

`¬(¬P) ≡ P`

### Lois de De Morgan

`¬(P ∧ Q) ≡ ¬P ∨ ¬Q`
`¬(P ∨ Q) ≡ ¬P ∧ ¬Q`

Traduction pratique : **la négation transforme les ET en OU et vice-versa**. Très utile en filtrage de données.

Exemple : « je veux tous les utilisateurs qui ne sont pas (majeurs ET actifs) » devient « ceux qui sont mineurs OU inactifs ». Beaucoup plus facile à coder.

### Contraposition

`P → Q ≡ ¬Q → ¬P`

« Si P alors Q » est équivalent à « si pas Q alors pas P ». C'est la base de la preuve par contraposition.

**Ce n'est PAS la même chose que :**

- La **réciproque** `Q → P` (« si Q alors P ») — **pas** équivalente à l'implication de départ !
- L'**inverse** `¬P → ¬Q` (« si pas P alors pas Q ») — pas équivalente non plus !

Confondre une implication avec sa réciproque est l'erreur numéro un des débutants en logique.

Exemple : « *Si il pleut, alors le sol est mouillé*. » Correct. La contraposition : « Si le sol n'est pas mouillé, alors il ne pleut pas. » Correct. La réciproque : « Si le sol est mouillé, alors il pleut. » **Fausse** — quelqu'un a pu arroser.

## Exercice mental

Considère la règle d'entreprise : « *Si un employé est cadre alors il a un badge rouge.* »

- Version contraposée (équivalente) : **Si un employé n'a pas de badge rouge alors il n'est pas cadre.**
- Version réciproque (**pas** équivalente) : « Si un employé a un badge rouge alors il est cadre. » **Faux** — les visiteurs pourraient aussi avoir un badge rouge.

Quand tu lis ou tu écris des règles métier, pose-toi la question : ai-je confondu avec la réciproque ?

## De la logique au code

Les opérateurs ci-dessus existent **tous** en Python :

```python
p = True
q = False
r = True

# NON, ET, OU
print(not p)        # False
print(p and q)      # False
print(p or q)       # True

# Lois de De Morgan (vraies quoi que soient p, q)
print(not (p and q) == (not p or not q))   # True
print(not (p or q) == (not p and not q))   # True
```

Pour l'implication, il n'y a pas d'opérateur natif mais :

```python
implique = (not p) or q    # équivalent à "p implique q"
```

Connaître l'équivalence `(P → Q) ≡ (¬P ∨ Q)` te permet de coder une implication en Python ou en SQL.

## À retenir

- Cinq opérateurs : `¬`, `∧`, `∨`, `→`, `↔`.
- Le « ou » logique est **inclusif** (« au moins un »).
- `P → Q` est vrai par défaut quand `P` est faux — attention au piège.
- **De Morgan** et **contraposition** sont les deux transformations qui resservent partout.
- **Ne confonds jamais** implication et réciproque.

---

> **La prochaine fois** : on monte d'un cran — au lieu de combiner des propositions, on distingue *trois modes* de raisonnement (déduction, induction, abduction). Le mode que tu utilises détermine ce que ta conclusion peut prétendre.
