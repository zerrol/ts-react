export type Instance = Element

export function createElement(
  type: string,
  props: Object,
) {
  // 源码还会判断一下环境，这里直接用document
  const ownerDocument = document

  // TODO deal with script
  // TODO typeof props.is
  const domElement = ownerDocument.createElement(type)
  // TODO deal with <select></select>
  return domElement
}

export function createTextNode(text: string) {
  // 源码还会判断一下环境，这里直接用document
  const ownerDocument = document

  return ownerDocument.createTextNode(text)
}

export function finalizeInitialChildren(
  domElement: Instance,
  type: string,
  props: any,
  // rootContainerInstance: Container,
  // hostContext: HostContext,
) {
   

}


function setInitialProperties(
  domElement: Instance,
  type: string,
  props: any
) {
  // TODO 一些自定义的事件

  setInitialDOMProperties()

}

function setInitialDOMProperties() {

}
