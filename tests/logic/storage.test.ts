import { afterEach, describe, expect, it, vi } from 'vitest'
import { readStored, writeStored, hasStorageFailure } from '../../src/logic/storage'

afterEach(() => vi.unstubAllGlobals())

describe('browser storage failure handling', () => {
  it('reports blocked storage reads without crashing setup', () => {
    vi.stubGlobal('localStorage', { getItem: () => { throw new Error('blocked') } })
    expect(readStored('evolve-profile')).toBeNull()
    expect(hasStorageFailure()).toBe(true)
  })

  it('reports quota failures without interrupting in-memory completion', () => {
    vi.stubGlobal('localStorage', { setItem: () => { throw new Error('quota') } })
    expect(writeStored('evolve-session-history', '[]')).toBe(false)
    expect(hasStorageFailure()).toBe(true)
  })
})
