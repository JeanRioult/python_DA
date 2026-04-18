# Le notebook Jupyter dans PyCharm

*Temps estimé : 15 minutes*

## Rappel

Sans regarder :

1. Pourquoi ce cours n'utilise pas Anaconda ?
2. Quelle case **critique** cocher à l'installation de Python sur Windows ?
3. Quel raccourci exécute le script courant dans PyCharm ?

## Pourquoi les notebooks ?

Un **notebook Jupyter** est un document interactif qui mélange **code**, **texte** (en Markdown) et **résultats** (graphiques, tables) dans la même page. L'extension est `.ipynb` (*IPython notebook*).

Pourquoi les analystes adorent les notebooks :

- **Itération rapide** — exécute un morceau de code, vois le résultat, modifie, recommence.
- **Récit** — un notebook raconte *une analyse*, dans l'ordre logique, avec explications.
- **Reproductibilité** — quelqu'un peut ouvrir ton notebook et tout relancer cellule par cellule.
- **Exploration + livraison dans le même artefact** — contrairement à un script, le notebook *montre* les résultats intégrés.

Ce n'est **pas** le bon outil pour tout :

- Une application web → non, utilise des scripts Python.
- Du code de production critique → non, utilise des modules testés.
- Un vrai logiciel → non, utilise PyCharm en mode projet.

Mais pour **analyser, explorer, raconter une histoire avec des données**, le notebook est imbattable.

## La cellule, unité de base

Un notebook est une séquence de **cellules**. Chaque cellule est soit :

- Une cellule **Code** — contient du Python, produit un résultat à l'exécution.
- Une cellule **Markdown** — contient du texte formaté (titres, gras, listes, équations, images).

Tu exécutes une cellule avec `Shift + Enter`. Le curseur passe à la suivante automatiquement. Pour rester sur la cellule après exécution : `Ctrl + Enter` (Windows/Linux) ou `⌘ Enter` (macOS).

Les résultats de chaque cellule sont **gardés en mémoire** et partagés avec les suivantes. Si tu définis `x = 5` dans la cellule 1, la cellule 2 peut utiliser `x` — tant que tu n'as pas fermé le notebook ou redémarré le *kernel*.

## Le kernel — le moteur d'exécution

Le **kernel** est le processus Python qui tourne derrière ton notebook. Il tient toutes les variables, tous les imports, toutes les fonctions que tu as définies.

Trois opérations à connaître :

- **Interrompre** (`Esc`, puis `I I` — deux fois la lettre i) — arrête une cellule bloquée.
- **Redémarrer** (`Esc`, puis `0 0`) — remet le kernel à zéro. Toutes tes variables disparaissent. Utile quand ton état est corrompu.
- **Redémarrer et tout re-exécuter** — teste que ton notebook est **reproductible** : un nouveau kernel peut-il relancer toutes les cellules en ordre sans erreur ?

**Règle** : avant de livrer un notebook, redémarre le kernel et relance tout depuis le haut. Un notebook qui ne passe pas ce test est cassé, même s'il a l'air de fonctionner.

## Modes d'édition et de commande

Un notebook a **deux modes**, hérités de Vim :

- **Mode édition** (bordure bleue/verte selon le thème) — tu tapes dans la cellule.
- **Mode commande** (bordure grise) — tu navigues entre cellules avec des raccourcis.

Tu bascules avec `Esc` (vers commande) et `Enter` (vers édition).

Quelques raccourcis en mode **commande** qui te changeront la vie :

| Raccourci       | Action                                                |
| --------------- | ----------------------------------------------------- |
| `A`             | insérer une cellule **au-dessus** (*Above*)           |
| `B`             | insérer une cellule **en-dessous** (*Below*)          |
| `D D` (deux D)  | supprimer la cellule courante                         |
| `M`             | changer la cellule en **Markdown**                    |
| `Y`             | changer la cellule en **code** (*Y* comme *pYthon*)   |
| `X`             | couper la cellule                                     |
| `V`             | coller la cellule                                     |
| `Z`             | annuler la dernière suppression                       |
| `Shift + Enter` | exécuter et descendre                                 |
| `Ctrl+Shift+-`  | couper la cellule en deux à l'endroit du curseur      |

## Installer les paquets pour les notebooks dans PyCharm

La première fois que tu crées un fichier `.ipynb` dans PyCharm, l'IDE te proposera d'installer `jupyter` dans ton environnement. Accepte.

Ou, dans le terminal PyCharm, à la main :

```bash
pip install jupyter ipykernel pandas numpy matplotlib
```

- `jupyter` et `ipykernel` : le moteur des notebooks.
- `pandas` : tableurs en Python (colonne vertébrale de l'analyse).
- `numpy` : tableaux numériques rapides.
- `matplotlib` : graphiques de base.

On utilisera `numpy` et `matplotlib` bien plus tard ; les installer maintenant évite des interruptions.

## Structure d'un bon notebook

Un notebook d'analyse bien construit suit toujours le même squelette :

1. **Titre + contexte** (Markdown) — pourquoi ce notebook existe, quelle question on pose.
2. **Imports** (Code) — une seule cellule, tous les imports en haut.
3. **Chargement des données** (Code) — ou plusieurs cellules si c'est long.
4. **Exploration** (alternance Markdown + Code) — statistiques descriptives, premiers graphiques.
5. **Analyse** — le cœur du notebook, ce qui répond à la question posée.
6. **Conclusion** (Markdown) — ce qu'on a appris, les limites, les questions ouvertes.

Un lecteur doit pouvoir parcourir uniquement les cellules Markdown et comprendre **l'essentiel** de ton raisonnement. Les cellules de code sont l'*appendice technique*.

## Les erreurs de débutant à éviter

### Les cellules exécutées dans le désordre

Tu vois `In [17]` sur la première cellule et `In [3]` sur la cinquième. Ça veut dire que tu les as exécutées dans un ordre chaotique. Un lecteur ne peut pas reproduire ton travail.

**Règle** : pense à ton notebook comme une **histoire linéaire**. Toujours relisable du haut vers le bas, cellule par cellule, sans retours en arrière invisibles.

### Les variables fantômes

Tu définis `x = 5`, tu utilises `x` partout, puis tu supprimes la cellule qui définit `x`. Le notebook continue de marcher — parce que `x` est toujours dans le kernel — mais si tu redémarres, tout explose.

**Règle** : le test du « redémarrer et tout relancer ». Si ça passe, ton notebook est propre.

### Les cellules qui grossissent

Une cellule de 200 lignes de code est illisible. **Découpe** : une cellule par idée. Six cellules courtes battent une cellule longue.

### Oublier de sauvegarder

`Ctrl + S` (Windows) / `⌘ S` (macOS) sauvegarde le notebook et ses sorties. PyCharm sauvegarde automatiquement — mais pas toujours juste avant un crash. Prends l'habitude.

### Commiter les sorties lourdes

Si ton notebook contient un graphique PNG de 10 Mo intégré, il devient lourd, lent à charger, impossible à diff-er en version control. Si tu utilises Git (on en parle plus tard) : efface les sorties avant de committer (`Cell → All Output → Clear`).

## Un premier notebook

Crée maintenant un nouveau notebook :

1. Dans PyCharm, clic droit sur le dossier du projet → `New → Jupyter Notebook`.
2. Nomme-le `hello.ipynb`.
3. Dans la première cellule, tape :

   ```python
   print("Bonjour, notebook.")
   2 + 2
   ```

4. `Shift + Enter`. Tu dois voir `Bonjour, notebook.` puis `4`.

Remarque : en notebook, **la dernière expression** d'une cellule est affichée automatiquement (sans `print`). C'est très pratique pour explorer, un peu piégeux au début.

## À retenir

- Un notebook est **une histoire** : code, texte, résultats, en ordre logique.
- `Shift + Enter` exécute ; `Esc` + `M/Y/A/B/D D` manipulent les cellules.
- Le **kernel** garde l'état ; toujours tester « redémarrer et tout relancer » avant de livrer.
- **Ordre chaotique d'exécution = notebook cassé**, même si ça « marche ».
- Cellules **courtes**, imports **en haut**, structure **claire**.

---

> **La prochaine fois** : écrire du vrai Python. Variables, types primitifs, affectations — les briques de tout ce qui suit.
