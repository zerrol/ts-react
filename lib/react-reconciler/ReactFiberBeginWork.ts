import { FiberFlags, WorkTag } from "@/shared/constants";
import { reconcileChildFibers } from "./ReactChildFiber";
import Fiber from "./ReactFiber";
import { processUpdateQueue } from "./ReactUpdateQueue";

export function beginWork(
  current: Fiber | null, 
  workInProgress: Fiber,
  // lanes
) {
  // TODO: ...code deal with lanes

  // 初次render时，root的current已经存在为rootFiber
  // 其他在初次render时，为null
  if(current !== null) {
    // TODO: 处理 props，判断是否可复用Fiber
  }

  switch(workInProgress.tag) {
    case WorkTag.HostRoot:
      return updateHostRoot(current, workInProgress)
    case WorkTag.HostComponent:
      return updateHostComponent(current, workInProgress)  
  }

}

/**
 * 下面只要是根据WorkTag对应类型做更新
 */

/**
 * 更新HostRoot, 主要是reactDom.render(el,root)中的第二个参数root
 * @param current 已经存在的fiber
 * @param workInProgress 当前正在渲染的fiber
 */
function updateHostRoot(
  current: Fiber | null,
  workInProgress: Fiber,
  // lanes
) {
  // TODO: ...deal with context

  // TODO: ...updateQueue & state & props
  processUpdateQueue(workInProgress)

  const nextChildren = workInProgress.memoizedState.element
  // TODO prevState VS curState

  reconcileChildren(current, workInProgress, nextChildren)
  return workInProgress.child
}

/**
 * 更新HostComponent，主要是指原生的标签例如，div\span等
 * @param current 
 * @param workInProgress 
 */
function updateHostComponent(
  current: Fiber | null, 
  workInProgress: Fiber, 
  // lanes
) {

  const nextProps = workInProgress.pendingProps
  const type = workInProgress.type

  // 注意：这里获取nextChildren的方式和之前写过的updateHostRoot的处理方式不同
  let nextChildren = nextProps.children
  const prevProps = current !== null ? current.memoizedState : null

  const isDirectTextChild = shouldSetTextContent(type, nextProps)
  if(isDirectTextChild) {
    nextChildren = null
  }else if(prevProps !== null && shouldSetTextContent(type, prevProps)) {
    workInProgress.flags |= FiberFlags.ContentReset
  }
  
  // TODO：markRef
  reconcileChildren(current, workInProgress, nextChildren)
  return workInProgress.child
}


/**
 * 下面是调和相关，开始处理Fiber
 */

export function reconcileChildren(
  current: Fiber | null,
  workInProgress: Fiber,
  nextChildren: any,
  // lanes
) {

  if(current === null) {
    // TODO: mount child fibers
    return
  }

  // 初次渲染时，root节点执行此处
  workInProgress.child = reconcileChildFibers(
    workInProgress, 
    current.child,
    nextChildren,
    // lanes
  ) 
}


function shouldSetTextContent(type: string | null, props: any ) {
  if(type === null) 
    return true

  return (
    type === 'textarea' ||
    type === 'option' ||
    type === 'noscript' ||
    typeof props.children === 'string' ||
    typeof props.children === 'number' ||
    (typeof props.dangerouslySetInnerHTML === 'object' &&
      props.dangerouslySetInnerHTML !== null &&
      props.dangerouslySetInnerHTML.__html != null)
  )
}
