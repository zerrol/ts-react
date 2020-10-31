
export function render(insertElement, rootNode: HTMLElement | null) {
  if(!rootNode) return
  rootNode.appendChild(insertElement)
}
