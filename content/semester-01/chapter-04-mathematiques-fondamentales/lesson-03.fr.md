# Algèbre : équations et inconnues

*Temps estimé : 15 minutes*

## Rappel

Sans regarder :

1. Comment calculer la variation en pourcentage entre deux valeurs ?
2. Pourquoi +20 % suivi de −20 % ne ramène pas au point de départ ?
3. Quelle est la différence entre *points* et *pourcentages* ?

## Pourquoi des inconnues

Jusqu'ici tu as fait des calculs où **tous les nombres étaient connus**. L'algèbre introduit un outil nouveau : le **symbole qui remplace un nombre inconnu**. On l'appelle traditionnellement $x$, mais ça peut être n'importe quelle lettre : $y$, $n$, $a$, $\alpha$…

Pourquoi c'est utile :

- **Exprimer une règle générale** : « l'aire d'un rectangle est $L \times l$ » — vrai quels que soient $L$ et $l$.
- **Poser et résoudre un problème** : « combien de clients faut-il pour rentabiliser tel investissement ? » devient une **équation** en une inconnue.
- **Manipuler les formules** qu'on trouve partout en analyse : $\text{CA} = \text{prix} \times \text{quantité}$, $p = \frac{k}{n}$, etc.

## Une équation, c'est quoi

Une **équation** est une affirmation d'**égalité** entre deux expressions, dont l'une (ou les deux) contient une inconnue.

$$3x + 2 = 11$$

Cette équation dit : « quel $x$ rend cette égalité vraie ? » **Résoudre** une équation, c'est trouver le ou les $x$ qui la rendent vraie.

### Résolution du petit exemple

$$3x + 2 = 11$$

On isole $x$ en **faisant la même chose des deux côtés** :

Étape 1 : soustraire 2 des deux côtés.

$$3x + 2 - 2 = 11 - 2$$
$$3x = 9$$

Étape 2 : diviser par 3 des deux côtés.

$$\frac{3x}{3} = \frac{9}{3}$$
$$x = 3$$

**Vérification** (obligatoire, pour détecter les erreurs) : $3 \times 3 + 2 = 11$. ✓

### La règle d'or

**Tout ce que tu fais à un côté, tu dois le faire à l'autre.** C'est la seule règle de la résolution d'équations. Tout le reste n'est que sa conséquence.

- Ajouter une même quantité des deux côtés.
- Soustraire une même quantité des deux côtés.
- Multiplier par un même nombre **non nul** des deux côtés.
- Diviser par un même nombre **non nul** des deux côtés.

**Jamais** diviser par zéro (règle absolue en mathématiques). Si l'équation t'y amène, c'est que tu dois distinguer des cas (l'inconnue peut *être* zéro).

## Les opérations inverses

Chaque opération a un **inverse** qui la défait :

| Opération     | Inverse       |
| ------------- | ------------- |
| Ajouter $a$   | Soustraire $a$ |
| Soustraire $a$ | Ajouter $a$   |
| Multiplier par $a$ | Diviser par $a$ (si $a \neq 0$) |
| Diviser par $a$   | Multiplier par $a$ |
| Élever au carré   | Racine carrée (attention aux signes) |
| Racine carrée     | Élever au carré |
| $10^x$            | $\log_{10}$     |
| $\log_{10}(x)$    | $10^x$          |

Résoudre une équation = « défaire » les opérations qui entourent l'inconnue, **dans l'ordre inverse** de PEMDAS.

## Exemple un peu moins trivial

$$\frac{2x + 3}{5} = 7$$

On défait la division par 5 (donc on multiplie par 5) :

$$2x + 3 = 35$$

On défait l'addition de 3 :

$$2x = 32$$

On défait la multiplication par 2 :

$$x = 16$$

Vérification : $\frac{2 \times 16 + 3}{5} = \frac{35}{5} = 7$. ✓

## Équations à développer

Certaines expressions doivent être **développées** (ouvertes) avant de pouvoir résoudre.

$$2(x + 4) = 14$$

Deux options :

**Option A** : développer d'abord. $2x + 8 = 14$, puis $2x = 6$, puis $x = 3$.

**Option B** : diviser par 2 directement. $x + 4 = 7$, puis $x = 3$.

Les deux donnent la même réponse. Le choix dépend de ce qui paraît plus simple. Entraîne-toi aux deux.

### Règles de développement

$$a(b + c) = ab + ac$$

$$(a + b)(c + d) = ac + ad + bc + bd$$

Exemple :

$$(x + 2)(x - 3) = x^2 - 3x + 2x - 6 = x^2 - x - 6$$

### Identités remarquables

Trois à retenir absolument :

$$(a + b)^2 = a^2 + 2ab + b^2$$

$$(a - b)^2 = a^2 - 2ab + b^2$$

$$(a + b)(a - b) = a^2 - b^2$$

Elles reviennent en statistiques (variance), en algèbre linéaire (produits scalaires), et dans la vie quotidienne du calcul.

## Les équations du second degré

Une équation quadratique a la forme :

$$ax^2 + bx + c = 0 \quad \text{avec } a \neq 0$$

La formule de résolution (à connaître, même si les outils la calculent pour toi) :

$$x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$$

Le **discriminant** $\Delta = b^2 - 4ac$ dit combien de solutions on a :

- $\Delta > 0$ : **deux** solutions réelles distinctes.
- $\Delta = 0$ : **une** solution réelle (double).
- $\Delta < 0$ : **pas** de solution réelle (il y en a deux *complexes*, qu'on ne couvre pas ici).

Exemple : $x^2 - 5x + 6 = 0$. $\Delta = 25 - 24 = 1$. Donc $x = \frac{5 \pm 1}{2}$, soit $x = 3$ ou $x = 2$.

Tu rencontreras les équations du second degré quand tu travailleras avec :

- des trajectoires (mouvement parabolique),
- des optimisations simples (coût = fonction quadratique),
- des régressions polynomiales (tu les verras au semestre 4).

## Systèmes d'équations à deux inconnues

Deux équations, deux inconnues :

$$\begin{cases} x + y = 10 \\ 2x - y = 2 \end{cases}$$

Deux méthodes principales :

### Méthode par substitution

Isole une inconnue dans une équation, puis substitue dans l'autre.

De la première : $y = 10 - x$. Substituer dans la seconde :

$$2x - (10 - x) = 2$$
$$3x - 10 = 2$$
$$x = 4$$

Alors $y = 10 - 4 = 6$. Solution : $(x, y) = (4, 6)$.

### Méthode par addition / combinaison

On combine les deux équations pour éliminer une inconnue. Additionner les deux lignes ci-dessus élimine $y$ :

$$(x + y) + (2x - y) = 10 + 2$$
$$3x = 12$$
$$x = 4$$

Puis on revient chercher $y$.

**Interprétation géométrique** : chaque équation représente une droite dans le plan. La solution du système est leur **point d'intersection**. Si les droites sont parallèles, pas de solution. Si elles sont confondues, une infinité.

## L'algèbre au service de l'analyste

Pour un analyste, résoudre des équations n'est pas juste un exercice scolaire :

- **Seuil de rentabilité** : combien d'unités vendues pour couvrir les coûts fixes ? (équation linéaire)
- **Partage d'un budget** sous contraintes : système d'équations.
- **Inverser une métrique** : tu connais la marge en %, tu cherches le prix de vente.
- **Identifier la formule** utilisée par un outil à partir de ses sorties.
- **Vérifier des règles métier** : l'outil applique-t-il vraiment la formule documentée ?

Savoir manipuler des inconnues symboliques est une gymnastique mentale qui sert **à chaque** question un peu structurée.

## À retenir

- Une équation = une égalité entre expressions avec une ou des inconnues.
- **Règle d'or** : tout ce qu'on fait à un côté, on le fait à l'autre. Jamais diviser par zéro.
- Trois **identités remarquables** à connaître par cœur.
- Équation du 2nd degré : formule $x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$, signe du discriminant → nombre de solutions.
- Un système à deux équations et deux inconnues = un point d'intersection de deux droites.

---

> **La prochaine fois** : les **fonctions**. Une fonction, c'est une machine : tu donnes un $x$, elle te rend un $f(x)$. C'est la notion la plus centrale des maths d'un analyste.
