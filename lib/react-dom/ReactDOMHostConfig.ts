import Fiber from "@/react-reconciler/ReactFiber"
import { COMMENT_NODE } from "@/shared/constants/HTMLNodeType"
import { createElement, createTextNode, Instance } from "./ReactDOMComponent"

export function createInstance(
  type: string, 
  props: any, 
  // container
  // context
  internalInstanceHandle: Fiber
) {
  // TODO: namespace
  const domElement = createElement(type, props)
  
  // 记录一些临时信息，先忽略
  // TODO precacheFiberNode
  // TODO updateFiberProps
  return domElement
}

export function appendInitialChild(
  parentInstance: Instance,
  child: Instance | Text
) {
  parentInstance.appendChild(child)
}

export function appendChildToContainer(
  container: Element,  
  child: Instance | Text
) {
  let parentNode;
  if (container.nodeType === COMMENT_NODE) {
    parentNode = container.parentNode
    parentNode.insertBefore(child, container)
  } else {
    parentNode = container
    parentNode.appendChild(child)
  }

  // TODO... reactRootContainer
}


export function createTextInstance(text: string) {
  const textNode = createTextNode(text)
  // TODO: precacheFiberNode(internalInstanceHandle, textNode);
  return textNode 
}