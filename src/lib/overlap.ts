import type { GerichtCard } from './gerichte'

/** Jaccard similarity between two sets of ingredient IDs */
function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 0
  let intersection = 0
  for (const id of a) {
    if (b.has(id)) intersection++
  }
  const union = a.size + b.size - intersection
  return union === 0 ? 0 : intersection / union
}

/** Count how many ingredients from the candidate are already in the selection */
export function countOverlapping(candidate: GerichtCard, selected: GerichtCard[]): number {
  if (selected.length === 0) return 0
  const selectedIds = new Set<string>()
  for (const g of selected) {
    for (const id of g.zutatIds) selectedIds.add(id)
  }
  let count = 0
  for (const id of candidate.zutatIds) {
    if (selectedIds.has(id)) count++
  }
  return count
}

/**
 * Score and sort candidates based on overlap with already-selected dishes.
 * alpha = 0 → maximize variety (low overlap first)
 * alpha = 1 → maximize savings (high overlap first)
 */
export function rankByOverlap(
  candidates: GerichtCard[],
  selected: GerichtCard[],
  alpha: number,
  anchorIds: Set<string> = new Set(),
): GerichtCard[] {
  if (selected.length === 0 && anchorIds.size === 0) {
    // No selection and no anchors — shuffle for discovery
    return [...candidates].sort(() => Math.random() - 0.5)
  }

  const allSelectedIds = new Set<string>(anchorIds)
  for (const g of selected) {
    for (const id of g.zutatIds) allSelectedIds.add(id)
  }

  const scored = candidates.map((c) => {
    const overlapScore = jaccard(c.zutatIds, allSelectedIds)
    // variety = inverse of overlap
    const finalScore = alpha * overlapScore + (1 - alpha) * (1 - overlapScore)
    return { gericht: c, score: finalScore }
  })

  scored.sort((a, b) => b.score - a.score)
  return scored.map((s) => s.gericht)
}
