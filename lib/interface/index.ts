
// react element类型
export interface React$Element<T = any> {
  
}

export type ReactText = string | number

export type ReactNode = ReactText | React$Element<any>

export type ReactEmpty = null | void | boolean

export type ReactNodeList =  ReactEmpty | ReactNode;

export * from './ReactInternalTypes'