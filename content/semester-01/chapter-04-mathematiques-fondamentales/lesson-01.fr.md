# Arithmétique et fractions

*Temps estimé : 15 minutes*

## Rappel

Sans regarder :

1. Quelle est la différence entre `//` et `/` en Python ?
2. Pourquoi préférer une f-string à la concaténation ?
3. Qu'est-ce que la convention `snake_case` ?

## Un préambule — pourquoi les maths pour un analyste

Un analyste n'a pas besoin d'être Cédric Villani. Il a besoin d'être **fluide** avec les maths de base, pour :

- Lire une formule sans paniquer (un papier scientifique, un *data dictionary*, une règle métier).
- Manipuler un pourcentage sans se tromper de dénominateur.
- Comprendre ce qu'une moyenne pondérée *signifie* avant de la calculer.
- Lire un graphique et savoir ce qu'il dit **et ne dit pas**.

Beaucoup d'analystes dysfonctionnent parce que leurs bases mathématiques sont trouées. Ce chapitre bouche les trous. **On reprend tout depuis le début**, sans honte. Si tu maîtrises déjà, ce chapitre te prend une heure. Si tu es rouillé·e, il vaut trois.

## Les quatre opérations de base

Tu connais : addition ($+$), soustraction ($-$), multiplication ($\times$), division ($\div$ ou $/$).

En maths écrites, la multiplication est souvent **implicite** : $3a$ veut dire $3 \times a$. En Python, **jamais d'implicite** : tu dois écrire `3 * a`. Cette différence de convention crée des erreurs chez les débutants qui recopient une formule d'un livre.

### Ordre des opérations : PEMDAS

La règle universelle :

1. **P**arenthèses
2. **E**xposants (puissances)
3. **M**ultiplication et **D**ivision (de gauche à droite)
4. **A**ddition et **S**oustraction (de gauche à droite)

En français on dit parfois « PEMDAS » ou « règle des priorités ». Exemple :

$$2 + 3 \times 4^2 = 2 + 3 \times 16 = 2 + 48 = 50$$

Pas $5 \times 16 = 80$. Les parenthèses lèvent toute ambiguïté :

$$(2 + 3) \times 4^2 = 5 \times 16 = 80$$

**Règle pratique** : dès que tu as un doute, mets des parenthèses. Elles ne « coûtent » rien en lisibilité — elles en ajoutent.

## Les entiers et les nombres décimaux

- **Entiers** (ℤ) : ..., $-2$, $-1$, $0$, $1$, $2$, ...
- **Décimaux** : nombres avec une partie après la virgule : $3{,}14$, $-0{,}5$, $1{,}0$.
- **Rationnels** (ℚ) : tous les nombres qui peuvent s'écrire sous forme de fraction $\frac{a}{b}$ avec $a, b$ entiers et $b \neq 0$. Les décimaux finis sont rationnels, certains décimaux infinis aussi (ceux qui sont périodiques : $\frac{1}{3} = 0{,}3333\ldots$).
- **Réels** (ℝ) : tous les précédents plus les irrationnels ($\pi$, $\sqrt{2}$, $e$).

En pratique, un ordinateur ne manipule pas de vrais réels — il manipule des **approximations** stockées en virgule flottante (cf. chapitre 5 : `0.1 + 0.2 != 0.3`).

## Les fractions

Une fraction, c'est **une division non effectuée**. $\frac{3}{4}$ veut dire « trois divisé par quatre » — et vaut $0{,}75$ si on l'effectue.

### Vocabulaire

$$\frac{\text{numérateur}}{\text{dénominateur}} = \frac{3}{4}$$

- Le numérateur, c'est « combien de parts on prend ».
- Le dénominateur, c'est « en combien de parts on a divisé ».

### Additionner / soustraire des fractions

**Règle** : il faut le **même dénominateur** avant d'ajouter les numérateurs.

$$\frac{1}{2} + \frac{1}{3} = \frac{3}{6} + \frac{2}{6} = \frac{5}{6}$$

On a ramené les deux fractions au même dénominateur (6 = 2 × 3) en multipliant haut et bas par ce qu'il faut.

**Ne fais jamais** $\frac{1}{2} + \frac{1}{3} = \frac{2}{5}$. C'est l'erreur numéro un des élèves — et parfois, hélas, d'adultes.

### Multiplier des fractions

Beaucoup plus simple :

$$\frac{a}{b} \times \frac{c}{d} = \frac{a \times c}{b \times d}$$

Exemple :

$$\frac{2}{3} \times \frac{4}{5} = \frac{8}{15}$$

### Diviser des fractions

Diviser par une fraction, c'est **multiplier par son inverse** :

$$\frac{a}{b} \div \frac{c}{d} = \frac{a}{b} \times \frac{d}{c} = \frac{a \times d}{b \times c}$$

Exemple :

$$\frac{2}{3} \div \frac{4}{5} = \frac{2}{3} \times \frac{5}{4} = \frac{10}{12} = \frac{5}{6}$$

### Simplifier une fraction

On divise le numérateur et le dénominateur par un **diviseur commun**.

$$\frac{12}{18} = \frac{12 \div 6}{18 \div 6} = \frac{2}{3}$$

Une fraction est **irréductible** quand on ne peut plus la simplifier (le numérateur et le dénominateur n'ont que 1 comme diviseur commun).

## Puissances et racines

### Puissances entières

$a^n$ = $a$ multiplié par lui-même $n$ fois.

$$3^4 = 3 \times 3 \times 3 \times 3 = 81$$

Cas particuliers importants :

- $a^0 = 1$ pour tout $a \neq 0$ (par convention, cohérente avec les règles qui suivent).
- $a^1 = a$.
- $a^{-1} = \frac{1}{a}$ (l'inverse).
- $a^{-n} = \frac{1}{a^n}$.

### Règles de calcul

$$a^m \times a^n = a^{m+n}$$

$$\frac{a^m}{a^n} = a^{m-n}$$

$$(a^m)^n = a^{m \times n}$$

$$(a \times b)^n = a^n \times b^n$$

Exemple : $\frac{10^5 \times 10^{-2}}{10^3} = 10^{5 - 2 - 3} = 10^0 = 1$.

### Racines carrées

$\sqrt{a}$ = le nombre positif qui, multiplié par lui-même, donne $a$.

$$\sqrt{9} = 3 \quad \text{car} \quad 3 \times 3 = 9$$

$$\sqrt{2} \approx 1{,}414\ldots$$

Une racine carrée est **équivalente** à une puissance $\frac{1}{2}$ :

$$\sqrt{a} = a^{1/2}$$

Plus généralement, $\sqrt[n]{a} = a^{1/n}$ (racine $n$-ième).

## Les signes

- **Moins par moins = plus** : $(-3) \times (-4) = 12$.
- **Moins par plus = moins** : $(-3) \times 4 = -12$.
- Quand tu *développes* une expression avec un signe moins devant des parenthèses, **inverse tous les signes à l'intérieur** :

$$-(a - b + c) = -a + b - c$$

C'est une erreur classique d'oublier cette règle.

## À retenir

- **PEMDAS** pour l'ordre des opérations, **parenthèses** dès qu'on hésite.
- Pour **additionner** des fractions : même dénominateur d'abord.
- Pour **multiplier** des fractions : numérateurs entre eux, dénominateurs entre eux.
- Diviser par une fraction = multiplier par son inverse.
- $a^{m+n} = a^m \times a^n$ et ses variantes.
- $\sqrt{a} = a^{1/2}$.

---

> **La prochaine fois** : pourcentages et ratios. L'outil **le plus utilisé** par un analyste — et paradoxalement l'un des plus souvent mal manipulés.
