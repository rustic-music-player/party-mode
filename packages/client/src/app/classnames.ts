export function classnames(...classes: (string | null | false)[]): string {
  return classes.filter(c => !!c).join(' ')
}
