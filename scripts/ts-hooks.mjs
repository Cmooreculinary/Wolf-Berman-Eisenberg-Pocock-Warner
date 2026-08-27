/**
 * Module-resolution hook: let plain Node import the app's TypeScript modules.
 *
 * Node 22 strips the types itself, but it will not guess an extension the way a
 * bundler does, so `import "./repos"` inside `lib/skills.ts` would fail. This
 * adds that one missing behaviour and nothing else — no transpiler, no build
 * step, no dependency between the generator and the app's toolchain.
 */
export async function resolve(specifier, context, next) {
  if (specifier.startsWith(".") && !/\.[cm]?[jt]sx?$/.test(specifier)) {
    try {
      return await next(`${specifier}.ts`, context)
    } catch {
      // Fall through: let Node report the original failure, not ours.
    }
  }
  return next(specifier, context)
}
