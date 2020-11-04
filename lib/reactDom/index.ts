
export function render(insertElement, rootNode: HTMLElement | null) {
  if(!rootNode || !insertElement?.root) return
  
  rootNode.appendChild(insertElement.root)
}
