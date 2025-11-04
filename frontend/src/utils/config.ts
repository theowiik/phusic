// Config utility functions

// Deep update helper for nested config objects
export const updateNestedValue = <T extends object>(obj: T, path: string, value: unknown): T => {
  const newObj = { ...obj }
  const keys = path.split('.')
  let current: Record<string, unknown> = newObj as Record<string, unknown>

  for (let i = 0; i < keys.length - 1; i++) {
    if (Array.isArray(current[keys[i]])) {
      current[keys[i]] = [...(current[keys[i]] as unknown[])]
    } else {
      current[keys[i]] = { ...(current[keys[i]] as Record<string, unknown>) }
    }
    current = current[keys[i]] as Record<string, unknown>
  }

  current[keys[keys.length - 1]] = value
  return newObj
}

// Download a JSON file
export const downloadJSON = (data: unknown, filename: string): void => {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
