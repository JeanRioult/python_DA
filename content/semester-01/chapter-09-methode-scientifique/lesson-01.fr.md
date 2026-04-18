# De la curiosité à l'hypothèse

*Temps estimé : 15 minutes*

## Rappel

Sans regarder :

1. Quels sont les trois niveaux de lecture d'un texte difficile ?
2. Qu'est-ce que la « pyramide inversée » en écriture analytique ?
3. Pourquoi la section « Limites » d'un rapport renforce-t-elle la crédibilité ?

## Pourquoi un chapitre sur la méthode scientifique

Tu as appris, dans les chapitres précédents :

- À questionner une donnée (ch. 2).
- À raisonner sans se tromper (ch. 3).
- Les bases mathématiques (ch. 4).
- Comment écrire et lire (ch. 8).

La **méthode scientifique** est le cadre global qui unit tout ça. Elle répond à une question très ancienne : **comment, face à un problème inconnu, progresser de manière fiable plutôt qu'à l'aveugle ?**

Ce n'est pas réservé à la recherche académique. Un **analyste en entreprise** qui cherche pourquoi un chiffre a chuté, un **data scientist** qui évalue un modèle, un **responsable produit** qui teste une nouvelle fonctionnalité — tous font, consciemment ou non, de la science appliquée. Le faire **consciemment**, c'est le faire mieux.

## Le cycle en sept étapes

La méthode scientifique moderne ressemble à ceci :

```
1. OBSERVATION
       ↓
2. QUESTION
       ↓
3. RECHERCHE existante
       ↓
4. HYPOTHÈSE
       ↓
5. PRÉDICTION
       ↓
6. EXPÉRIENCE / TEST
       ↓
7. ANALYSE → (retour à 1 ou à 4)
```

Chaque étape a son propre métier. Détaillons.

## 1. Observation — « tiens, c'est bizarre »

Tout commence par une observation qui **attire l'attention**. Souvent un écart par rapport à l'attendu, une anomalie, une curiosité.

Exemples :

- Le taux de conversion de samedi est systématiquement plus bas que celui des autres jours.
- Les utilisateurs de la fonctionnalité X passent plus de temps sur le site.
- L'effet marketing de la campagne de mai a l'air plus fort que celui de juin.

Une bonne observation est **précise**, **datée**, **mesurable**. « Les ventes sont mauvaises » est flou. « Les ventes ont baissé de 12 % au T3 2025 par rapport à T3 2024 » est exploitable.

**Apprends à noter** tes observations au fil de tes explorations. Un bon analyste tient une sorte de « journal d'anomalies » — un fichier où chaque écart remarqué devient un point à investiguer plus tard.

## 2. Question — de l'observation à la curiosité formulée

Une observation sans question reste stérile. Formule **la question exacte** que tu veux résoudre.

- Observation : *« Le taux de conversion de samedi est plus bas. »*
- Question formulée : *« Pourquoi le taux de conversion du samedi est-il 20 % plus bas que celui des autres jours ? »*

Ta question doit être :

- **Précise** — pas « pourquoi ça va mal », mais « pourquoi X par rapport à Y ».
- **Falsifiable** — doit permettre une réponse qu'on peut prouver fausse (cf. Popper, chapitre 2).
- **Pertinente** — la réponse doit mener à une action ou un savoir utile.

Une question bien posée est **la moitié de l'analyse**. Beaucoup de projets ratés viennent d'une question mal posée au départ.

## 3. Recherche existante — ne pas réinventer la roue

Avant de foncer, **vérifie si quelqu'un a déjà répondu**. En entreprise : lire les rapports internes précédents, parler aux anciens. En général : littérature, études publiées, articles.

Trois raisons :

- **Ne pas refaire** — gagner du temps.
- **Apprendre des erreurs** des autres — et des méthodes qui ont marché.
- **Formuler une hypothèse informée** — partir d'un état de l'art, pas de zéro.

Beaucoup d'analyses « originales » font en fait ce que quelqu'un a déjà fait, parfois dans la même entreprise, parfois trois mois avant. Une recherche de 30 minutes te sauve souvent des semaines.

## 4. Hypothèse — une affirmation **testable**

Une **hypothèse** est une réponse **candidate** à la question, qu'on va chercher à tester.

Caractéristiques d'une **bonne** hypothèse :

- **Spécifique** — précise ce qu'on attend.
- **Falsifiable** — pourrait être prouvée fausse.
- **Testable** — tu peux imaginer un protocole qui la mettrait à l'épreuve.
- **Modeste** — une seule affirmation à la fois.

Exemples :

- **Faible** : *« Les utilisateurs n'aiment pas le samedi. »* (vague, non testable)
- **Fort** : *« La baisse du samedi vient du trafic provenant des réseaux sociaux, qui ont un taux de conversion inférieur. »* (spécifique, testable)

L'hypothèse **nulle** (*H₀*), qu'on verra en stats en S4, est la formulation inverse : « il n'y a **pas** d'effet ». Les tests statistiques classiques cherchent à **rejeter H₀** — pas à prouver H₁.

## 5. Prédiction — « si l'hypothèse est vraie, alors on devrait voir... »

Une prédiction transforme l'hypothèse en **conséquences observables** :

> *Si ma hypothèse est vraie (réseaux sociaux → conversion basse), alors on devrait observer : (a) le trafic social est plus élevé le samedi ; (b) le taux de conversion du trafic social est inférieur au trafic direct ; (c) les utilisateurs venant des réseaux sociaux ont moins de pages vues par session.*

Cette étape est **cruciale**. Elle transforme une idée en quelque chose qu'on peut aller **chercher dans les données**.

Règle : **plus ta prédiction est spécifique, mieux c'est**. Une prédiction du type « on devrait voir un effet quelque part » n'est pas une prédiction — c'est un vœu pieux.

## 6. Expérience ou analyse — **tester**

Confronte tes prédictions aux données. En entreprise, ça prend plusieurs formes :

- **Analyse observationnelle** — tu regardes les données existantes.
- **A/B test** — tu exposes deux groupes à des variantes et compares.
- **Expérience contrôlée** — idéalement randomisée (cf. chapitre 3 leçon 5, RCT).
- **Simulation** — tu génères des données synthétiques selon ton modèle et compares.

Chaque méthode a ses forces. L'A/B test et le RCT sont **les plus robustes** pour établir une causalité. L'analyse observationnelle est rapide mais vulnérable aux confondeurs (cf. chapitre 3).

## 7. Analyse — conclure, et boucler

À l'issue du test, trois conclusions possibles :

- **Les prédictions se sont vérifiées** → l'hypothèse est **renforcée** (pas « prouvée » — cf. Popper, on ne prouve pas une théorie, on l'éprouve). Elle reste candidate tant qu'une meilleure ne vient pas.
- **Les prédictions ont échoué** → l'hypothèse est **réfutée**. Ou alors le protocole est défectueux. Tu reviens à l'étape 4 (autre hypothèse) ou à l'étape 6 (meilleur protocole).
- **Résultats ambigus** → souvent la situation la plus fréquente. Tu affines, tu ajoutes des données, tu reformules la prédiction.

Écris **toujours** ce que tu as trouvé (ou pas). Un résultat négatif est **aussi utile** qu'un positif — il élimine une hypothèse. Le biais de publication (chapitre 3 leçon 4) fait oublier les négatifs en science ; ne répète pas cette erreur en interne.

## Une analyse = un article scientifique miniature

Un rapport d'analyse correctement fait **reproduit** ce cycle, au moins implicitement :

- **Introduction** (IMRaD, ch. 8) = Observation + Question + État de l'art.
- **Methods** = Hypothèse + Prédiction + Protocole.
- **Results** = Test + Analyse des résultats.
- **Discussion** = Interprétation + Limites + Prochaines étapes.

Si ton rapport respecte cette structure, **il est scientifiquement solide**, même s'il est court et appliqué.

## Le mythe du génie solitaire

Le cycle ci-dessus **n'est pas linéaire**. En pratique, tu reviens en arrière, tu modifies une question à cause des premiers résultats, tu découvres une nouvelle hypothèse en explorant les données. C'est **normal et sain**.

Ce qui distingue un travail scientifique d'un vague gribouillage intellectuel :

- Tu **documentes** les étapes — on peut reconstituer ton parcours.
- Tu **isoles** les hypothèses — tu ne mélanges pas tout.
- Tu **testes** avant de conclure — tu ne te contentes pas de l'intuition.
- Tu **écris** les résultats et les limites.

Le « génie solitaire inspiré » qui trouve tout dans sa tête est un mythe. La science avance par des pas **méthodiques** — et l'analyse de données aussi.

## À retenir

- La méthode scientifique = cycle **observation → question → recherche → hypothèse → prédiction → test → analyse**.
- Une bonne **hypothèse** est spécifique, falsifiable, testable, modeste.
- Une bonne **prédiction** transforme l'hypothèse en conséquences observables.
- Un rapport IMRaD est une **version miniature** du cycle scientifique.
- Le cycle **n'est pas linéaire** — on boucle, mais on **documente**.

---

> **La prochaine fois** : le cœur technique de la méthode — les **contrôles** et les **groupes témoins**. Pourquoi on ne peut rien conclure sans comparer, et comment construire une comparaison honnête.
