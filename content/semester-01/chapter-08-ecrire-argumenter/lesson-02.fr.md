# Structurer : IMRaD et alternatives

*Temps estimé : 15 minutes*

## Rappel

Sans regarder :

1. Quelles sont les quatre qualités d'un écrit professionnel ?
2. Qu'est-ce que la pyramide inversée ?
3. Pourquoi Bezos interdit-il les slides dans les réunions de décision ?

## IMRaD — la charpente scientifique

**IMRaD** est l'acronyme de :

- **I**ntroduction
- **M**ethods (méthodes / méthodologie)
- **R**esults (résultats)
- **a**nd
- **D**iscussion

C'est la structure **standard** d'un article scientifique depuis les années 1950. **La quasi-totalité** des publications biomédicales, économiques, psychologiques l'utilise. Elle s'est imposée parce qu'elle fonctionne : elle rend les travaux lisibles, comparables, et critiquables.

Elle s'adapte **très bien** à un rapport d'analyse de données en entreprise ou en recherche.

## Les quatre sections

### Introduction — **pourquoi ?**

Réponds aux trois questions :

1. **Quelle est la question** traitée ?
2. **Pourquoi elle compte** ?
3. **Qu'est-ce que tu proposes de faire** à son sujet ?

Longueur : 1 à 3 paragraphes pour un rapport court, une section complète pour un document long.

Piège : se perdre dans un « contexte général » interminable qui ne sert à rien. Vas à l'essentiel. Si l'origine du sujet est claire pour le lecteur, tu peux t'y engager en deux phrases.

Bon premier paragraphe (exemple) :

> *« Les taux de conversion du site web ont baissé de 12 % au trimestre. Ce rapport examine les causes possibles à partir des données d'analytics et propose trois leviers d'action. »*

Trois phrases, tout y est : question, contexte, plan.

### Methods — **comment ?**

Décris **ce que tu as fait**, dans l'ordre, assez précisément pour qu'**un autre analyste puisse reproduire** ton travail.

Ce qu'on trouve typiquement :

- **Les sources** de données : où, quand, quelle version, quels filtres.
- **Les nettoyages** appliqués : combien de manquants, comment traités, combien de doublons, etc.
- **Les méthodes statistiques** ou techniques : quel test, quel modèle, avec quels paramètres.
- **Les choix discutables** : pourquoi tu as fait X plutôt que Y.

Règle : **tout lecteur sceptique doit pouvoir identifier tes choix**, même s'il ne les partage pas.

Longueur : proportionnelle à la complexité. Un simple filtre + `AVERAGE` = deux phrases. Un modèle ML entraîné = deux pages.

### Results — **qu'est-ce qu'on a trouvé ?**

Présente **les faits**, **sans interprétation** à ce stade. Les nombres, les graphiques, les statistiques, les comparaisons — bruts.

Le piège classique : mélanger résultats et interprétations. Résiste. Un tableau de chiffres et un graphique parlent. L'interprétation vient **après**, dans la Discussion.

Structure usuelle :

- Une **figure clé** (le graphique qui résume tout) dès le début.
- Des sous-sections par dimension d'analyse (par segment, par période…).
- Des nombres **exacts**, pas arrondis à « environ ».

### Discussion — **qu'est-ce que ça veut dire ?**

C'est ici qu'on interprète, nuance, recommande.

Typiquement, 5 éléments :

1. **Réponse à la question initiale** — oui, non, partiellement.
2. **Comparaison** avec la littérature, les attentes, ce qu'on faisait avant.
3. **Mécanisme proposé** — pourquoi on pense que ces résultats sont ce qu'ils sont.
4. **Limites** — ce que ton analyse **ne peut pas** dire ; biais possibles ; populations non couvertes.
5. **Recommandations et prochaines étapes** — actions concrètes, pistes à explorer.

La section « Limites » est **la plus importante** — et celle que les débutants négligent. Un rapport qui reconnaît honnêtement ses limites est **plus** convaincant, pas moins. Il montre que tu as pensé aux contre-arguments avant le lecteur.

## Adaptations en entreprise

### Le **mémo exécutif**

Pour un comité exécutif, on **inverse** partiellement IMRaD :

- **Résumé exécutif** (3-5 phrases au début) : conclusion + recommandation.
- **Contexte** : 1 paragraphe.
- **Résultats clés** : les 3-5 faits qui comptent.
- **Recommandation** : l'action à prendre.
- **Annexes** : méthodologie, données brutes, pour qui veut creuser.

Ici, la **pyramide inversée** domine. Le décideur lit l'exécutif, prend la décision, éventuellement va voir les annexes si quelque chose le surprend.

### Le **one-pager**

Une page. Exactement une. Contraint à couper le superflu. Format :

- **Titre** = conclusion.
- **Un graphique** central.
- **Trois points** de méthodologie / contexte.
- **Trois points** de résultats.
- **Une recommandation**.

Excellent exercice de discipline. **Rédige un one-pager de toute analyse importante**, même si tu produis aussi un rapport complet. Le one-pager est ce qui circulera.

### Le **ticket / issue** (format développeur)

Pour une question technique, type *pourquoi ce chiffre est bizarre ?* :

- **Observation** : le chiffre, sa valeur attendue, son écart.
- **Hypothèses** envisagées.
- **Tests faits** et résultats.
- **Conclusion** ou **question ouverte**.

Format court (20-40 lignes), destiné à un collègue pour qu'il te réponde ou te redirige.

## Les niveaux de titre

Un document bien structuré a une **hiérarchie claire** :

- **Titre** (niveau 0) — le document lui-même.
- **Section** (niveau 1, `H1`) — grandes parties (Introduction, Méthodes…).
- **Sous-section** (niveau 2, `H2`) — subdivisions.
- **Paragraphe** — unité de base, avec éventuellement un titre en gras.

Un lecteur doit pouvoir **survoler uniquement les titres** et comprendre la structure de ton argument. C'est un test que tu peux faire toi-même : lis ta table des matières à voix haute. Est-ce un résumé cohérent du document ?

## Les transitions

Entre deux paragraphes, entre deux sections, une transition explicite aide le lecteur :

- *« Cela étant établi, voyons maintenant... »*
- *« Si cette hypothèse est juste, on s'attend à voir... »*
- *« Ces résultats soulèvent une question : ... »*

Pas besoin d'être lyrique. Une transition sobre qui **nomme** le lien logique suffit.

À éviter : les transitions **molles** (*« Par ailleurs… »*, *« De plus… »*). Elles n'indiquent aucun lien précis — elles servent juste à ne pas laisser un silence. Si tu ne peux pas nommer le lien, les paragraphes doivent peut-être simplement se suivre sans rien.

## La longueur

Combien de pages ? La mauvaise réponse : *« ça dépend »* (et on s'en sort). Vraies réponses :

- **E-mail opérationnel** : 3-10 lignes. Au-delà, passe au rapport.
- **Ticket / note interne** : 1 page.
- **Mémo exécutif** : 2-6 pages (règle Amazon : 6 max).
- **Rapport standard d'analyse** : 10-30 pages, annexes comprises.
- **Thèse, étude approfondie** : 40-80 pages (cf. capstone final du cours).

**Long n'est pas bon.** Un rapport court et dense bat un rapport long et dilué. Si tu ne peux pas couper, c'est souvent que ta pensée n'est pas encore assez claire.

## La table des matières et les figures

Pour un document > 10 pages :

- **Table des matières** au début, avec numéros de pages.
- **Liste des figures et tableaux** après, si > 5 figures.
- **Numérotation** des figures/tableaux (Figure 1, Figure 2…), avec **une légende** sous chacune qui peut se lire **indépendamment** du corps du texte.

Ces éléments donnent une apparence professionnelle — et ils servent : un lecteur qui revient au rapport dans deux mois retrouve une info en 20 secondes grâce à eux.

## À retenir

- **IMRaD** : Introduction, Methods, Results, Discussion — structure standard.
- En entreprise : **mémo exécutif** ou **one-pager** avec conclusion d'abord.
- Section **Limites** = honnêteté + crédibilité. Ne la néglige pas.
- Hiérarchie de **titres** claire ; tests : les titres racontent-ils l'histoire ?
- **Court** > long. Si tu ne coupes pas, ta pensée n'est pas encore stabilisée.

---

> **La prochaine fois** : descendre au niveau de la phrase. Trois principes — clarté, concision, précision — et les habitudes concrètes qui les produisent.
