export const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ")
}

export function camelCaseToWords(input: string): string {
  return input.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase()
}
