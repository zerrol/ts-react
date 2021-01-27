import Fiber from "@/react-reconciler/ReactFiber"
import { createElement, Instance } from "./ReactDOMComponent"

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