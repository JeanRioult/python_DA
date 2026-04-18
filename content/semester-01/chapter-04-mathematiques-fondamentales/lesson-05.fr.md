# Modèles linéaires et affines

*Temps estimé : 15 minutes*

## Rappel

Sans regarder :

1. Quelle est la différence entre une fonction linéaire et une fonction affine ?
2. Que veut dire « domaine » d'une fonction ? Pourquoi le connaître est-il critique ?
3. Pourquoi le logarithme est-il si souvent utilisé en analyse de données ?

## Le modèle le plus utilisé du monde

Le modèle linéaire (et son cousin l'affine) est **probablement** la formule la plus utilisée dans toute l'analyse de données. On la croise dans :

- La régression linéaire (statistiques élémentaires).
- Le calcul d'une dérivée (pente locale d'une courbe).
- L'économétrie, la finance quantitative, la physique (dans leurs approximations de premier ordre).
- Tous les modèles plus avancés en contiennent du linéaire comme brique de base.

Maîtriser $y = ax + b$ — vraiment le maîtriser — est un investissement à rendement élevé.

## La formule

$$y = ax + b$$

- $y$ : la variable **dépendante** (celle qu'on prédit).
- $x$ : la variable **indépendante** (celle qu'on utilise pour prédire).
- $a$ : la **pente** (*slope* en anglais) — combien $y$ change quand $x$ augmente d'une unité.
- $b$ : l'**ordonnée à l'origine** (*intercept*) — la valeur de $y$ quand $x = 0$.

Le graphique est toujours **une droite**. Jamais autre chose.

## Lire la pente

Si $a = 5$, alors chaque fois que $x$ augmente de 1, $y$ augmente de 5.
Si $a = -2$, alors chaque fois que $x$ augmente de 1, $y$ **diminue** de 2.
Si $a = 0$, $y$ ne dépend pas de $x$ — c'est une fonction constante.

Calculer la pente à partir de **deux points** $(x_1, y_1)$ et $(x_2, y_2)$ :

$$a = \frac{y_2 - y_1}{x_2 - x_1}$$

On dit souvent « $\Delta y$ sur $\Delta x$ » (delta y sur delta x). La pente est un **rapport de variations**.

## Lire l'ordonnée à l'origine

$b$ est la valeur de $y$ quand $x = 0$. Sur le graphique, c'est l'endroit où la droite coupe l'axe des ordonnées.

**Attention piège** : $b$ n'a de sens interprétable que si $x = 0$ est **une valeur raisonnable** dans ton contexte.

- Si $x$ représente un « nombre d'employés », $x = 0$ est sensé.
- Si $x$ représente une année comme 2026, $x = 0$ (an zéro…) n'a aucun sens concret. On *centre* alors la variable : par exemple $x' = \text{année} - 2020$.

## Exemple concret

Une entreprise a un modèle de coût :

$$C = 1500 + 25 \times n$$

où $n$ est le nombre d'unités produites et $C$ le coût total en euros.

- La pente est 25 : chaque unité supplémentaire coûte 25 € (coût marginal).
- L'ordonnée à l'origine est 1500 : même sans rien produire ($n = 0$), l'entreprise paye 1500 € (coûts fixes : loyer, salaires administratifs).

**Interprétation métier** : ce modèle distingue les coûts fixes ($b$) des coûts variables ($a$). C'est une compréhension financière de base.

### Calcul : seuil de rentabilité

Si l'entreprise vend ses unités à 40 €, son revenu est $R = 40n$. Le **seuil de rentabilité** est le $n$ où $R = C$ :

$$40n = 1500 + 25n$$
$$15n = 1500$$
$$n = 100$$

L'entreprise doit vendre 100 unités pour être à l'équilibre. En-dessous, elle perd ; au-dessus, elle est bénéficiaire.

Ce genre de raisonnement est **constant** en analyse métier. Il ne demande que de savoir résoudre une équation affine — exactement ce que tu as appris à la leçon 3.

## Linéarité additive

Une fonction linéaire $y = ax$ a une propriété très utile : l'**additivité**.

$$f(x_1 + x_2) = f(x_1) + f(x_2)$$

Exemple : si 1 kg coûte 5 €, alors 2 + 3 kg coûte $f(2) + f(3) = 10 + 15 = 25$ €, soit $f(5) = 25$ €. Les additions passent à l'intérieur de la fonction.

**Une fonction affine $y = ax + b$ n'est PAS additive** dès que $b \neq 0$. $f(x_1 + x_2) = a(x_1 + x_2) + b = f(x_1) + f(x_2) - b$. Il reste un $-b$ qui « traîne ».

C'est un point qui surprend les débutants : « linéaire » au sens mathématique strict suppose $b = 0$. Dans le langage courant et en régression, « linéaire » désigne souvent l'affine. Garde les deux termes en tête.

## Les limites du modèle linéaire

Le modèle est puissant mais **tout n'est pas linéaire**. Red flags qui indiquent qu'un modèle linéaire sera mauvais :

### Plafond ou plancher

Un taux de conversion ne peut pas dépasser 100 % ni être négatif. Une droite qui modélise le taux prédira tôt ou tard des valeurs impossibles. Dans ce cas, on passe à des modèles **logistiques** (que tu verras en S4).

### Effets de seuil

L'effet d'une promotion marketing peut être nul en-dessous d'un certain niveau de dépense, puis saute. Un modèle linéaire lissera le saut et ratera le phénomène.

### Croissance composée

Intérêts composés, croissance démographique, propagation virale — tout ça est **exponentiel**, pas linéaire. Un modèle linéaire sous-estimera systématiquement le futur.

### Saturation

La productivité ne croît pas linéairement avec le nombre d'employés indéfiniment (loi des rendements décroissants). Après un seuil, chaque employé supplémentaire apporte moins. Un modèle linéaire rate cette saturation.

## Transformations pour linéariser

Un outil puissant : **transformer les variables** pour que la relation redevienne linéaire.

### Transformation log

Si $y = C \times x^a$ (relation *power law*), alors :

$$\log(y) = \log(C) + a \times \log(x)$$

Dans l'espace logarithmique, c'est une droite. C'est pour ça que beaucoup de graphiques scientifiques utilisent des **échelles log-log** : ce qui paraît une courbe sur un graphique normal devient une droite facile à modéliser.

### Transformation racine

Si la variance de $y$ augmente avec $x$ (hétéroscédasticité — tu verras ça en S4), une transformation racine peut stabiliser.

On y reviendra. Retiens pour l'instant : **avant de dire « ce n'est pas linéaire »**, demande-toi si une transformation simple pourrait rendre le problème linéaire.

## Le contre-exemple qui ment : Anscombe

Francis Anscombe a construit en 1973 **quatre jeux de données** qui ont :

- Mêmes moyennes, mêmes variances sur $x$ et $y$.
- Même corrélation linéaire $r$.
- Même droite de régression linéaire $y = 3 + 0{,}5 x$.

Et pourtant **les quatre graphiques sont radicalement différents** : un vrai nuage, une courbe en U, une droite parfaite avec un outlier, et un ensemble de points alignés sur un seul $x$ avec un outlier. Un modèle linéaire ne résume correctement qu'**un** des quatre.

**Moralité** : **toujours tracer le graphique** avant de faire confiance à un modèle. Une statistique seule ment si elle n'est pas accompagnée d'un visuel qui confirme sa cohérence.

## À retenir

- $y = ax + b$ : **pente** $a$, **ordonnée à l'origine** $b$.
- Pente = $\frac{\Delta y}{\Delta x}$. Un **rapport de variations**.
- Le seuil de rentabilité et beaucoup d'analyses métier se résolvent avec une simple équation affine.
- Le modèle linéaire **ne marche pas partout** — méfie-toi des plafonds, seuils, exponentielles, saturation.
- **Toujours** visualiser avant de conclure (quartet d'Anscombe).

---

> **Fin du chapitre 4.** Tu as les outils : arithmétique, fractions, pourcentages, ratios, algèbre, fonctions, modèles linéaires.
>
> **Prochain chapitre** : Chapitre 6 — le contrôle du flux en Python (conditions, boucles, erreurs). On revient au code, mieux armé·e.
