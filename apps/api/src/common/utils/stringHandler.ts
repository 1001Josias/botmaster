export function convertSnakeToPascalCase(str: string): string {
  return str
    .split('_')
    .map((word) => firstLetterToUpperCase(word))
    .join('')
}

export function firstLetterToUpperCase(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
