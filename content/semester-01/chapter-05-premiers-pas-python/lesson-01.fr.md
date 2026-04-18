# Installer Python et PyCharm

*Temps estimé : 15 minutes*

## Rappel (des chapitres précédents)

Sans regarder :

1. Qu'est-ce qu'un confondeur, en raisonnement causal ?
2. Pourquoi la check-list quand on reçoit un dataset commence-t-elle par « interroger l'origine » ?
3. Quels sont les trois modes de raisonnement ?

## Pourquoi Python

Parmi les langages qu'un analyste pourrait apprendre, **Python** est choisi ici pour trois raisons :

- **Lisible** — la syntaxe ressemble à de l'anglais, la courbe d'apprentissage est douce.
- **Omniprésent en données** — pandas, NumPy, scikit-learn, PyTorch, plotly… l'écosystème est mature.
- **Gratuit, libre, multi-plateforme** — Windows, macOS, Linux, même installation.

Tu verras plus tard d'autres outils (SQL pour les bases de données, R pour les statisticiens, Excel pour le quotidien). Python est **l'outil central** autour duquel tout s'articule.

## Ce qu'on installe

Deux choses distinctes :

1. **Python** — le langage et son interpréteur. C'est lui qui *exécute* le code.
2. **PyCharm** — l'éditeur (IDE) dans lequel on *écrit* le code. Pas obligatoire, mais recommandé pour débuter : il fait beaucoup pour toi.

On n'installe **pas** Anaconda. Anaconda est populaire mais crée des complications pour les débutants (conflits d'environnements, terminal spécifique, courbe d'apprentissage parallèle). On reste simple.

## Installation de Python

### Sur Windows

1. Va sur [python.org/downloads](https://www.python.org/downloads/) — clique sur « Download Python 3.12 » (ou version ≥ 3.12).
2. Ouvre l'installateur.
3. **Critique** : coche la case **« Add Python to PATH »** en bas de la première fenêtre. Sans ça, tu auras des complications plus tard.
4. Clique « Install Now ». Attends.
5. Ouvre un **PowerShell** (touche Windows → tape « powershell »). Tape :

   ```
   python --version
   ```

   Tu dois voir quelque chose comme `Python 3.12.2`. Si tu vois une erreur, Python n'est pas dans le PATH — réinstalle en cochant la case.

### Sur macOS

1. Va sur [python.org/downloads/macos](https://www.python.org/downloads/macos/) — télécharge l'installeur `.pkg` pour Python 3.12+.
2. Ouvre-le, suis les étapes.
3. Ouvre **Terminal** (Cmd+Espace → « Terminal »). Tape :

   ```
   python3 --version
   ```

   (Sur macOS, on utilise souvent `python3` et pas `python` — parce que `python` pointe historiquement vers une ancienne version système qu'il ne faut pas toucher.)

### Sur Linux

Python est probablement déjà installé. Tape `python3 --version` dans un terminal. Si absent : `sudo apt install python3 python3-pip` (Ubuntu/Debian) ou l'équivalent de ta distribution.

## Installation de PyCharm

### Version Community ou Professional ?

- **Community** : gratuite, open source. Suffit pour tout ce qu'on fait dans ce cours, y compris les notebooks Jupyter et pandas.
- **Professional** : payante (gratuite pour les étudiants avec une preuve d'inscription). Ajoute des outils web, bases de données visuelles, profilage avancé.

**Commence avec Community.** Si plus tard tu en veux plus, tu upgradras.

### Téléchargement

1. Va sur [jetbrains.com/pycharm/download](https://www.jetbrains.com/pycharm/download/).
2. Télécharge **PyCharm Community Edition** pour ton système.
3. Installe avec les options par défaut.

### Premier lancement

Au premier démarrage :

- Accepte la licence (Apache 2.0).
- Choisis un thème : **Dark** (recommandé) ou Light. Tu peux changer après.
- Ignore les options d'import de paramètres existants.
- Dans la fenêtre d'accueil, tu verras « New Project ».

### Raccourcis Windows / macOS

PyCharm utilise des raccourcis différents selon l'OS. Toi, tu es sur :

- **Windows/Linux** : `Ctrl` est la touche de modification principale.
- **macOS** : `⌘` (Cmd) remplace `Ctrl` dans la plupart des cas.

Exemples qui vont revenir souvent :

| Action                       | Windows / Linux        | macOS                  |
| ---------------------------- | ---------------------- | ---------------------- |
| Exécuter une cellule         | `Shift + Enter`        | `Shift + Enter`        |
| Ouvrir/fermer le terminal    | `Alt + F12`            | `⌥ F12`                |
| Rechercher dans tout le projet | `Ctrl + Shift + F`    | `⌘ Shift F`            |
| Navigation arrière           | `Ctrl + Alt + ←`       | `⌘ ⌥ ←`                |
| Renommer une variable        | `Shift + F6`           | `Shift F6`             |
| Commenter une ligne          | `Ctrl + /`             | `⌘ /`                  |

On reviendra sur ces raccourcis. Ce qui compte aujourd'hui : **les écrire sur un post-it visible** à côté de l'écran les premières semaines. Ton cerveau les absorbera.

## Créer ton premier projet

1. Dans PyCharm : `New Project`.
2. Emplacement : un dossier **sans espaces ni accents** dans le chemin (par exemple `C:\Users\ton-nom\code\python-da` sur Windows, `/Users/ton-nom/code/python-da` sur macOS). Les espaces et accents causent des bugs sournois.
3. **Interpréteur** : laisse PyCharm en créer un nouveau (*New virtualenv*). Un environnement virtuel isole les paquets du projet — on en reparle leçon 2.
4. Coche « Create a main.py welcome script » — ça crée un fichier d'exemple.
5. Clique « Create ».

Tu vois la fenêtre principale de PyCharm : à gauche l'arborescence du projet, au milieu l'éditeur, en bas un terminal et une console Python.

Ouvre `main.py`. Clique sur le petit triangle vert à gauche de la ligne 1 ou 2 — ou appuie `Shift + F10` (Windows) / `Ctrl + R` (macOS). En bas, une fenêtre s'ouvre et affiche « Hi, PyCharm ».

**Félicitations : tu viens de faire tourner ton premier programme Python.**

## Un mot sur pip

Python vient avec un gestionnaire de paquets : **pip**. Il te permet d'installer des bibliothèques tierces (pandas, NumPy, matplotlib…). On l'utilisera à partir de la prochaine leçon.

Vérifie qu'il marche. Dans le terminal de PyCharm (`Alt + F12` / `⌥ F12`), tape :

```
pip --version
```

Tu dois voir la version de pip et le chemin vers ton environnement virtuel. Si tu vois une erreur, l'environnement n'est pas bien activé — demande à PyCharm de recréer l'interpréteur via `File → Settings → Project → Python Interpreter` (Windows) ou `PyCharm → Settings → Project → Python Interpreter` (macOS).

## Erreurs courantes

- **« python: command not found »** (Windows) — Python n'est pas dans le PATH. Réinstalle en cochant la case.
- **« python » lance une version ancienne** (macOS) — utilise `python3` à la place.
- **PyCharm n'exécute rien** — vérifie que l'interpréteur est configuré : `File → Settings → Project → Python Interpreter` doit montrer une version 3.x.
- **Un chemin avec des accents refuse de marcher** — déplace ton projet dans un dossier sans accents ni espaces.

## À retenir

- On installe **Python ≥ 3.12** depuis python.org (ne pas utiliser Anaconda pour l'instant).
- On installe **PyCharm Community Edition** (gratuite).
- Sur Windows : coche **« Add Python to PATH »**. Sur macOS : utilise `python3`.
- Ton premier projet tourne avec `Shift + F10` / `Ctrl + R`.
- Note les raccourcis clavier pour ton OS — ils te feront gagner des heures.

---

> **La prochaine fois** : le Jupyter notebook intégré à PyCharm — l'outil de référence de l'analyste moderne. Qu'est-ce qu'une cellule, pourquoi c'est révolutionnaire, comment ne pas s'y perdre.
