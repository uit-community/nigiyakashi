export const PREFIX = 'NIGIYAKASHI_LOCAL_'

export function save(k: string, v: string) {
  localStorage.setItem(
    `${PREFIX}${k.toUpperCase()}`,
    v
  )
}

export function load(k: string) {
  return localStorage.getItem(
    `${PREFIX}${k.toUpperCase()}`
  )
}
