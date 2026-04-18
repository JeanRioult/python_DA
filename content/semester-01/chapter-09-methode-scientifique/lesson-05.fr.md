# Méthode scientifique pour l'analyste en entreprise

*Temps estimé : 15 minutes*

## Rappel

Sans regarder :

1. Qu'est-ce que la crise de la réplication, et quelles en sont les causes principales ?
2. Pourquoi un résultat unique n'est-il jamais une preuve ?
3. Quelle différence entre réplication directe et conceptuelle ?

## L'entreprise n'est pas un laboratoire

Tu as maintenant un bagage méthodologique sérieux — cycle scientifique, contrôles, biais, réplication. Dernière étape de ce chapitre, et du semestre : comment tout ça **se traduit** dans la vie d'un analyste en entreprise, où les contraintes ne sont pas celles d'un labo.

Les différences principales :

| Laboratoire                     | Entreprise                           |
| ------------------------------- | ------------------------------------ |
| Temps : mois à années           | Temps : heures à semaines             |
| Budget : subventions            | Budget : variable, souvent court      |
| Question : curiosité du chercheur | Question : besoin du décideur         |
| Public : pairs                  | Public : non-spécialistes            |
| Erreur : publier une correction | Erreur : reporting, parfois lourd     |
| Contrôle : RCT idéal            | Contrôle : souvent impossible         |
| Publication : incentivée        | Publication : interne, rarement ouverte |

Ne copie pas bêtement la science académique — adapte ses **principes**.

## Les cinq principes transposables

### 1. **Poser la vraie question**

Un décideur arrive avec une question de surface (*« combien d'utilisateurs ? »*). Avant d'y répondre, demande : *« Pourquoi tu veux savoir ? Qu'est-ce que tu ferais si le chiffre était X ? Si c'était Y ? »*

Souvent, la vraie question est différente de la question formulée. Exemple :

- Question de surface : *« Combien d'utilisateurs utilisent la fonction X ? »*
- Vraie question : *« Faut-il continuer à investir dans X, ou la supprimer ? »*

Ces deux questions demandent **des analyses différentes**. Ne réponds jamais sans avoir clarifié la vraie question.

### 2. **Rendre ton hypothèse explicite**

Avant de plonger dans les données, écris en **une phrase** ce que tu t'attends à trouver et pourquoi.

Exemple : *« Je pense que le taux de conversion du samedi est plus bas parce que le trafic organique est dominé par des réseaux sociaux à faible intention d'achat. Je m'attends à voir (a) plus de trafic social le samedi, (b) un taux de conversion du trafic social inférieur au trafic direct. »*

Pourquoi : si les données **confirment** ton hypothèse, tu as **vraiment** appris quelque chose. Si elles la **réfutent**, tu as aussi appris. Si tu n'avais pas formulé d'hypothèse, tu as juste « exploré » — moins actionnable.

### 3. **Chercher ce qui invalide, pas ce qui confirme**

Le biais de confirmation (ch. 3, ch. 9) est **le** piège de l'analyste pressé. Parade simple :

Écris — **au début** de ton analyse — *« Quels résultats, si je les voyais, me feraient changer d'avis ? »* Puis va les chercher activement.

Si tu ne trouves rien qui invalide, c'est soit que ton hypothèse est très robuste (bien), soit que tu n'as pas assez cherché (mauvais). La différence se voit à l'effort honnête que tu as mis à chercher.

### 4. **Documenter les limites**

Tout rapport d'entreprise **doit** avoir une section **Limites**, même courte. Ce que ton analyse **ne peut pas** dire :

- Périodes non couvertes.
- Populations non incluses.
- Variables manquantes ou approximées.
- Tests non faits par manque de temps.
- Corrélations qu'on n'a pas pu traduire en causalité.

Un rapport **sans** limites est un rapport naïf ou malhonnête. Tes lecteurs futurs te remercieront — et tu te protèges toi-même. Si une décision mal prise repose sur ton rapport **et** que les limites étaient écrites, la responsabilité est partagée. Sans les limites, c'est la tienne seule.

### 5. **Accepter la réplication**

Si un collègue veut refaire ton analyse, c'est un **cadeau**. Ses objections t'aideront à consolider. Résiste à l'instinct défensif. Un analyste qui accueille bien la critique devient rapidement reconnu pour sa fiabilité.

## L'humilité calibrée

Le philosophe Julia Galef appelle ça le *scout mindset* : le réflexe d'**ajuster ses croyances aux preuves**, plutôt que d'ajuster les preuves à ses croyances (le *soldier mindset*, qui défend le fort).

En entreprise, le scout mindset se traduit par :

- **Dire « je ne sais pas »** quand tu ne sais pas.
- **Changer d'avis** publiquement quand de nouvelles preuves arrivent.
- **Féliciter** quelqu'un qui te corrige.
- **Ne pas punir** les erreurs honnêtes des collègues — elles sont inhérentes au travail d'inconnu.

Un environnement de travail qui récompense le scout mindset produit de meilleures décisions que celui qui récompense le soldier mindset. Tu as (un peu) d'influence sur la culture autour de toi : commence par **l'incarner** toi-même.

## Quatre anti-patterns d'entreprise

Des comportements courants qui **ruinent** la méthode, et qu'il faut refuser :

### A. « Je veux un chiffre qui prouve X »

Le commanditaire veut un chiffre **qui confirme** ce qu'il pense déjà. Il va tourner ta conclusion en faveur de X quoi que tu dises.

Parade : **refuser de donner un chiffre isolé**. Donne l'éventail des analyses possibles, et ce qu'elles révèlent, y compris ce qui contredit. Si le demandeur passe outre et ne cite que le chiffre qui l'arrange, **ta responsabilité est limitée à ce que tu as écrit**.

### B. « On n'a pas le temps pour un groupe témoin »

Classique. La « solution rapide » sans contrôle mène à des décisions faussées. Et à long terme, l'argent dépensé sur ces décisions est bien plus que le coût d'un test propre.

Parade : **proposer une version simplifiée** mais honnête. Un mini-groupe témoin, un test limité sur 20 % de trafic, un test A/B court. Tout sauf « avant/après brut ».

### C. « Nos données sont spéciales »

Variante : « les principes scientifiques ne s'appliquent pas chez nous parce que notre business est unique ». Il l'est — mais les biais statistiques, eux, s'appliquent universellement.

Parade : trouve des **analogies** avec des domaines qui ont déjà rencontré le problème. Les lois de la statistique ne reconnaissent pas l'exceptionnalisme d'entreprise.

### D. « Les résultats n'allaient pas dans notre sens, donc on les a refait »

Refaire une analyse jusqu'à obtenir le résultat souhaité est du p-hacking industriel. Ça arrive, et c'est **grave**.

Parade : décider **à l'avance** de ce qui sera considéré comme un succès / un échec. Une fois les résultats produits, **les lire tels quels**. Si tu veux les refaire, il faut **une raison méthodologique** documentée — pas une insatisfaction avec le résultat.

## Le cycle de Deming (PDCA)

Une version appliquée du cycle scientifique, utilisée en amélioration continue :

- **Plan** — formuler l'hypothèse et le protocole.
- **Do** — exécuter, sur un périmètre limité.
- **Check** — analyser les résultats.
- **Act** — déployer largement si ça marche, ajuster ou abandonner sinon.

Puis on recommence avec la prochaine hypothèse. C'est **la méthode scientifique en mode entreprise**. Beaucoup de grandes boîtes (Toyota, Amazon, Google) l'ont formalisée.

## Un exemple de fin de semestre

Tu reçois la question : *« Pourquoi le taux de résiliation a-t-il augmenté ? »*.

Méthode scientifique appliquée :

1. **Clarifier la vraie question** : « Y a-t-il un facteur actionnable qui expliquerait la hausse ? »
2. **Observation précise** : « Le taux est passé de 5,2 % à 6,1 % entre T2 et T3 2025. »
3. **Recherche interne** : « Des analyses précédentes ont identifié la facturation comme facteur. Mise en place de la nouvelle facturation le 10 août. »
4. **Hypothèse** : « La nouvelle facturation introduite le 10 août est la cause principale. »
5. **Prédictions** : « Si vrai, on devrait voir (a) une rupture nette autour du 10 août ; (b) les clients affectés par le changement résilient plus que les autres ; (c) les plaintes de service client mentionnent la facturation. »
6. **Test** : analyser les données selon ces trois axes.
7. **Analyse et report** :
   - Résumé exécutif avec conclusion.
   - Méthodes : sources, filtres, période.
   - Résultats : les trois analyses.
   - Discussion : hypothèse renforcée sur (a) et (c), ambiguë sur (b). Limites : pas d'A/B test possible, corrélation forte mais causalité modérément confirmée.
   - Recommandations : revoir la facturation, faire un A/B test sur les nouveaux clients.

Ça prend une semaine, donne un rapport actionnable, honnête, et traçable. C'est ton métier.

## À retenir

- L'entreprise n'est pas le labo, mais les **principes** transposent.
- **Clarifier la vraie question** avant d'analyser.
- **Hypothèse explicite → prédictions → tests** — reproduit le cycle académique en plus rapide.
- **Chercher ce qui invalide**, pas ce qui confirme.
- **Documenter les limites** — honnêteté et protection.
- Refuser les **anti-patterns** : chiffres sur commande, pas de témoin, exceptionnalisme, p-hacking.

---

> **Fin du chapitre 9. Fin du volet théorique du semestre 1.**
>
> Tu as maintenant, pour la première fois du cours, **toutes** les pièces pour un premier projet d'analyste : apprendre à apprendre, qu'est-ce qu'une donnée, raisonner proprement, maths de base, Python, contrôle du flux, tableurs, écrire/lire, méthode scientifique.
>
> **Dernière étape** : le **capstone** du semestre 1 — une analyse de bout en bout sur un mois de tes propres données, qui met tout ce semestre en pratique.
