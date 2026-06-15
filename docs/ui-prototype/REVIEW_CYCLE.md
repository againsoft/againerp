# Prototype Review Cycle

> **Parent:** [UI_PROTOTYPE_MODE.md](../UI_PROTOTYPE_MODE.md) · [UI_PROTOTYPE_STRATEGY.md](../UI_PROTOTYPE_STRATEGY.md)

---

## Six-Step Cycle (Per Screen — No Exceptions)

### Step 1 — Create Page Documentation

- [ ] Write `{Page}.md` from `_PAGE_PROTOTYPE_TEMPLATE.md`
- [ ] Create `{Page}Review.md` and `{Page}Changes.md` stubs
- [ ] Link mock fixture paths

### Step 2 — Create Wireframe

- [ ] ASCII or linked wireframe in page MD
- [ ] Shell zones per [PROTOTYPE_SHELL.md](./PROTOTYPE_SHELL.md)

### Step 3 — Build High-Fidelity UI

- [ ] Next.js page in `apps/web/` (when coding starts)
- [ ] Shadcn + AG Grid + Recharts per constitution
- [ ] Verify navigation from menu

### Step 4 — Add Dummy Data

- [ ] Bind fixtures from `data/*.json`
- [ ] Meet minimum volumes in [DUMMY_DATA_STANDARDS.md](./DUMMY_DATA_STANDARDS.md)

### Step 5 — Review UX

- [ ] Complete `{Page}Review.md` checklist
- [ ] Stakeholder walkthrough
- [ ] Mobile + desktop + dark mode
- [ ] Log issues in `ReviewQuestions.md`
- [ ] Workflow + AI opportunity review

### Step 6 — Update Documentation

- [ ] `{Page}Changes.md` updated
- [ ] `{Page}.md` marked **Ready** if approved
- [ ] CHANGELOG.md entry
- [ ] Cross-link `Menus/` arch doc

**Only then** proceed to next screen. Backend production waits for [PRODUCTION_READINESS.md](./PRODUCTION_READINESS.md).

---

## Review Meeting Template

| Item | Notes |
|------|-------|
| Pages reviewed | |
| Attendees | |
| UX issues | → ReviewQuestions.md |
| Missing features | → MissingFeatures.md |
| Ideas | → ImprovementIdeas.md |
| Decisions | → CHANGELOG.md |
