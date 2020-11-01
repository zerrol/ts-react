import react from '../react/index'

export function render(insertElement, rootNode: HTMLElement | null) {

  if(!rootNode) return
  
  let element = insertElement
  if(typeof insertElement === 'function') {
    const component = new insertElement()
    element = component.render()
  }

  console.log('insert element', element)
  rootNode.appendChild(element)
}
