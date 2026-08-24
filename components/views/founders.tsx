"use client"

import { INVENTORY } from "@/lib/data"
import { REVIEW_LOG, buildWindow } from "@/lib/repos"
import { Chip, Panel } from "@/components/kit"

/* The angle: built in the trench, not the tower. The range of what we ship is
   evidence of hours logged, not of a thesis defended. */

const TENETS: { key: string; title: string; body: string }[] = [
  {
    key: "Ship",
    title: "A thing that runs beats a thing that's argued about.",
    body: "I would rather have an ugly agent in production on Tuesday than an elegant one in a doc forever. Running code tells you the truth about your assumptions. A document only tells you how good you are at writing documents.",
  },
  {
    key: "Prove",
    title: "If you can't verify it, you didn't build it.",
    body: "Anybody can point a model at a repo and watch the line count go up. Proving the output is correct at the same speed it was written is the actual job. Every agent I keep has something whose only purpose is to catch what the author missed.",
  },
  {
    key: "Own",
    title: "Rented attention resets every month.",
    body: "Owned channels compound. So the play is a free utility that earns the install, creators paid on what they actually sell, and a list nobody can take away from me. I've paid the platform tax before. I'm not paying it again.",
  },
  {
    key: "Range",
    title: "Breadth is a safety system, not a hobby.",
    body: "One product is a single point of failure with a logo on it. A spread of small, sharp tools across different problems means a bad quarter in one lane doesn't end the shop.",
  },
]

export function FoundersView() {
  const agents = INVENTORY.filter((i) => i.kind === "agent").length
  const skills = INVENTORY.filter((i) => i.kind === "skill").length
  const protocols = INVENTORY.filter((i) => i.kind === "protocol").length
  const win = buildWindow(REVIEW_LOG)

  const ledger: { value: string; label: string }[] = [
    { value: String(agents), label: "Agents in the shop" },
    { value: String(skills), label: "Methods documented" },
    { value: String(protocols), label: "Protocols wired" },
    { value: String(win.active.length), label: "Repos on the bench" },
  ]

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-5 py-8 sm:px-6">
      {/* ── masthead ─────────────────────────────────────────────── */}
      <header>
        <div className="flex items-center gap-2.5">
          <span aria-hidden className="h-3 w-4 shrink-0 bca-hatch" />
          <span className="bca-label text-muted-foreground">Founder&apos;s Note</span>
        </div>
        <h2 className="mt-4 text-[26px] font-medium leading-[1.15] tracking-[-0.04em] text-balance sm:text-[34px]">
          I build in the trench, not the tower.
        </h2>
        <p className="mt-3 max-w-xl text-[13px] leading-relaxed text-muted-foreground text-pretty">
          Blue Collar Appz Co. is a working shop. Not a fund, not a newsletter about funds. What follows is why the
          catalog looks the way it does.
        </p>
      </header>

      {/* ── the note ─────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 border-t border-border pt-6 text-[13.5px] leading-relaxed text-muted-foreground">
        <p className="text-pretty">
          I did not come to software from a seminar. I came to it with a problem I could not pay anyone to solve, a
          laptop, and a stubborn streak. That is still roughly the operating model. Every app and agent in this shop
          started as something that annoyed me enough to fix, and the fixing taught me more than any framework ever did.
        </p>
        <p className="text-pretty">
          That is what I mean by the trench. The tower reasons from the top down — market maps, category creation, a
          five-year narrative. The trench reasons from the work up. You get your hands into a real problem, you find out
          which of your clever ideas survive contact, and you keep the ones that do. The tower produces opinions. The
          trench produces tools.
        </p>

        {/* signature element: the one place I spend boldness */}
        <blockquote className="my-2 border-l-2 border-accent pl-4 sm:pl-5">
          <p className="text-[17px] font-medium leading-snug tracking-[-0.03em] text-foreground text-balance sm:text-[20px]">
            Nobody in the trench asks what your thesis is. They ask whether the thing works.
          </p>
        </blockquote>

        <p className="text-pretty">
          So the catalog is wide on purpose. Agents that watch identity and cut off a machine principal the second it
          reaches somewhere it shouldn&apos;t. QA gates that run at machine speed because a human reviewer is now the
          slowest part of the pipeline. Small utilities that do one dull thing perfectly and ask nothing of you. They do
          not share a market. They share a standard.
        </p>
        <p className="text-pretty">
          The standard is simple and it is the whole reason this dashboard exists: I do not trust output I cannot
          verify, and I do not trust my own memory of what I read last month. So the shop watches the three sources
          worth watching, keeps exactly four weeks, cuts the duplicates, and vaults the rest. Four weeks is long enough
          to see a pattern and short enough that I have to actually decide something.
        </p>
        <p className="text-pretty">
          I am not trying to build one enormous company. I am trying to run a shop that is still standing in ten years,
          with tools I am not embarrassed by and a channel nobody can revoke. That is the entire philosophy. The rest is
          just hours.
        </p>
      </div>

      {/* ── tenets ───────────────────────────────────────────────── */}
      <Panel className="p-0">
        <ul className="flex flex-col">
          {TENETS.map((t, i) => (
            <li
              key={t.key}
              className={
                i === 0 ? "px-4 py-4 sm:px-5" : "border-t border-border px-4 py-4 sm:px-5"
              }
            >
              <div className="flex flex-col gap-1.5 sm:flex-row sm:gap-4">
                <span className="bca-label shrink-0 pt-0.5 text-accent sm:w-16">{t.key}</span>
                <div className="min-w-0">
                  <p className="text-[13.5px] font-medium leading-snug tracking-[-0.02em] text-foreground text-pretty">
                    {t.title}
                  </p>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground text-pretty">{t.body}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Panel>

      {/* ── what's actually in the shop ───────────────────────────── */}
      <section className="border-t border-border pt-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-[15px] font-medium tracking-[-0.03em]">What&apos;s on the floor</h3>
          <Chip tone="outline">Live count</Chip>
        </div>
        <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-5">
          {ledger.map((l) => (
            <div key={l.label} className="min-w-[7rem]">
              <dt className="bca-label text-muted-foreground">{l.label}</dt>
              <dd className="mt-1 font-mono text-[22px] font-medium tabular-nums tracking-tight text-foreground">
                {l.value}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-[12.5px] leading-relaxed text-muted-foreground text-pretty">
          Counted from the inventory and the live four-week window, not from a pitch deck. When the number moves, it
          moved because something shipped or something rolled out.
        </p>
      </section>

      {/* ── signature ────────────────────────────────────────────── */}
      <footer className="flex items-center gap-3 border-t border-border pt-5">
        <span aria-hidden className="h-4 w-5 shrink-0 bca-hatch" />
        <div className="min-w-0">
          <p className="text-[13px] font-medium tracking-[-0.02em] text-foreground">Blue Collar Appz Co.</p>
          <a
            href="https://bcappz.com"
            target="_blank"
            rel="noreferrer"
            className="bca-label text-muted-foreground hover:text-accent"
          >
            bcappz.com
          </a>
        </div>
      </footer>
    </div>
  )
}
