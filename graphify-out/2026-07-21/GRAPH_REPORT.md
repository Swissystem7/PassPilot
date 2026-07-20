# Graph Report - .  (2026-07-21)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 100 nodes · 67 edges · 43 communities (35 shown, 8 thin omitted)
- Extraction: 34% EXTRACTED · 66% INFERRED · 0% AMBIGUOUS · INFERRED: 44 edges (avg confidence: 0.56)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6593d695`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- run
- PassPilot
- analyzeMockExamIntegrity.js
- generateRecoverySprint.js
- trackStudyStreak.js
- getAccountabilityPartnerProgress.js
- AI/NotebookLM Usage
- Error Recovery
- Passing Score Zone (50-61)
- Pomodoro
- Question List (Take/Backup/Waive)
- Time Allocation Rule (65/25/10)

## God Nodes (most connected - your core abstractions)
1. `run` - 6 edges
2. `PassPilot` - 4 edges
3. `PassPilot Main Interface` - 4 edges
4. `Pilot API Object` - 4 edges
5. `factory-ci workflow` - 4 edges
6. `analyzeMockExamIntegrity()` - 3 edges
7. `weakTopicRanker` - 3 edges
8. `computePassProbabilityWithConfidence` - 3 edges
9. `generateInitialStudyPlan` - 3 edges
10. `getExamData()` - 2 edges

## Surprising Connections (you probably didn't know these)
- `PassPilot Main Interface` --implements--> `PassPilot`  [INFERRED]
  index.html → README.md
- `PassPilot Main Interface` --conceptually_related_to--> `Pass Control Board`  [INFERRED]
  index.html → README.md
- `PassPilot Main Interface` --conceptually_related_to--> `Active Recall`  [INFERRED]
  index.html → README.md
- `PassPilot Main Interface` --conceptually_related_to--> `Mock Exams`  [INFERRED]
  index.html → README.md
- `factory-ci workflow` --references--> `weakTopicRanker`  [INFERRED]
  .github/workflows/factory-ci.yml → index.html

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **PassPilot Core Library** — index_html_weakTopicRanker, index_html_computePassProbabilityWithConfidence, index_html_generateInitialStudyPlan, index_html_generateCramSchedule, index_html_pilot_object [EXTRACTED 1.00]
- **PassPilot Methodology Principles** — README_active_recall, README_spaced_learning, README_mock_exams, README_error_recovery, README_question_list, README_pomodoro, README_ai_usage, README_passing_zone, README_time_allocation [EXTRACTED 1.00]
- **Exam Topics** — index_html_algebra, index_html_geometry, index_html_probability [EXTRACTED 1.00]

## Communities (43 total, 8 thin omitted)

### Community 0 - "run"
Cohesion: 0.31
Nodes (10): factory-ci workflow, Algebra, computePassProbabilityWithConfidence, generateCramSchedule, generateInitialStudyPlan, Geometry, Pilot API Object, Probability (+2 more)

### Community 1 - "PassPilot"
Cohesion: 0.38
Nodes (7): Active Recall, Aviran, Mock Exams, Pass Control Board, PassPilot, Spaced Learning, PassPilot Main Interface

### Community 2 - "analyzeMockExamIntegrity.js"
Cohesion: 0.83
Nodes (3): analyzeMockExamIntegrity(), checkCollusion(), getExamData()

### Community 4 - "trackStudyStreak.js"
Cohesion: 0.67
Nodes (3): parseDate(), streaks, trackStudyStreak()

## Knowledge Gaps
- **15 isolated node(s):** `{ randomUUID }`, `records`, `{ createHash }`, `streaks`, `Aviran` (+10 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Are the 2 inferred relationships involving `PassPilot` (e.g. with `Aviran` and `PassPilot Main Interface`) actually correct?**
  _`PassPilot` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 4 inferred relationships involving `PassPilot Main Interface` (e.g. with `Active Recall` and `Mock Exams`) actually correct?**
  _`PassPilot Main Interface` has 4 INFERRED edges - model-reasoned connections that need verification._
- **Are the 4 inferred relationships involving `factory-ci workflow` (e.g. with `computePassProbabilityWithConfidence` and `generateCramSchedule`) actually correct?**
  _`factory-ci workflow` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `{ randomUUID }`, `records`, `{ createHash }` to the rest of the system?**
  _15 weakly-connected nodes found - possible documentation gaps or missing edges._