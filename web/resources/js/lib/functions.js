export const down = () => {
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur()
  }
}
