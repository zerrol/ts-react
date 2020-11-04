class ElementWrapper {
  root: HTMLElement

  constructor(type: string) {
    this.root = document.createElement(type)
  }
  
  appendChild(child: ElementWrapper | TextWrapper) {
    this.root.appendChild(child.root)
  }

  setAttribute(attributes: NamedNodeMap) {
    // 处理元素的属性
    for (const key in attributes) {
      if (!attributes.hasOwnProperty(key)) continue
      const attr = attributes[key]

      // 处理style
      if (key === "style") {
        for (const styleKey in attr) {
          if (attr.hasOwnProperty(styleKey)) {
            this.root.setAttribute(key, `${styleKey}: ${attr[styleKey]}`)
          }
        }

        continue
      }

      // 属性赋值
      // Attr
      this.root.setAttribute(key, attributes[key].value)
    }
  }
}

class TextWrapper {
  root: Text

  constructor(text: string) {
    this.root = document.createTextNode(text)
  }
}

export abstract class Component<P = any, S = any> {
  state?: S

  _root?: HTMLElement
  props: P
  children: any[]

  abstract render(): ElementWrapper | Component<P, S>

  constructor(props: P) {
    this.props = props || Object.create(null)
    this.children = []
  }

  setState(newState: S) {
    this.state = newState
  }

  setAttribute(key: string, value: string) {
    this.props[key] = value
  }

  appendChild(child) {
    // 在children push之前不能访问root
    // 如果访问root，会导致节点被生成，而此时children还不存在

    this.children.push(child)
    console.log('this.children', this.children)
  }

  get root(): HTMLElement {
    if(!this._root) {
      this._root = this.render().root
    }
    return this._root
  }
}

export function createElement(type: any, attributes: NamedNodeMap, ...children) {
  let element: Component | ElementWrapper

  if (typeof type === "string") {
    element = new ElementWrapper(type)
    element.setAttribute(attributes)
  }else {
    element = new type()
  }

  const insertChildren = (_children) => {
    for(let child of _children) {
      let childElement = child
      if (typeof child === "string") {
        childElement = new TextWrapper(child)
      }

      if(child instanceof Array) {
        insertChildren(child)
      }else {
        element.appendChild(childElement)
      }
    }
  }

  insertChildren(children)

  console.log('createElement return', element)
  return element
}

export default {
  createElement,
}
