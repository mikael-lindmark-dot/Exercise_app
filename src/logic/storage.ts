// Keep the current tab usable if browser storage is blocked or full.
// The visible warning makes clear that these changes may not survive a reload.
let storageFailed = false

function reportStorageFailure() {
  storageFailed = true
  if (typeof window !== 'undefined') window.dispatchEvent(new Event('evolve-storage-error'))
}

export function hasStorageFailure() {
  return storageFailed
}

export function readStored(key: string) {
  try {
    return localStorage.getItem(key)
  } catch {
    reportStorageFailure()
    return null
  }
}

export function writeStored(key: string, value: string | null) {
  try {
    if (value === null) localStorage.removeItem(key)
    else localStorage.setItem(key, value)
    return true
  } catch {
    reportStorageFailure()
    return false
  }
}
