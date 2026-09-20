# Publishing

How this project gets in front of people. Live site:
<https://eisenberg-pocock-warner-wolfe-berman.onrender.com>

Everything below assumes `pnpm check` and `pnpm build:static` pass first. A
broken demo is worse than no post.

## Before any of it

- **One screenshot**, roughly 1200×630, of the repo board or the ACP funnel
  simulator. Every platform below leans on it.
- **The disclaimer travels with the link.** This project indexes five real
  people's public videos. Say it is unaffiliated, every time. Implying
  endorsement is both untrue and, on Reddit, a rule violation.

## Hugging Face — a Static Space

This is a site, not a model or a dataset, so the right home is a Static Space.

```bash
# 1. Build the export
corepack enable
pnpm install --frozen-lockfile
pnpm build:static          # → out/

# 2. Log in
pip install -U huggingface_hub
hf auth login              # WRITE token from hf.co/settings/tokens
                           # (older releases call this binary huggingface-cli)
```

3. **Create the Space** — huggingface.co/new-space → name
   `wolf-berman-eisenberg-pocock-warner` → License **MIT** → SDK **Static** →
   Public.

4. **Write the Space card.** A Space README needs YAML frontmatter, and `out/`
   has none, so keep one at `space/README.md` (untracked) or paste this in the
   web editor:

   ```markdown
   ---
   title: Eisenberg, Pocock, Warner, Wolfe & Berman
   emoji: 📡
   colorFrom: gray
   colorTo: blue
   sdk: static
   app_file: index.html
   pinned: false
   license: mit
   ---

   A rolling four-week window on five public founder feeds — repos reviewed
   with crossovers cut, the skills each review taught, an ACP funnel
   simulator, and a 13-slide exportable deck.

   Source: https://github.com/Cmooreculinary/Wolf-Berman-Eisenberg-Pocock-Warner

   An independent, unaffiliated index of publicly available videos. Not
   endorsed by, sponsored by, or affiliated with any of the creators listed.
   ```

5. **Upload:**

   ```bash
   SPACE=<your-username>/wolf-berman-eisenberg-pocock-warner
   hf upload "$SPACE" out . --repo-type=space
   hf upload "$SPACE" space/README.md README.md --repo-type=space
   ```

   Live at `https://<username>-wolf-berman-eisenberg-pocock-warner.hf.space`
   within a minute. The Static SDK serves `index.html` at the root and handles
   the `_next/` asset paths as-is.

6. Tag the Space (`nextjs`, `dashboard`, `agents`) and link the GitHub repo on
   the card. To update later, rebuild and re-run the `out/` upload.

## Reddit — four posts, spread over about two weeks

Rules that get posts removed if ignored:

- Low-karma and brand-new accounts are auto-filtered nearly everywhere.
- **r/webdev** — self-promo only inside the Showoff Saturday thread.
- **r/nextjs** — project posts are allowed; check the sidebar for the current
  self-promo window.
- **r/SideProject** — open any day, the most forgiving. Start here.
- **r/opensource** — expects a real OSS license (there is one) and code talk,
  not a product pitch.

Never post the same text to two subs on the same day; that is the fastest route
to a site-wide shadowban. Post as a **text post** with the links in the body —
link posts get throttled and several of these subs ban them outright.

Suggested order: r/SideProject (day 1) → r/nextjs (day 3) → r/webdev (next
Saturday) → r/opensource (day 10).

Title, no hype:

> I built a rolling 4-week dashboard that tracks which repos five founder channels actually reviewed

Body:

```
Five creators review a lot of repos and there was no way to see the overlap,
so I built one. It keeps a rolling four-week window, dedupes crossovers by
GitHub owner/name, maps each repo to a pillar (agents / governance / media),
and derives a skills curriculum from the same review log so the board and the
curriculum can't disagree about air dates.

Also in there: an ACP funnel simulator, a technical-core inventory, and a
13-slide deck that exports to .pptx in the browser.

Demo: https://eisenberg-pocock-warner-wolfe-berman.onrender.com
Code: https://github.com/Cmooreculinary/Wolf-Berman-Eisenberg-Pocock-Warner

Stack: Next.js 16, React 19, Tailwind 4, shadcn, pptxgenjs. Fully static —
every route prerenders, so it deploys to a free CDN tier with no server.

Not affiliated with any of the creators; it indexes their public videos.

Happy to answer anything about the data model — one review log is the single
source of truth and a CI check fails the build if anything drifts from it.
```

Then answer every comment in the first two hours. Reddit weighs early
engagement heavily and that window decides whether the post travels.

## Discord — three servers, showcase channels only

Read `#rules` first, clear whatever onboarding gate the server has, post **once**
in the designated channel. Never `#general`, never DMs.

| Server | Where to join | Channel |
| --- | --- | --- |
| Next.js / Vercel Community | nextjs.org, Discord link in the footer | `#showcase` |
| Hugging Face | hf.co/join/discord | `#i-made-this` — link the **Space** |
| Reactiflux | reactiflux.com | the showcase channel (name shifts; check `#rules`) |

```
Built a rolling four-week dashboard over five public founder feeds — dedupes
repo crossovers, maps each to a pillar, and derives a skills curriculum from
the same review log so air dates can't drift. Next.js 16 + React 19, fully
static export, in-browser .pptx deck export.

https://eisenberg-pocock-warner-wolfe-berman.onrender.com

Unaffiliated index of public videos. Feedback on the data model welcome.
```

Attach the screenshot to that message, then put any follow-up detail in a
**thread** on your own post rather than more channel messages.

## Order

Hugging Face Space first (it is a second live URL and a second audience) →
Discord the same day (fast feedback, catches anything embarrassing) → Reddit
starting the next day (widest reach, hardest to redo if the demo is broken).
