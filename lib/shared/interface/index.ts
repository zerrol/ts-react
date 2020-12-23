
// react element类型
export interface ReactElement<T = any> {
  $$typeof: any,
  type: any,
  key: any,
  ref: any,
  props: any,

  // ReactFiber
  _owner: any,

  // __DEV__
  // ...
}

export type ReactText = string | number

export type ReactNode = ReactText | ReactElement<any>

export type ReactEmpty = null | void | boolean

export type ReactNodeList =  ReactEmpty | ReactNode;

export * from './ReactInternalTypes'