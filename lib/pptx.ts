import { SLIDES } from "./data"

/* Blue Collar Appz Co. palette — sampled from bcappz.com */
const SHOP_FLOOR = "141414"
const HAZARD = "EE6620"
const CHALK = "F8F8F8"
const CHALK_SOFT = "A5A29F"
const FACE = "DM Sans"

export async function exportDeck() {
  const mod = await import("pptxgenjs")
  const PptxGenJS = (mod as unknown as { default: new () => any }).default ?? (mod as unknown as new () => any)
  const pptx = new PptxGenJS()

  pptx.layout = "LAYOUT_16x9"
  pptx.author = "Blue Collar Appz Co."
  pptx.company = "Blue Collar Appz Co. — bcappz.com"
  pptx.title = "Builders Sentinel — 2026 AI Venture Blueprint"

  for (const s of SLIDES) {
    const slide = pptx.addSlide()
    slide.background = { color: SHOP_FLOOR }

    // the four slanted bars of the BCA wordmark
    for (let i = 0; i < 4; i++) {
      slide.addShape("rect", {
        x: 0.6 + i * 0.13,
        y: 0.52,
        w: 0.055,
        h: 0.2,
        fill: { color: HAZARD },
        rotate: 15,
      })
    }

    slide.addText(s.kicker.toUpperCase(), {
      x: 0.6,
      y: 0.78,
      w: 8.5,
      h: 0.3,
      fontSize: 11,
      bold: true,
      charSpacing: 2,
      color: CHALK_SOFT,
      fontFace: FACE,
    })

    slide.addText(s.title, {
      x: 0.6,
      y: 1.15,
      w: 8.6,
      h: 1.1,
      fontSize: 34,
      bold: true,
      color: CHALK,
      fontFace: FACE,
    })

    slide.addText(s.body, {
      x: 0.6,
      y: 2.3,
      w: 8.4,
      h: 0.9,
      fontSize: 15,
      color: CHALK_SOFT,
      lineSpacingMultiple: 1.3,
      fontFace: FACE,
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
          color: CHALK,
          lineSpacingMultiple: 1.45,
          fontFace: FACE,
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
      color: CHALK_SOFT,
      fontFace: FACE,
    })

    slide.addText("Blue Collar Appz Co. · bcappz.com · Eisenberg, Peacock & Warner", {
      x: 0.6,
      y: 4.95,
      w: 5,
      h: 0.3,
      fontSize: 10,
      color: CHALK_SOFT,
      fontFace: FACE,
    })
  }

  await pptx.writeFile({ fileName: "Builders_Sentinel_Eisenberg_Peacock_Warner_2026.pptx" })
}
