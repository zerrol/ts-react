import { WorkTag } from "@/constants";
import { reconcileChildFibers } from "./ReactChildFiber";
import Fiber from "./ReactFiber";


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
  }

}

function updateHostRoot(
  current: Fiber | null,
  workInProgress: Fiber,
  // lanes
) {
  // TODO: ...deal with context

  // TODO: ...updateQueue & state & props

  // TODO: nextChildren = workInProgress.memoizedState.element

  reconcileChildren(current, workInProgress)
  return  workInProgress.child
}


/**
 * 下面是调和相关，开始处理Fiber
 */

export function reconcileChildren(
  current: Fiber | null,
  workInProgress: Fiber,
  // nextChildren: any,
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
    // nextChildren,
    // lanes
  ) 
}
