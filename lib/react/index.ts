import { REACT_ELEMENT_TYPE } from "@/shared/symbols"

/**
 *
 * @param type div之类的
 * @param config 主要是props
 * @param children
 */
export function createElement(type: string, config: any, children: any) {
  let propName: string

  const props: any = {}

  let key = null
  let ref = null
  // self 和 source 主要是用于dev环境调试用
  // let self = null
  // let source = null

  if (config !== null) {
    // TODO: 处理 key 和 ref
    // if (hasValidRef(config)) {
    //   ref = config.ref;

    //   if (__DEV__) {
    //     warnIfStringRefCannotBeAutoConverted(config);
    //   }
    // }
    // if (hasValidKey(config)) {
    //   key = '' + config.key;
    // }

    // TODO：处理 key 和 self
    for (propName in config) {
      if (Object.prototype.hasOwnProperty.call(config, propName)) {
        props[propName] = config[propName]
      }
    }
  }

  // Children can be more than one argument, and those are transferred onto
  // the newly allocated props object.
  const childrenLength = arguments.length - 2
  if (childrenLength === 1) {
    props.children = children
  } else if (childrenLength > 1) {
    const childArray = Array(childrenLength)
    for (let i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2]
    }

    props.children = childArray
  }

  // TODO 处理 defaultProps

  return {
    $$typeof: REACT_ELEMENT_TYPE,
    type,
    key,
    ref,
    props,
    // _owner:  ReactCurrentOwner.current
  }
}

export default {
  createElement,
}
