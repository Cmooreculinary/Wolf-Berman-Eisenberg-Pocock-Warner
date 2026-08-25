"use client"

import { INVENTORY } from "@/lib/data"
import { REVIEW_LOG, buildWindow } from "@/lib/repos"
import { Chip, Panel } from "@/components/kit"
import { DonateBox } from "@/components/support"

/* Written plain and first-person on purpose. No pitch voice. */

const RULES: { key: string; title: string; body: string }[] = [
  {
    key: "Three",
    title: "Three sources, not thirty.",
    body: "I tried following everything and it just made me feel behind. Three is what I can actually keep up with, and these three cover what I need. If something is worth knowing, it shows up in one of them.",
  },
  {
    key: "Four",
    title: "Four weeks, then it goes to the vault.",
    body: "A month is long enough to tell what mattered and short enough that I have to make up my mind about it. Older stuff is not deleted, it just moves out of the way.",
  },
  {
    key: "Cut",
    title: "If two of them said it, you read it once.",
    body: "They overlap a lot. Cutting the repeats is most of the work, and it is the reason this takes you a few minutes instead of a few hours.",
  },
  {
    key: "Plain",
    title: "No filler.",
    body: "I do not pad this out to make it look like more. If a week is light, it is light. You will never have to scroll past a wall of words to find the one thing you came for.",
  },
]

export function FoundersView() {
  const agents = INVENTORY.filter((i) => i.kind === "agent").length
  const skills = INVENTORY.filter((i) => i.kind === "skill").length
  const protocols = INVENTORY.filter((i) => i.kind === "protocol").length
  const win = buildWindow(REVIEW_LOG)

  const ledger: { value: string; label: string }[] = [
    { value: String(agents), label: "Agents tracked" },
    { value: String(skills), label: "Methods written up" },
    { value: String(protocols), label: "Protocols covered" },
    { value: String(win.active.length), label: "Repos in the window" },
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
          I am not a tech person. I built this anyway.
        </h2>
        <p className="mt-3 max-w-xl text-[13px] leading-relaxed text-muted-foreground text-pretty">
          Why this exists, how I keep it, and the one thing I need help with.
        </p>
      </header>

      {/* ── the note ─────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 border-t border-border pt-6 text-[13.5px] leading-relaxed text-muted-foreground">
        <p className="text-pretty">
          I do not have a background in tech. I came at this from the outside, trying to keep up, and mostly feeling
          like I was drowning in it. There is a lot out there. Most of it is somebody taking forty minutes to tell you
          one thing.
        </p>
        <p className="text-pretty">
          So I did the only thing I know how to do, which is narrow it down until it is manageable. I found three
          sources that are worth the time. Not thirty. Three. Between them they cover what I actually need to know, and
          I stopped feeling behind. That is the whole idea here — all three in one place, so you do not have to go
          hunting the way I did.
        </p>

        {/* the line I want people to leave with */}
        <blockquote className="my-2 border-l-2 border-accent pl-4 sm:pl-5">
          <p className="text-[17px] font-medium leading-snug tracking-[-0.03em] text-foreground text-balance sm:text-[20px]">
            I built the thing I wished somebody had handed me when I started.
          </p>
        </blockquote>

        <p className="text-pretty">
          Every Friday I add a new week. Four weeks stay up, the older ones move to the vault, and anything two sources
          both covered gets cut down to one so you are not reading it twice. That is the entire method. It is not
          clever. It just takes the time it takes, and I do it because I want the thing to exist.
        </p>
        <p className="text-pretty">
          I am not an expert and I am not going to pretend to be one. What I am is somebody who does the reading every
          week and writes down what held up. If that is useful to you, take it. It is free and it stays free.
        </p>
      </div>

      {/* ── the ask ──────────────────────────────────────────────── */}
      <Panel className="border-accent/35 p-5 sm:p-6">
        <div className="flex items-center gap-2.5">
          <Chip tone="accent">Asking for help</Chip>
        </div>

        <h3 className="mt-4 text-[19px] font-medium leading-snug tracking-[-0.03em] text-foreground text-balance sm:text-[22px]">
          This is free. Keeping it up is the part I cannot afford.
        </h3>

        <div className="mt-3 flex flex-col gap-3 text-[13px] leading-relaxed text-muted-foreground">
          <p className="text-pretty">
            Let me be straight with you, because I would rather say it plainly than dress it up. Putting this in front
            of people costs money. Every person who opens it costs me a little, and right now that comes out of my own
            pocket. There is no company behind this and no budget line. It is me. And there is a point where I run out
            and have to take it down, which I do not want to do.
          </p>
          <p className="text-pretty">
            So I am asking. If this saved you an hour, or told you something you would not have found on your own, put
            in whatever you think that was worth. Five dollars is real help. So is fifty. So is two.
          </p>
          <p className="text-pretty">
            Nothing gets locked behind this. There are no tiers, no members-only week, no paywall coming later. If you
            give nothing you get exactly the same thing as everyone else, and I mean that. I am not selling you access.
            I am asking for help keeping the lights on.
          </p>
        </div>

        <div className="mt-5 border-t border-border pt-5">
          <DonateBox />
        </div>

        <p className="mt-4 text-[12px] leading-relaxed text-muted-foreground text-pretty">
          What it pays for: hosting, the domain, and the tools I use to put the weekly update together. That is it.
          When it covers the bill, I will say so right here.
        </p>
      </Panel>

      {/* ── how I keep it ────────────────────────────────────────── */}
      <Panel className="p-0">
        <ul className="flex flex-col">
          {RULES.map((t, i) => (
            <li
              key={t.key}
              className={i === 0 ? "px-4 py-4 sm:px-5" : "border-t border-border px-4 py-4 sm:px-5"}
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

      {/* ── what's in here right now ──────────────────────────────── */}
      <section className="border-t border-border pt-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-[15px] font-medium tracking-[-0.03em]">What&apos;s in here right now</h3>
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
          These are counted straight off what is actually in here, not written by hand. When a number moves, it moved
          because the week moved.
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
