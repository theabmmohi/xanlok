export const down = () => {
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur()
  }
}

export const time = (stamp) => {
  return stamp
}

export const ago = (stamp) => {
  return stamp
}
