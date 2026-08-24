import { SLIDES } from "./data"

const SLATE = "1E2430"
const SLATE_SOFT = "5B6472"
const AMBER = "C8871F"
const PAPER = "F6F5F2"

export async function exportDeck() {
  const mod = await import("pptxgenjs")
  const PptxGenJS = (mod as unknown as { default: new () => any }).default ?? (mod as unknown as new () => any)
  const pptx = new PptxGenJS()

  pptx.layout = "LAYOUT_16x9"
  pptx.author = "Builders Sentinel"
  pptx.company = "Eisenberg, Peacock & Warner"
  pptx.title = "Builders Sentinel — 2026 AI Venture Blueprint"

  for (const s of SLIDES) {
    const slide = pptx.addSlide()
    slide.background = { color: PAPER }

    // amber rule
    slide.addShape("rect", { x: 0.6, y: 0.6, w: 0.9, h: 0.045, fill: { color: AMBER } })

    slide.addText(s.kicker.toUpperCase(), {
      x: 0.6,
      y: 0.78,
      w: 8.5,
      h: 0.3,
      fontSize: 11,
      bold: true,
      charSpacing: 2,
      color: SLATE_SOFT,
      fontFace: "Helvetica",
    })

    slide.addText(s.title, {
      x: 0.6,
      y: 1.15,
      w: 8.6,
      h: 1.1,
      fontSize: 34,
      bold: true,
      color: SLATE,
      fontFace: "Helvetica",
    })

    slide.addText(s.body, {
      x: 0.6,
      y: 2.3,
      w: 8.4,
      h: 0.9,
      fontSize: 15,
      color: SLATE_SOFT,
      lineSpacingMultiple: 1.3,
      fontFace: "Helvetica",
    })

    if (s.bullets.length) {
      slide.addText(
        s.bullets.map((b) => ({ text: b, options: { bullet: { characterCode: "2022" }, breakLine: true } })),
        {
          x: 0.75,
          y: 3.25,
          w: 8.2,
          h: 1.7,
          fontSize: 14,
          color: SLATE,
          lineSpacingMultiple: 1.45,
          fontFace: "Helvetica",
        },
      )
    }

    slide.addText(`${s.n} / ${SLIDES.length}`, {
      x: 8.3,
      y: 4.95,
      w: 1.1,
      h: 0.3,
      fontSize: 10,
      align: "right",
      color: SLATE_SOFT,
      fontFace: "Helvetica",
    })

    slide.addText("Builders Sentinel · Eisenberg, Peacock & Warner", {
      x: 0.6,
      y: 4.95,
      w: 5,
      h: 0.3,
      fontSize: 10,
      color: SLATE_SOFT,
      fontFace: "Helvetica",
    })
  }

  await pptx.writeFile({ fileName: "Builders_Sentinel_Eisenberg_Peacock_Warner_2026.pptx" })
}
