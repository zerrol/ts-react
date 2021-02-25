import { debug } from "webpack"
import setTextContent from "./utils/setTextContent"

export type Instance = Element

export function createElement(type: string, props: Object) {
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
  props: any
  // rootContainerInstance: Container,
  // hostContext: HostContext,
) {
  setInitialProperties(domElement, type, props)
}

function setInitialProperties(domElement: Instance, type: string, props: any) {
  // TODO 处理一些自定义的事件
  setInitialDOMProperties(type, domElement, props)
}

function setInitialDOMProperties(
  tag: string,
  domElement: Instance,
  nextProps: Object,
  // isCustomComponentTag: boolean
) {
  // 设置DOM的原生属性
  for (const propKey in nextProps) {
    if (!nextProps.hasOwnProperty(propKey)) {
      continue
    }
    const nextProp = nextProps[propKey]
    
    // TODO: if(propKey === 'style') 
    if(propKey === 'children') {
      const canSetTextContent = tag !== 'textarea' || nextProp !== ''
      if(canSetTextContent) {
        setTextContent(domElement, nextProp)
      } else if (typeof nextProp === 'number') {
        setTextContent(domElement, '' + nextProp);
      }
    }

    // TODO: other props...
  }
}
