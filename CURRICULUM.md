# Curriculum — 10-semester program map

A master's-equivalent, "Oppenheimer-view" data-analyst course. Each semester runs four pillars **in parallel** — DA Core, Math / Science, Humanities & Language, Capstone — so every week interleaves code, mathematics, and the humanities. Interleaving is a deliberate learning-sciences choice, not a scheduling accident.

- **Total**: ~4,500 learner-hours across 5 years
- **Per semester**: ~450 hours = ~30 h/week × 15 weeks
- **MVP**: Semester 1 (see §"Semester 1 — detailed" below)

## Program map at a glance

| #   | Title                              | DA Core                                                      | Math / Science                                               | Humanities & Language                                | Capstone                                   |
| --- | ---------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ---------------------------------------------------- | ------------------------------------------ |
| S1  | **Foundations of Thinking**        | What is data; Python basics (vars, types, control flow); spreadsheets I | Arithmetic → algebra refresh; propositional logic; descriptive stats intro | Scientific method; critical thinking; writing I; FR/EN reading | Personal-data journal analysis (spreadsheet) |
| S2  | **Structures & Stories**           | Python functions, modules, errors; SQL I; Excel mastery      | Pre-calculus; probability intuition                          | Philosophy of science (Popper, Kuhn); narrative theory; rhetoric | Public-dataset dashboard (Excel only)       |
| S3  | **The Mathematics of Measurement** | NumPy, Pandas intro; Jupyter fluency                         | Calculus I; linear algebra I; probability theory             | Formal logic; history of science; literature I (essays) | First Python EDA notebook                   |
| S4  | **Inference**                      | Pandas mastery; Matplotlib / Seaborn                         | Calculus II; linear algebra II; inferential statistics; Bayesian thinking | Data ethics; political philosophy; classical literature analysis | Hypothesis-test report                      |
| S5  | **Systems**                        | Advanced SQL (windows, CTEs); relational theory; data cleaning workflows | Physics I (mechanics → modeling reality); regression (linear, logistic) | Cross-cultural communication; FR/EN technical writing | SQL investigation on open data              |
| S6  | **Models**                         | ML fundamentals (trees, kNN, SVM); time series; Power BI **or** Tableau | Multivariate statistics; physics II (thermo & statistical mechanics) | Political economy & public data; media literacy      | Supervised-ML mini-project                  |
| S7  | **Engineering**                    | ETL / pipelines (Airflow basics); Git workflows; cloud concepts (S3, BigQuery) | Unsupervised ML; physics III (waves → signals → Fourier intuition) | Philosophy of mind & AI; professional writing        | End-to-end pipeline                         |
| S8  | **Influence**                      | Storytelling with data; dashboard UX; stakeholder management | Causal inference (Pearl, Rubin); advanced experimentation    | Public-policy analysis; rhetoric II (Aristotle → modern) | Executive dashboard + memo                  |
| S9  | **Frontiers**                      | Deep-learning foundations; NLP for analysts; geospatial; Spark overview | Complex systems; emergence                                   | Philosophy of technology; research methods           | Research mini-paper                         |
| S10 | **Thesis & Practice**              | Portfolio; interview prep; consulting frameworks; GDPR; bias audits | —                                                            | Ethics in practice; oral defense                     | **Thesis** + public defense video           |

---

## Year 1 — Foundations

### Semester 1 — Foundations of Thinking *(MVP)*

**Learning objectives.** At the end of S1, the learner can: read and interpret basic data; reason with propositional logic; write a short scientific argument; refresh arithmetic and algebra to function fluently in equations; install and navigate PyCharm; write small Python programs with variables, conditions, and loops; build and interpret a pivot table; apply the scientific method to a personal question.

**Chapters** (9 chapters, ~50 h each):

1. **Apprendre à apprendre** — how the brain learns (encoding, retrieval, spacing, interleaving); using this course; Zettelkasten note-taking; Pomodoro; self-assessment
2. **Qu'est-ce qu'une donnée ?** — epistemology of measurement; categorical vs numerical; data quality; the map ≠ the territory
3. **Logique & raisonnement** — propositional logic; truth tables; fallacies (ad hominem, strawman, cherry-picking); proof intuition
4. **Mathématiques fondamentales** — arithmetic, fractions, percentages, ratios → algebra → functions → linear/affine models
5. **Premiers pas en Python** — installing Python + PyCharm; variables, types, I/O; arithmetic in Python; comments & style
6. **Contrôler le flux** — conditions, loops, errors, `try/except`; debugging mindset
7. **Tableurs I** — Excel / LibreOffice; formulas; references; pivot tables; basic charts
8. **Écrire & argumenter** — scientific writing structure (IMRaD); reading dense texts; citing sources; avoiding plagiarism
9. **Méthode scientifique** — hypotheses, experiments, controls, bias, replication

**S1 capstone.** One month of personal data (sleep, screen time, steps, mood…) logged in a spreadsheet, analyzed with basic stats and a pivot table, and summarized in a short IMRaD report applying the scientific method.

### Semester 2 — Structures & Stories

Python mastery of functions, modules, errors, imports, and the standard library. First exposure to SQL (SELECT, WHERE, JOIN, GROUP BY) and relational thinking. Full Excel fluency (VLOOKUP/XLOOKUP, INDEX/MATCH, data validation, named ranges). Pre-calculus: exponentials, logarithms, trigonometry basics. Probability *intuition* (sample spaces, independence, conditional probability). Philosophy of science — Popper's falsifiability, Kuhn's paradigms, Feyerabend's critique. Narrative theory — why stories beat tables for humans. Classical rhetoric basics.

**Capstone.** A dashboard in Excel only, on a real public dataset (e.g. French open data), with a written narrative driving the viewer through the findings.

## Year 2 — Core skills

### Semester 3 — The Mathematics of Measurement

NumPy (arrays, broadcasting, vectorization). Pandas introduction (Series, DataFrame, basic I/O, `groupby`). Full Jupyter fluency in PyCharm. Calculus I — limits, continuity, derivatives, rules of differentiation, optimization basics. Linear algebra I — vectors, matrix operations, dot product, geometric interpretation. Probability theory — axioms, distributions (Bernoulli, binomial, normal), expectation, variance. Formal logic — predicate logic, quantifiers. History of science — from Babylonian astronomy to the Scientific Revolution. Literature I — reading essays (Montaigne, Orwell, Sontag) for argument structure.

**Capstone.** First Python EDA notebook — clean, explore, and visualize a real dataset end-to-end with NumPy + Pandas + Matplotlib.

### Semester 4 — Inference

Pandas mastery (`merge`, `pivot_table`, `apply`, `resample`, performance). Matplotlib and Seaborn for publication-quality charts. Calculus II — integrals, multivariate intro, gradients. Linear algebra II — eigenvalues, SVD intuition, projections. Inferential statistics — sampling, CLT, confidence intervals, hypothesis tests, p-values (with honest caveats), effect size, power. Bayesian thinking — priors, posteriors, updating. Data ethics — FAIR principles, consent, re-identification. Political philosophy of data (Rawls, Nozick; who decides what is measured?). Classical literature analysis — extended-argument texts.

**Capstone.** A full hypothesis-testing report on a real dataset: pose the question, justify the test, run it, interpret it honestly (including failure modes).

## Year 3 — Specialization

### Semester 5 — Systems

Advanced SQL — window functions, CTEs, recursive queries, query optimization basics. Relational theory — normalization, keys, ACID. Data-cleaning workflows — missing data strategies, outlier handling, leakage. Physics I — classical mechanics as the archetype of mathematical modeling; how equations encode reality. Regression — linear, polynomial, logistic; assumptions; diagnostics. Cross-cultural communication — working on distributed teams. FR/EN technical writing — documentation, reports, emails.

**Capstone.** SQL-driven investigation of a large open dataset (≥1 GB), answering a non-trivial question, with documented methodology.

### Semester 6 — Models

ML fundamentals — train/test/validate, cross-validation, decision trees, random forests, kNN, SVM, baseline models, metrics (accuracy, precision, recall, F1, ROC-AUC). Time-series basics — stationarity, ARIMA, seasonality. Choice of BI tool (Power BI **or** Tableau, both taught enough to decide). Multivariate statistics — ANOVA, MANOVA, factor analysis intro. Physics II — thermodynamics and statistical mechanics (probability made tangible via entropy). Political economy — how economic data is constructed and contested. Media literacy — reading charts critically in the wild.

**Capstone.** Supervised-ML mini-project with honest evaluation, including a section on what the model gets wrong and why.

## Year 4 — Advanced & integration

### Semester 7 — Engineering

Data engineering — ETL patterns, Airflow basics, data contracts, idempotency. Advanced Git — rebasing, bisect, hooks, team workflows. Cloud concepts — object storage, warehouses (BigQuery/Snowflake mental model), cost thinking. Unsupervised ML — k-means, hierarchical clustering, DBSCAN, PCA, UMAP. Physics III — waves, Fourier intuition, signals. Philosophy of mind & AI — symbol grounding, Searle, Dennett, the frame problem. Professional writing at length.

**Capstone.** End-to-end pipeline: source → warehouse → transformed tables → dashboard, with monitoring.

### Semester 8 — Influence

Storytelling with data (Nussbaumer-Knaflic approach). Dashboard UX — grids, hierarchy, colorblind-safe palettes, cognitive load. Stakeholder management — asking the right questions, managing expectations, saying no. Causal inference — Pearl (do-calculus, DAGs) and Rubin (potential outcomes); when correlation *can* tell you something. Advanced experimentation — quasi-experiments, diff-in-diff, RDD. Public-policy analysis — how governments use data, and fail to. Rhetoric II — Aristotle's rhetoric, modern political rhetoric analysis.

**Capstone.** Executive dashboard + written memo for a real decision problem.

## Year 5 — Mastery

### Semester 9 — Frontiers

Deep-learning foundations — perceptrons, backprop intuition, CNNs, transformers *as tools for analysts*, not DL research. NLP for analysts — embeddings, topic models, sentiment, simple retrieval. Geospatial analysis — projections, `geopandas`, spatial joins. Spark overview — when and why to leave Pandas. Complex systems — emergence, networks, power laws. Philosophy of technology — Ellul, Postman, contemporary critiques. Research methods — literature review, reproducibility, peer review.

**Capstone.** Research mini-paper (10–20 pages), with a formal lit review and an original small study.

### Semester 10 — Thesis & Practice

Portfolio construction (GitHub, personal site, case studies). Interview preparation (behavioral, SQL, case, ML-fundamentals rounds). Consulting frameworks (issue trees, MECE, hypothesis-driven). GDPR and data privacy in practice. Bias audits — fairness metrics, limits of fairness metrics. Oral defense training.

**Final capstone — Thesis.** 40–80 pages. Real dataset, real question, full methodology, honest discussion of limits. Accompanied by a public defense video (15–20 min presentation + Q&A simulated or real).

---

## Pedagogical principles applied across all semesters

1. **Retrieval practice** — every lesson opens with 3–5 questions from previous chapters
2. **Spaced repetition** — flashcards per chapter, SRS schedule in localStorage, Anki-exportable
3. **Worked examples → fading → independent practice**
4. **Interleaved practice blocks** at end of each chapter
5. **Metacognitive prompts** after every exercise set
6. **Chunked lessons** — 12–15 minutes each, visible time estimate
7. **One clear CTA** per page
8. **Real datasets** from the start — no toy-only exercises past S2

## Assessment rubric (used for every capstone)

| Dimension        | Weight | Criteria                                                     |
| ---------------- | ------ | ------------------------------------------------------------ |
| Correctness      | 30 %   | Results are right; methodology is sound                      |
| Clarity          | 25 %   | A non-specialist can follow the argument                     |
| Depth            | 25 %   | Goes beyond the surface; addresses edge cases and limits honestly |
| Communication    | 20 %   | Writing, charts, and code are all well-crafted               |

## Status

- **S1**: MVP — in progress (shipping first)
- **S2 → S10**: designed, not built — see this document for the map
