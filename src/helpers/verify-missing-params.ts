export const verifyMissingParams = (
  obj: any,
  requiredFields: string[]
): string[] => {
  const errors = []
  for (const field of requiredFields) {
    if (!obj[field]) {
      errors.push(field)
    }
  }
  return errors
}
