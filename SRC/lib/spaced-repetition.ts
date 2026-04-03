import { storage } from './storage'

/**
 * SM-2 Spaced Repetition Algorithm
 * Quality ratings: 0-5
 *   5 - perfect response (mastered)
 *   4 - correct after hesitation
 *   3 - correct with difficulty (progress)
 *   2 - incorrect but remembered
 *   1 - incorrect (weak)
 *   0 - complete blackout
 */

export interface SpacedRepetitionEntry {
  pointId: number
  easeFactor: number     // >= 1.3
  interval: number       // days until next review
  repetitions: number    // consecutive correct answers
  nextReviewDate: string // ISO date
  lastReviewDate: string // ISO date
  reviewHistory: { date: string; quality: number }[]
}

function getStorageKey(userId: string): string {
  return `sr-data-${userId}`
}

export function getSpacedRepetitionData(userId: string): Record<number, SpacedRepetitionEntry> {
  return storage.get<Record<number, SpacedRepetitionEntry>>(getStorageKey(userId)) ?? {}
}

function saveSpacedRepetitionData(userId: string, data: Record<number, SpacedRepetitionEntry>) {
  storage.set(getStorageKey(userId), data)
}

function createDefaultEntry(pointId: number): SpacedRepetitionEntry {
  return {
    pointId,
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    nextReviewDate: new Date().toISOString(),
    lastReviewDate: new Date().toISOString(),
    reviewHistory: []
  }
}

/**
 * Core SM-2 calculation
 */
function sm2(entry: SpacedRepetitionEntry, quality: number): SpacedRepetitionEntry {
  const now = new Date()
  const historyEntry = { date: now.toISOString(), quality }
  const history = [...entry.reviewHistory.slice(-49), historyEntry]

  let { easeFactor, interval, repetitions } = entry

  if (quality >= 3) {
    // Correct response
    if (repetitions === 0) {
      interval = 1
    } else if (repetitions === 1) {
      interval = 6
    } else {
      interval = Math.round(interval * easeFactor)
    }
    repetitions += 1
  } else {
    // Incorrect: reset
    repetitions = 0
    interval = 1
  }

  // Update ease factor: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  if (easeFactor < 1.3) easeFactor = 1.3

  const nextReview = new Date(now)
  nextReview.setDate(nextReview.getDate() + interval)

  return {
    pointId: entry.pointId,
    easeFactor,
    interval,
    repetitions,
    nextReviewDate: nextReview.toISOString(),
    lastReviewDate: now.toISOString(),
    reviewHistory: history
  }
}

/**
 * Update a point's spaced repetition data after a review
 */
export function updateSpacedRepetition(
  userId: string,
  pointId: number,
  quality: number // 0-5
): SpacedRepetitionEntry {
  const allData = getSpacedRepetitionData(userId)
  const current = allData[pointId] ?? createDefaultEntry(pointId)
  const updated = sm2(current, quality)
  allData[pointId] = updated
  saveSpacedRepetitionData(userId, allData)
  return updated
}

/**
 * Check if a point is due for review
 */
export function isDueForReview(entry?: SpacedRepetitionEntry): boolean {
  if (!entry) return true // Never reviewed = due
  return new Date(entry.nextReviewDate) <= new Date()
}

/**
 * Get days until next review (negative = overdue)
 */
export function daysUntilReview(entry?: SpacedRepetitionEntry): number {
  if (!entry) return 0
  const now = new Date()
  const next = new Date(entry.nextReviewDate)
  const diff = next.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}
