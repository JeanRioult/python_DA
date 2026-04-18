# Pourcentages et ratios

*Temps estimé : 15 minutes*

## Rappel

Sans regarder :

1. Quelle est la règle pour additionner deux fractions ?
2. À quelle puissance correspond la racine carrée $\sqrt{a}$ ?
3. Que vaut $10^0$ ? Pourquoi ?

## Pourquoi ce cours commence par les pourcentages

Tu croiseras un pourcentage dans **chaque** rapport d'analyse de ta carrière. *Chaque*. Malgré cette omniprésence, les pourcentages sont la source numéro un d'erreurs chez les analystes débutants — et chez les journalistes, les politiques, et parfois les économistes. Cette leçon vaut beaucoup d'heures d'économies plus tard.

## Définition

Un **pourcentage** est une fraction dont le dénominateur est 100.

$$25\% = \frac{25}{100} = 0{,}25$$

Le symbole `%` se lit « pour cent » — littéralement « pour chaque cent ». Un pourcentage est toujours **une fraction par rapport à un tout**. La question clé est donc toujours : **par rapport à quoi ?**

## Calculer un pourcentage d'une quantité

Pour prendre $p\%$ d'une quantité $Q$ :

$$p\% \text{ de } Q = \frac{p}{100} \times Q$$

Exemple : 15 % de 200 = $\frac{15}{100} \times 200 = 30$.

Formulation Python :

```python
tva = 0.20 * prix_ht        # 20 % de prix_ht
reduction = 0.15 * prix_vendu
```

## Variation en pourcentage

C'est là que ça dérape. Si une valeur passe de $V_1$ à $V_2$, la **variation relative** en pourcentage est :

$$\Delta\% = \frac{V_2 - V_1}{V_1} \times 100$$

**Attention** : le dénominateur, c'est la **valeur de départ** $V_1$, pas la valeur finale.

Exemple : un prix passe de 100 € à 120 €.

$$\Delta\% = \frac{120 - 100}{100} \times 100 = 20\%$$

Le prix a augmenté de 20 %.

Autre exemple : le prix passe de 120 € à 100 €.

$$\Delta\% = \frac{100 - 120}{120} \times 100 \approx -16{,}67\%$$

Le prix a baissé d'environ **16,67 %** — pas 20 %. Parce que la base de référence est 120, pas 100.

### Le piège asymétrique

Cette asymétrie est cruciale : **une hausse de 20 % suivie d'une baisse de 20 % ne ramène pas au point de départ**.

Départ : 100 €.
Après +20 % : 120 €.
Après −20 % sur 120 € : 120 − 24 = 96 €.

Tu as *perdu* 4 €. C'est mathématiquement normal (les deux 20 % ne s'appliquent pas à la même base), et c'est derrière beaucoup de paradoxes économiques et financiers.

## Points de pourcentage vs pourcentages

Un piège sémantique qui coûte très cher. Considère :

- Le taux de chômage passe de **8 %** à **10 %**.

Deux façons de décrire :

- *En points de pourcentage* : « le chômage a augmenté de **2 points** » (ou « 2 points de pourcentage »).
- *En variation relative* : « le chômage a augmenté de **25 %** » ($(10-8)/8 = 0{,}25$).

Les deux sont vrais, mais ils ne disent **pas la même chose**. Mélanger les deux est une manipulation classique dans les débats publics.

**Règle** : quand tu parles d'une différence entre deux pourcentages, dis toujours explicitement si c'est :

- en **points** (ou *points de pourcentage*, *percentage points*, ou *pp* en anglais),
- ou en **variation relative** (« … ont augmenté de X % » ).

Un rapport qui confond les deux est bâclé — ou malhonnête.

## Calculer la valeur après un pourcentage

Pour appliquer une variation de $p\%$ à une valeur $V$ :

$$V_{\text{après}} = V \times \left(1 + \frac{p}{100}\right)$$

- $p > 0$ : augmentation. $V \times 1{,}20$ pour +20 %.
- $p < 0$ : baisse. $V \times 0{,}85$ pour −15 %.
- $p = 100$ : doublement. $V \times 2$.
- $p = -100$ : anéantissement. $V \times 0$.

**Astuce pratique** : retenir une augmentation de $p\%$ comme **multiplier par $(1 + p/100)$** simplifie tout. En Python :

```python
prix_ttc = prix_ht * 1.20      # +20 %
prix_solde = prix * 0.65        # −35 %
```

## Appliquer plusieurs pourcentages à la suite

Si tu appliques plusieurs variations successives, on **multiplie** les facteurs :

$$V_{\text{final}} = V \times (1 + p_1) \times (1 + p_2) \times \ldots$$

Exemple : un salaire augmente de 5 % puis de 3 % l'année suivante.

$$V_{\text{final}} = V \times 1{,}05 \times 1{,}03 = V \times 1{,}0815$$

L'augmentation cumulée est donc d'environ **8,15 %** — **pas** 8 %. On ne peut pas simplement additionner les pourcentages successifs.

## Pourcentage de changement moyen

Le piège du « pourcentage moyen » est subtil. Si une entreprise croît de 10 % une année puis décroît de 10 % la suivante :

- Moyenne arithmétique des pourcentages : 0 %.
- Mais la valeur finale : $V \times 1{,}10 \times 0{,}90 = 0{,}99 V$. Perte de 1 %.

Pour la **croissance moyenne sur plusieurs périodes**, on utilise la **moyenne géométrique** (on y reviendra plus tard) :

$$\text{taux moyen} = \sqrt[n]{(1+p_1)(1+p_2)\ldots(1+p_n)} - 1$$

En pratique, dans un rapport, **ne jamais** moyenner des pourcentages à la moyenne arithmétique sans expliciter ce que ça représente.

## Pourcentages et proportions

Si $a$ est un sous-ensemble de $b$ (par exemple 37 femmes sur 100 personnes), la proportion des femmes est $37/100 = 37\%$.

Attention aux calculs sur des pourcentages de pourcentages :

- *« 60 % des clients sont européens, et 30 % des européens sont français. Quel pourcentage de clients sont français ? »*
- Réponse : $60\% \times 30\% = 0{,}60 \times 0{,}30 = 0{,}18 = 18\%$.

On **multiplie** les proportions, on ne les additionne pas.

## Les ratios

Un **ratio** exprime une comparaison entre deux quantités. On le note $a:b$ ou $\frac{a}{b}$.

- Ratio d'hommes/femmes dans une entreprise : $3:2$ (pour 5 personnes, 3 hommes et 2 femmes).
- Ratio d'efficacité : revenu par employé.
- Ratio de conversion : clients acquis / visiteurs.

Propriétés :

- Un ratio est **sans unité** quand les deux quantités ont la même unité. « Le ratio d'hommes sur femmes est 1,5 » — pas de « %, d'heures, de... ».
- Un ratio peut avoir une unité quand il mélange deux grandeurs : « € par client ».

### Ratios vs fractions vs pourcentages

Les trois peuvent exprimer la même chose. Pour 3 hommes sur 5 personnes :

- Fraction : $\frac{3}{5}$.
- Ratio hommes/total : $3:5$.
- Pourcentage : $60\%$.
- Ratio hommes/femmes (autre information !) : $3:2$.

**Piège** : le ratio « hommes/total » et le ratio « hommes/femmes » ne sont **pas** la même chose. Lire ou écrire un ratio sans préciser « de quoi sur quoi » est une recette pour se tromper.

## Les red flags dans un rapport

- **« Croissance de 300 % »** sur une petite base → probablement vrai mais potentiellement trompeur. Vérifie la base absolue.
- **Pas de base mentionnée** : « +15 % par rapport à l'an dernier » — sans préciser sur quel indicateur, quelle population, quelle période exacte.
- **Pourcentages moyennés arithmétiquement** sur plusieurs périodes (cf. plus haut).
- **Points et pourcentages mélangés** dans la même phrase ou le même graphique.
- **Pourcentages sans total** : « 45 % ont répondu oui » — sur combien de répondants ? Sur combien de sollicités ?

## À retenir

- Un pourcentage est **toujours relatif à une base** — laquelle ?
- $+p\%$ puis $-p\%$ ne ramène **pas** au point de départ.
- **Points** de pourcentage ≠ variations en **pourcentage** : distinction critique.
- Pour des variations successives : on **multiplie** les facteurs $(1 + p_i)$.
- Un ratio doit toujours préciser **quoi sur quoi**.

---

> **La prochaine fois** : manipuler des inconnues. Équations, variables, et pourquoi $x$ n'est pas plus mystérieux qu'une boîte dont on cherche le contenu.
