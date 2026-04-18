# Fonctions et graphiques

*Temps estimé : 15 minutes*

## Rappel

Sans regarder :

1. Quelle est la règle d'or de la résolution d'équations ?
2. Que dit le signe du discriminant $\Delta$ sur les solutions d'une équation quadratique ?
3. Quelle est l'identité $(a + b)^2$ développée ?

## Une fonction, c'est une machine

Une **fonction** prend **une entrée** (appelée **argument** ou **variable**) et rend **une sortie**. Rien de plus exotique qu'un distributeur automatique : on met une pièce, on obtient une boisson. En maths :

$$f(x) = 2x + 3$$

Pour $x = 4$, on calcule $f(4) = 2 \times 4 + 3 = 11$.

Pour $x = -1$, on calcule $f(-1) = 2 \times (-1) + 3 = 1$.

On lit « $f$ de $x$ ». Le nom $f$ peut être remplacé par n'importe quelle lettre ($g$, $h$, $T$, $\phi$…).

### Domaine et image

- Le **domaine** d'une fonction, c'est l'ensemble des valeurs d'entrée **autorisées**.
- L'**image** (ou *range*), c'est l'ensemble des valeurs de sortie que la fonction peut prendre.

Exemple : $f(x) = \frac{1}{x}$. Domaine : tous les réels **sauf 0** (on ne divise pas par zéro). Image : tous les réels sauf 0.

Exemple : $f(x) = \sqrt{x}$. Domaine : $x \geq 0$ (pas de racine carrée de négatif, en réel). Image : $y \geq 0$.

Connaître le domaine est **critique** pour un analyste — c'est ce qui détermine quand ta formule s'applique **légitimement** et quand elle dérape (division par zéro, logarithme de zéro, etc.).

## Le graphique d'une fonction

On représente une fonction sur un **plan** avec deux axes :

- Axe horizontal (**abscisses**) : $x$ (l'entrée).
- Axe vertical (**ordonnées**) : $y = f(x)$ (la sortie).

Chaque point du graphe a des coordonnées $(x, f(x))$. L'ensemble de ces points forme la **courbe représentative** de la fonction.

### Lire un graphique

Quelques questions-réflexes à se poser devant **tout** graphique (dans un article, un rapport, un dashboard) :

- Que représente chaque axe ? Quelle est leur unité ? Leur échelle ?
- L'origine est-elle à zéro — ou tronquée ?
- La courbe est-elle continue ? En escaliers ? Un nuage de points ?
- Quelle est la tendance globale ? Y a-t-il des points qui dépareillent ?
- Quelle est la plage des valeurs ? (les extrêmes)

**Red flag** : un graphique sans étiquettes d'axes ou sans unité. Ce n'est pas un graphique, c'est une illustration — aucune conclusion rigoureuse ne peut en sortir.

## Types de fonctions à connaître

### La fonction constante

$$f(x) = c \quad (\text{par exemple } f(x) = 5)$$

Son graphique est une **droite horizontale**. Quel que soit $x$, la sortie est $c$.

### La fonction linéaire

$$f(x) = ax$$

Son graphique est une **droite passant par l'origine**. $a$ est la **pente** : pour chaque augmentation d'une unité de $x$, la sortie augmente de $a$ unités.

Si $a = 2$ : la droite monte de 2 chaque fois qu'on avance de 1 en $x$.

### La fonction affine

$$f(x) = ax + b$$

Son graphique est une **droite**. $a$ est la pente ; $b$ est l'**ordonnée à l'origine** (la valeur de $f$ quand $x = 0$, l'endroit où la droite coupe l'axe des $y$).

La distinction linéaire/affine est souvent négligée mais compte : une fonction *linéaire* a $b = 0$ (passe par l'origine), une fonction *affine* a un $b$ quelconque. En pratique, la plupart des « régressions linéaires » sont en réalité affines ($ax + b$).

### La fonction quadratique

$$f(x) = ax^2 + bx + c$$

Son graphique est une **parabole**.

- Si $a > 0$ : la parabole est ouverte vers le haut ($\cup$).
- Si $a < 0$ : la parabole est ouverte vers le bas ($\cap$).

Les parabloles apparaissent dans les trajectoires physiques, les coûts marginaux, les modèles d'optimisation simples.

### La fonction inverse

$$f(x) = \frac{1}{x}$$

Domaine : $x \neq 0$. Quand $x$ grandit, $f(x)$ diminue et s'approche de 0 (sans jamais l'atteindre). Quand $x$ s'approche de 0, $f(x)$ explose vers $+\infty$ ou $-\infty$ selon le signe.

### La fonction exponentielle

$$f(x) = a^x \quad (\text{avec } a > 0)$$

Croissance beaucoup plus rapide que toutes les fonctions polynomiales. Cas particulier fondamental : $f(x) = e^x$, où $e \approx 2{,}718$ est la base naturelle des logarithmes. En analyse : croissance démographique, intérêts composés, réactions chimiques.

### La fonction logarithmique

$$f(x) = \log_a(x)$$

C'est l'**inverse** de la fonction exponentielle : si $a^y = x$, alors $\log_a(x) = y$.

- Domaine : $x > 0$ (pas de logarithme d'un nombre négatif ou nul en réel).
- Croissance très lente : $\log_{10}(1000) = 3$, $\log_{10}(10\,000) = 4$. Multiplier par 10 ajoute juste 1.

Trois bases courantes :

- $\log_{10}$ : base 10 (« log décimal »).
- $\ln$ : base $e$ (« log naturel » ou « népérien »). **En statistiques et en sciences, le log par défaut est $\ln$**.
- $\log_2$ : base 2 (en informatique).

Les logarithmes sont **omniprésents** en analyse :

- Échelles log (« log scale ») pour visualiser des distributions à longue queue (revenus, tailles de villes).
- Transformation log avant une régression quand la relation est multiplicative.
- Mesures en décibels ($dB$), magnitudes d'étoiles, Richter — toutes en log.

## Propriétés clés à mémoriser

### Exponentielle

$$a^{x+y} = a^x \times a^y$$

$$a^{x-y} = \frac{a^x}{a^y}$$

$$(a^x)^y = a^{xy}$$

### Logarithme

$$\log(a \times b) = \log(a) + \log(b)$$

$$\log\left(\frac{a}{b}\right) = \log(a) - \log(b)$$

$$\log(a^n) = n \times \log(a)$$

**Conséquence magique** : le logarithme transforme les **multiplications en additions**. C'est pour ça qu'il est si utile : un produit devient une somme, beaucoup plus facile à manipuler et à modéliser.

## Les fonctions dans le monde réel

Un analyste parle en fonctions tout le temps, même sans le dire :

- « Le revenu **en fonction de** l'âge »
- « Le taux de conversion **en fonction du** canal d'acquisition »
- « Le temps de réponse serveur **en fonction du** nombre de requêtes »

Chaque corrélation dans un dataset est une fonction *approximative* : si je connais $x$, je peux estimer $y$. La **modélisation statistique** (régression, ML) consiste à trouver une fonction $f$ telle que $y \approx f(x)$ soit « bon » sur les données observées.

## À retenir

- Une **fonction** associe à une entrée $x$ une sortie $f(x)$ unique.
- Le **domaine** = où la fonction est définie ; connaître le domaine est critique.
- Familles clés : constante, linéaire, affine, quadratique, inverse, exponentielle, logarithmique.
- **Log transforme les produits en sommes** — $\log(a \cdot b) = \log(a) + \log(b)$.
- Sur un graphique : toujours étiqueter les axes, indiquer l'unité et l'origine.

---

> **La prochaine fois** : un zoom sur le modèle le plus utilisé en analyse — le **modèle linéaire/affine**. Comment on l'écrit, comment on l'interprète, où il marche, où il casse.
