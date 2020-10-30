
class Component {

}

export function createElement(type: string | Component, attributes, ...children) {
  let element

  if(typeof type === 'string') {
    element = document.createElement(type)
  }

  console.log('type', type)
  console.log('config', attributes)
  console.log('children', children)

  for (const key in attributes) {
    if (!attributes.hasOwnProperty(key)) 
      continue
    const attr = attributes[key]

    // 处理style
    if(key === 'style') {
      for (const styleKey in attr) {
        if (attr.hasOwnProperty(styleKey)) {
          element.setAttribute(key, `${styleKey}: ${attr[styleKey]}`)
        }
      }

      continue
    }

    // 属性赋值
    element.setAttribute(key, attributes[key])
  }

  for (const child of children) {
    let childElement = child
    if(typeof child === 'string') {
      childElement = document.createTextNode(child)
    }
    element.appendChild(childElement) 
  }

  return element
}

export default {
  createElement
}