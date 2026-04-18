# Les sophismes courants

*Temps estimé : 15 minutes*

## Rappel

Sans regarder :

1. Quels sont les trois modes de raisonnement, et que garantit chacun ?
2. Pourquoi Sherlock Holmes ne « déduit » pas, au sens technique ?
3. Pourquoi une induction nécessite toujours une estimation d'incertitude ?

## Un sophisme, c'est quoi ?

Un **sophisme** (ou *fallacy* en anglais) est un raisonnement qui **semble valide** mais qui ne l'est pas. Ce n'est ni un mensonge ni une opinion différente : c'est une **erreur de structure logique** qui passe inaperçue parce que la conclusion *sonne* bien.

Les sophismes sont partout : débats télévisés, articles d'opinion, réunions d'entreprise, rapports d'analyse mal relus. Un analyste entraîné les détecte à distance. Ce qui suit est un catalogue opérationnel de ceux que tu croiseras le plus souvent.

## Les 11 sophismes à connaître

### 1. *Ad hominem* — attaquer la personne

Attaquer celui qui tient l'argument plutôt que l'argument.

- *« Tu ne peux pas parler de pauvreté, tu es riche. »*
- *« Cette étude a été financée par X, donc elle est fausse. »*

Le financement ou le profil sont **pertinents** pour évaluer un **biais possible**. Ils ne permettent pas de **conclure** que l'argument est faux.

### 2. *Strawman* — l'homme de paille

Caricaturer la position adverse pour la démonter plus facilement.

- Position réelle : *« Il faudrait peut-être limiter un peu le nombre de voitures en centre-ville. »*
- Strawman : *« Il veut interdire toutes les voitures ! »*

Si tu critiques une version caricaturale d'un argument, tu ne prouves rien sur la version originale.

**Antidote** : applique le principe de charité (leçon 1). Reformule la position de l'autre avec ses mots les plus forts avant de la critiquer.

### 3. Appel à l'autorité

Utiliser une autorité **hors de son domaine** comme preuve.

- *« Un Nobel de chimie dit que le vaccin est dangereux. »* — un Nobel de chimie n'est pas épidémiologiste.

Une autorité *dans son domaine* est un indice légitime. Hors de son domaine, elle ne prouve rien.

### 4. Appel à la popularité (*ad populum*)

« Beaucoup de gens le pensent, donc c'est vrai. »

- *« 70 % des Français pensent que X. Donc X. »*

Beaucoup de gens peuvent croire une chose fausse (la Terre plate, les humeurs médiévales). L'opinion majoritaire est un **fait social**, pas une **preuve de vérité**.

### 5. Appel à la tradition

« On a toujours fait comme ça, donc c'est valide. »

- *« Le lundi férié existe depuis 150 ans, donc il faut le garder. »*

L'ancienneté n'est pas un argument. Beaucoup de pratiques anciennes étaient mauvaises (esclavage, saignées médicales, interdictions des femmes d'étudier).

### 6. Fausse dichotomie — le piège à deux portes

Présenter deux options comme si c'étaient les seules, alors qu'il en existe d'autres.

- *« Soit on baisse les impôts, soit on étouffe l'économie. »*
- *« Tu es pour ou contre ce projet ? »*

Neuf fois sur dix, il existe une troisième voie. Ou une quatrième. Refuse le cadrage binaire.

### 7. Pente glissante

« Si on accepte A, alors on arrivera fatalement à Z. »

- *« Si on autorise le télétravail un jour par semaine, bientôt personne ne viendra plus au bureau, et l'entreprise fermera. »*

Une pente glissante est légitime **si tu peux démontrer chaque marche**. Sans cette démonstration, c'est de la spéculation qui se fait passer pour une preuve.

### 8. Cherry picking — sélection des cas favorables

Choisir uniquement les exemples qui soutiennent ton hypothèse, ignorer les autres.

- *« Tel PDG a réussi sans diplôme, donc le diplôme ne sert à rien. »* — et les milliers sans diplôme qui n'ont pas réussi ?

C'est le **biais de confirmation** (chapitre 2, leçon 4) appliqué à l'argumentation. L'antidote : **chercher explicitement les contre-exemples** avant de conclure.

### 9. Corrélation → causalité (*post hoc ergo propter hoc*)

« B est arrivé après A, donc A a causé B. »

- *« J'ai pris ce médicament, mon mal de tête est parti, donc le médicament m'a soigné. »*

Assez important pour qu'on lui consacre la prochaine leçon entière. Retiens déjà : la corrélation temporelle n'est **pas** une preuve de causalité.

### 10. Circularité — la pétition de principe

L'argument utilise sa propre conclusion comme prémisse.

- *« Ce livre sacré dit la vérité parce qu'il est écrit par Dieu, et nous savons qu'il est écrit par Dieu parce que le livre le dit. »*
- *« Notre produit est le meilleur, parce que c'est celui que préfèrent nos clients — et s'ils le préfèrent c'est bien qu'il est le meilleur. »*

La circularité peut être discrète quand la boucle est plus longue (A → B → C → A). Cherche l'anneau.

### 11. Non-sequitur — la conclusion qui ne suit pas

La conclusion ne découle logiquement pas des prémisses.

- *« Les ventes ont baissé de 3 %, donc il faut licencier 20 % du personnel. »*

Il peut y avoir un lien entre les deux, mais il n'est **pas démontré**. Un non-sequitur saute d'une observation à une conclusion sans montrer les marches intermédiaires. C'est l'inverse de la pente glissante (où les marches *trop détaillées* sont spéculatives) : ici, il manque toutes les marches.

## Les sophismes spécifiques à l'analyse de données

En plus des classiques ci-dessus, il y a trois sophismes que tu verras *tout le temps* dans les rapports de données :

### A. Le p-hacking / torture des données

Essayer des dizaines de tests statistiques jusqu'à en trouver un qui « marche » (p < 0.05). Statistiquement, si tu fais 20 tests sur des données au hasard, tu trouveras en moyenne 1 résultat « significatif » par pur hasard.

**Règle** : déclarer ton plan d'analyse *avant* de regarder les données (pré-enregistrement).

### B. La ligne de tendance trompeuse

Tracer une droite de régression sur 4 points et prétendre avoir découvert une loi. Ou choisir l'échelle d'un graphique de façon à exagérer (ou minimiser) une tendance.

**Règle** : pour un effet visuel, exige un nombre d'observations suffisant et une échelle justifiée.

### C. Le mélange de périodes incomparables

Comparer des chiffres qui ne se réfèrent pas à la même base : « les crimes ont augmenté de 10 % depuis 2010 » — mais la définition de « crime » a changé en 2015. La *vraie* hausse est inconnue à partir de ce chiffre seul.

**Règle** : quand tu compares dans le temps, vérifie que **rien** n'a changé dans la définition, la collecte ou le périmètre.

## Comment s'entraîner à les repérer

- **Lis des rapports et débats avec une grille sophismes en tête**. Au début, note chaque occurrence. Ça devient vite automatique.
- **Relis *tes propres* analyses** avec la même grille avant de les envoyer. Les sophismes les plus dangereux sont ceux qu'on fait sans s'en rendre compte.
- **Étudie les médias**. Un débat politique de 30 minutes contient souvent les 11 sophismes ci-dessus. C'est un terrain d'entraînement gratuit.

## Un mot sur le jugement

Détecter un sophisme ne prouve pas que la **conclusion** est fausse — ça prouve que **le raisonnement ne la justifie pas**. La conclusion peut être vraie *pour d'autres raisons*. Par exemple, « il a plu parce que j'ai lavé ma voiture » est un sophisme (*post hoc*) — et pourtant il a vraiment plu.

L'objectif n'est pas de « gagner un débat » en hurlant « *strawman* ! ». L'objectif est d'avoir des raisonnements plus propres, personnellement et collectivement. Repère les sophismes pour mieux penser, pas pour briller.

## À retenir

- Un sophisme est un raisonnement qui **paraît valide mais ne l'est pas**.
- Connais les 11 classiques — ils reviennent partout.
- **Cherry picking** et **corrélation→causalité** sont les plus fréquents en analyse de données.
- Détecter un sophisme = le raisonnement est cassé. La conclusion peut quand même être vraie.

---

> **La prochaine fois** : le sophisme le plus coûteux du monde — corrélation ≠ causalité. Comment on distingue l'un de l'autre, et ce que le cadre causal moderne (Judea Pearl) a apporté.
