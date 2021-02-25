import { FiberFlags, WorkTag } from "@/shared/constants"
import { ReactElement } from "@/shared/interface"
import { REACT_ELEMENT_TYPE } from "@/shared/symbols"
import Fiber, { createFiberFromElement, createFiberFromText } from "./ReactFiber"

export const reconcileChildFibers = ChildReconciler(true)
export const mountChildFibers = ChildReconciler(false)

/**
 * 子节点调和
 * @param shouldTrackSideEffects 是否需要跟踪副作用，一般如果是mount时不需要加入副作用，因为root节点会加上
 */
function ChildReconciler(shouldTrackSideEffects: boolean) {
  function placeSingleChild(newFiber: Fiber) {
    // 需要标记副作用
    if(shouldTrackSideEffects && newFiber.alternate === null) {
      // 意为这个fiber需要被放置到Dom上
      newFiber.flags = FiberFlags.Placement
    }

    return newFiber
  }

  function reconcileSingleElement(
    returnFiber: Fiber,
    currentFirstChild: Fiber | null,
    element: ReactElement
  ) {
    // let child = currentFirstChild
    // child存在表示进行更新
    // while(child !== null) {
    // TODO: 对child进行更新
    // return null
    // }

    // TODO: 处理判断 Fragment
    const created = createFiberFromElement(element)
    // TODO: 处理ref
    created.return = returnFiber 
    return created
  }

  function reconcilerSingleTextNode (
    returnFiber: Fiber,
    currentFirstChild: Fiber | null,
    textContent: string,
    // lanes
  ) {
    if(currentFirstChild !== null && currentFirstChild.tag === WorkTag.HostText) {
      // TODO: 处理更新text的情况
      console.warn('HostText node already exists, there is not code for deal with')
      return currentFirstChild
    }

    // The existing first child is not a text node so we need to create one
    // and delete the existing ones.
    // TODO: deleteRemainingChildren

    const created = createFiberFromText(
      textContent 
      // returnFiber.mode, 
      // lanes
    )
    created.return = returnFiber
    return created
  }

  function reconcileChildFibers(
    returnFiber: Fiber,
    currentFirstChild: Fiber | null,
    newChild: ReactElement | any,
    // lanes: 
  ) {
    const isObject = typeof newChild === 'object' && newChild !== null

    // 如果是对象
    if(isObject) {
      switch(newChild.$$typeof) {
        case REACT_ELEMENT_TYPE: 
          return placeSingleChild(reconcileSingleElement(returnFiber, currentFirstChild, newChild))
        // ...other case
      }

    }

    // 一开始以为如果是text节点例如 <div>hello</div>
    // 会进入到这里，但是其实在上层updateHostComponent的时候
    // newChild不会传入"hello"，而是会传入null, 所以这里不会触发。
    // "hello"会在complete阶段从pendingProps中再去获取
    if(typeof newChild === 'string' || typeof newChild === 'number') {
      return placeSingleChild(
        reconcilerSingleTextNode(
          returnFiber,
          currentFirstChild,
          "" + newChild,
        )
      )
    }

    return null
  }

  return reconcileChildFibers
}

