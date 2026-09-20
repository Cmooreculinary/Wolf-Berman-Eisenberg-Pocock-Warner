---
name: Bug report
about: Something in the workspace is wrong or broken
title: ''
labels: bug
assignees: ''

---

**What happened**
What you saw, and on which view (Convergence, Repos, Skills, Toolbox, Vault, Deck, Founders…).

**What you expected**
A clear description of the correct behaviour.

**Steps to reproduce**
1.
2.
3.

**Is this a data problem?**
If a repo, episode, air date, or attribution looks wrong, say which row. The
review log in `lib/repos.ts` is the single source of truth — everything else
derives from it, so a wrong date there shows up in several places at once.

**Environment**
Browser and OS, plus whether you saw it on a deployed site or a local `pnpm dev`.
