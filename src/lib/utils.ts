export const applyChanges = <T extends object>(
  current: T,
  appliedChanges: Partial<T>,
): T => {
  const changes = Object.fromEntries(
    Object.entries(appliedChanges).filter(([_, value]) => value !== undefined),
  ) as Partial<T>

  return { ...current, ...changes }
}
