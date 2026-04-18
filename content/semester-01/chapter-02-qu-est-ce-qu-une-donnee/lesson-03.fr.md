# La qualité des données

*Temps estimé : 15 minutes*

## Rappel

Sans regarder :

1. Cite les quatre niveaux de mesure de Stevens.
2. Quelle opération est interdite sur une variable nominale ?
3. Pourquoi la médiane est-elle la mesure de centre la plus sûre pour une variable ordinale ?

## Pourquoi la qualité est le *premier* sujet

Il existe un dicton dans le métier : **garbage in, garbage out**. Si les données qui entrent sont mauvaises, tout ce qui sort l'est aussi — peu importe la sophistication du modèle.

La plupart des débutants croient qu'un projet de données consiste à *analyser*. En réalité, **50 à 80 % du temps d'un analyste est consacré à évaluer et à nettoyer la donnée** avant même de commencer à en tirer quoi que ce soit. Ce n'est pas une corvée annexe : c'est le cœur du métier.

Les pages qui suivent nomment les ennemis.

## Les sept défauts courants

### 1. Les valeurs manquantes (*missing data*)

Des cases vides. Un champ `age` avec des `null`. Un revenu non déclaré dans un sondage.

Trois types, selon la cause :

- **MCAR** (Missing Completely At Random) — les données manquent au hasard. Rare.
- **MAR** (Missing At Random) — elles manquent selon une autre variable observée. Exemple : les jeunes répondent moins à un sondage — manquer est corrélé à `age`, mais à `age` connu, c'est aléatoire.
- **MNAR** (Missing Not At Random) — elles manquent à cause de leur *propre valeur*. Exemple : les hauts revenus déclarent moins leur revenu. Le plus dangereux — ignorer les manquants donne des analyses biaisées.

Option d'ignorance : **jeter les lignes incomplètes** (*drop*). Rapide mais souvent mauvais : on perd des observations, et si le manquement n'est pas MCAR, on biaise l'échantillon.

Option de correction : **imputer** (remplacer par moyenne, médiane, modèle). À utiliser avec prudence — l'imputation cache le trou, elle ne le comble pas.

Règle : **toujours documenter** le nombre de manquants, leur type présumé, et le choix de traitement.

### 2. Les valeurs aberrantes (*outliers*)

Points très éloignés du reste. Deux origines possibles :

- **Erreur** — un âge de 300 ans, un salaire négatif. À corriger ou exclure.
- **Rare mais vrai** — un milliardaire dans un échantillon de revenus. *À conserver*, parce que le ignorer fausse la réalité.

La question à se poser n'est **jamais** « est-ce une valeur aberrante ? » mais « **est-ce une erreur ou une observation rare mais valide ?** » La réponse change tout.

Un outlier valide peut dominer une moyenne (cf. la médiane). Un outlier-erreur peut dominer *et* fausser. La différence compte.

### 3. Les doublons

Mêmes lignes apparaissent plusieurs fois. Causes :

- Erreurs de jointure (fusion de tables mal faite).
- Soumissions répétées dans un formulaire web.
- Un utilisateur avec deux comptes.

Si tu ne détectes pas les doublons, tu comptes deux fois. Un taux de conversion, un revenu total, un nombre d'utilisateurs — tous deviennent faux.

Méthode : **toujours vérifier l'unicité d'une clé** avant une jointure, et vérifier le nombre de lignes après. Si une jointure multiplie les lignes, tu as un problème de cardinalité — pas un bug de code.

### 4. Les incohérences de format

Une ville écrite « Paris », « paris », « PARIS », « Paris ». Un pays « France », « FR », « French Republic ». Une date « 2026-04-18 », « 18/04/2026 », « April 18, 2026 ». Un numéro de téléphone avec et sans espaces.

Pour l'humain, c'est la même chose. Pour l'ordinateur, ce sont **quatre catégories distinctes**. Une `GROUP BY city` te retournera quatre Paris.

**Normaliser** (mise en minuscules, suppression des accents, unification de format) est un passage obligé.

### 5. Les encodages cassés

Tu charges un CSV, tu vois des `Ã©` ou des `Ã¨`. C'est un problème d'**encodage de caractères** (UTF-8, ISO-8859-1, Windows-1252, MacRoman…).

Pour un dataset français : UTF-8 est le standard moderne ; les fichiers générés depuis Excel Windows sont souvent en Windows-1252 ou ISO-8859-15. Si tu lis un fichier sans préciser l'encodage, la valeur par défaut de ton outil décide — et elle peut se tromper.

Règle : **explicite toujours l'encodage** quand tu ouvres un fichier. En Python : `open(path, encoding='utf-8')` ou `pd.read_csv(path, encoding='utf-8')`.

### 6. L'erreur de mesure

La réalité mesurée ≠ la réalité. Un thermomètre mal calibré, un questionnaire biaisé par sa formulation, un capteur qui dérive avec la température.

Deux types d'erreur :

- **Bruit** (*noise*) — erreurs aléatoires. En moyenne, elles se compensent sur un grand échantillon.
- **Biais** (*bias*) — erreurs systématiques. **Elles ne se compensent pas**. Plus de données ne règle rien.

Si ton thermomètre indique toujours 2 °C de trop, prendre 10 000 mesures ne te donne pas 2 °C de plus de précision — tu as juste 10 000 valeurs fausses du même biais.

### 7. Le « data drift »

Les données collectées aujourd'hui ≠ celles d'il y a cinq ans, même si le *nom* de la variable n'a pas changé. Les définitions évoluent, les populations évoluent, les instruments évoluent.

Exemple célèbre : un indicateur « revenu médian des ménages » comparé à 10 ans d'écart — mais la définition de « ménage » a été modifiée entre-temps par l'Insee. Les deux chiffres existent ; les comparer sans précaution est faux.

Règle : **toujours vérifier les définitions à l'époque** où la donnée a été collectée, pas à l'époque où tu l'analyses.

## Bruit vs biais — une distinction qui coûte cher

Répétons-le parce que beaucoup de débutants se trompent :

| Propriété        | Bruit                           | Biais                                     |
| ---------------- | ------------------------------- | ----------------------------------------- |
| Direction        | Aléatoire                       | Systématique                              |
| Effet sur moyenne | Se compense sur grand échantillon | **Ne se compense pas, jamais**           |
| Correction       | Plus de données                 | **Nouvelle méthode**, pas plus de données |

« Plus de données » est **le mauvais réflexe** face à un biais. Si ton capteur est décalé, il faut le recalibrer, pas multiplier les mesures.

## Les « cinq pourquoi » du nettoyage

Avant de corriger un défaut, demande-toi **pourquoi il existe**, cinq fois. Exemple :

- Il y a des âges à 0. *Pourquoi ?*
- Parce que le champ est nullable et certains utilisateurs ne l'ont pas rempli. *Pourquoi ?*
- Parce que le formulaire marque `age` comme optionnel. *Pourquoi ?*
- Pour réduire le taux d'abandon. *Pourquoi ?*
- Parce que le métier a priorisé le volume sur la qualité.

Tu sais maintenant que remplacer les 0 par la moyenne *cacherait* un choix-métier. Peut-être que la bonne action est de le signaler au métier — pas de l'imputer en silence.

## À retenir

- Un analyste passe **50 à 80 %** de son temps sur la qualité. C'est normal et c'est le métier.
- Sept défauts à connaître : manquants, aberrants, doublons, formats, encodages, erreur de mesure, drift.
- **Bruit ≠ biais**. Plus de données corrige le bruit, pas le biais.
- Avant de « nettoyer », demande-toi *pourquoi* le défaut existe.

---

> **La prochaine fois** : le défaut le plus sournois — les biais de *collecte*. Quand ce n'est pas la donnée qui est fausse, c'est le fait de l'avoir collectée en premier lieu.
