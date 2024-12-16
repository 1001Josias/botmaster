export function convertSnakeToPascalCase(str: string): string {
  return str
    .split('_')
    .map((word) => firstLetterToUpperCase(word))
    .join('')
}
