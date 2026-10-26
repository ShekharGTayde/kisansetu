# AGENTS.md: AgriPact Working Instructions

You are the work agent building AgriPact (MERN pre-crop contract farming platform). This file is your entry point. Three sibling documents drive all work:

| File | Role |
|---|---|
| `PRD` (requirements document) | What to build. Consult only for the requirement IDs (FR-/NFR-) cited by the current task. |
| `TASKS.md` | Ordered checklist and Status Board: what to do next and what is done. |
| `MEMORY.md` | Project memory: current state, conventions, registries, decisions. Prevents re-analysis. |

## Session start (always, in this order)

1. Read `MEMORY.md` fully.
2. Read the **Status Board** in `TASKS.md` and find the **Current task**.
3. Read only that task's block, plus the PRD sections for its FR-/NFR- IDs if needed.
4. Open only the code files that task touches. **Do not re-analyze the whole repo.**
5. Mark the task `[~]` and update the Status Board.

## During the task

- Work one task at a time, in serial order; never start a task whose dependencies are not `[x]`.
- Follow the conventions in `MEMORY.md` section 4. If you must make a new decision, make the smallest reasonable one and log it in section 5.
- Do not change scope, rename existing APIs/models, or refactor unrelated code without logging it under Deviations.
- Do not store or print secrets; use `.env` and keep `.env.example` current.

## Task completion checklist (all required)

- [ ] Implementation done; lint passes.
- [ ] Tests written and passing; the task's **Verify** steps pass.
- [ ] `TASKS.md`: box ticked `[x]`, Progress Log line added, Status Board advanced (current task, last completed, counters, phase).
- [ ] `MEMORY.md`: Current State, Repo Map, and relevant registries (models, API routes, pages, env vars) updated; decisions/gotchas/deviations recorded; Session Log line added.
- [ ] `.env.example` and README/API notes updated if applicable.
- [ ] Single commit: `T-0XX: short title`.

## If blocked

- Mark the task `[!]` in `TASKS.md`, add the reason under **Blockers**, and add the question to `MEMORY.md` section 13.
- Continue only with a later task whose dependencies are all complete; otherwise stop and report.

## Status reporting format (end of each task)

```
Task: T-0XX <title>
Result: done | blocked
Verified: <tests/commands run and outcome>
Files changed: <key files>
Memory updated: yes
Next task: T-0YY <title>
```

## Quality bar

- Every endpoint: validation, role + ownership check, standard envelope, Supertest coverage.
- Immutable data (negotiation history, active contract terms) must never be edited or deleted.
- Stay within the scope in `TASKS.md`; do not build out-of-scope features.
- Keep the UI simple and mobile-friendly.
