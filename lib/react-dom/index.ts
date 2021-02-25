

import { RootTag } from '@/shared/constants'
import { ReactElement, ReactNodeList } from '@/shared/interface'
import { updateContainer } from '@/react-reconciler'
import ReactDOMRoot from './ReactDOMRoot'

export type Container = HTMLElement & {
  _reactRootContainer?: ReactDOMRoot
}

/**
 * 渲染
 * @param element 渲染到容器上的元素
 * @param container 容器，render时为html节点
 * @param callback 完成渲染的回调，暂时先忽略
 */
export function render(element: ReactElement, container: HTMLElement | null, callback?: Function) {
  if(!container) 
    throw new Error('can not render on invalid dom node')

  return legacyRenderSubtreeIntoContainer(null, element, container)
}

/**
 * 渲染子树到容器中
 * @param parentComponent 暂时忽略
 * @param children 子元素
 * @param container 容器
 */
function legacyRenderSubtreeIntoContainer(parentComponent: null, children: ReactNodeList , container: Container) {
  let root = container._reactRootContainer = new ReactDOMRoot(container, RootTag.BlockingRoot)
  let fiberRoot = root._internalRoot

  // TODO 源码还会处理处理callback , 暂时忽略
  // 这里源码中会有一个unbatchedUpdates()，对context和callback做一些处理，因为首次渲染的时候，是非批量的，这里暂时先忽略
  updateContainer(children, fiberRoot, parentComponent)
}

