/**
 * Donation settings.
 *
 * ── TO TURN ON DONATIONS ────────────────────────────────────────────────
 * Set `provider` and paste your link into `url` below. That's the whole job.
 * Until `url` is filled in, the founder's page shows the note and the ask
 * but no button, so nothing on the live site is ever a dead link.
 *
 *   paypal        https://paypal.me/yourhandle
 *   stripe        your Stripe Payment Link
 *   kofi          https://ko-fi.com/yourhandle
 *   buymeacoffee  https://buymeacoffee.com/yourhandle
 *   github        https://github.com/sponsors/yourhandle
 *   custom        anything else that takes money
 * ────────────────────────────────────────────────────────────────────────
 */

export type SupportProvider =
  | "paypal"
  | "stripe"
  | "kofi"
  | "buymeacoffee"
  | "github"
  | "custom"

export const SUPPORT = {
  provider: "stripe" as SupportProvider,
  /**
   * Paste your Stripe Payment Link here to turn the button on, e.g.
   * "https://buy.stripe.com/xxxxxxxx".
   *
   * Create it in the Stripe Dashboard under Payment Links, and set the
   * price to "Customer chooses what to pay" so any amount is accepted.
   * Set a low minimum (or none) — small gifts are the point.
   */
  url: "",
  /** Suggested amounts. Any amount is accepted — these are only shortcuts. */
  presets: [5, 10, 25, 50],
  /** Which preset starts selected. */
  suggested: 10,
}

/**
 * Only PayPal.me reliably takes the amount in the link itself
 * (`paypal.me/handle/25`). Everyone else asks for it on their own page —
 * including Stripe, whose Payment Links carry a prefilled amount only when the
 * link was created as "customer chooses what to pay". So for those providers we
 * don't show amount buttons that quietly do nothing; the visitor picks the
 * amount at checkout instead.
 */
export const CARRIES_AMOUNT: Record<SupportProvider, boolean> = {
  paypal: true,
  stripe: false,
  kofi: false,
  buymeacoffee: false,
  github: false,
  custom: false,
}

/** Human name for the button, e.g. "Continue to Ko-fi". */
export const PROVIDER_LABEL: Record<SupportProvider, string> = {
  paypal: "PayPal",
  stripe: "Stripe",
  kofi: "Ko-fi",
  buymeacoffee: "Buy Me a Coffee",
  github: "GitHub Sponsors",
  custom: "checkout",
}

export function donationsEnabled(): boolean {
  return SUPPORT.url.trim().length > 0
}

/**
 * Build the outgoing link. Returns null when no URL is configured, which is the
 * signal to render the ask without a button.
 */
export function donateUrl(amount?: number | null): string | null {
  const base = SUPPORT.url.trim()
  if (!base) return null
  if (!CARRIES_AMOUNT[SUPPORT.provider]) return base

  const cents = Number(amount)
  if (!Number.isFinite(cents) || cents <= 0) return base

  // paypal.me/handle → paypal.me/handle/25
  const rounded = Math.round(cents * 100) / 100
  return `${base.replace(/\/+$/, "")}/${rounded}`
}
