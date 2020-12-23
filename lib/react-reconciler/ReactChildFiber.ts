import { FiberFlags } from "@/shared/constants"
import { ReactElement } from "@/shared/interface"
import { REACT_ELEMENT_TYPE } from "@/shared/symbols"
import Fiber, { createFiberFromElement } from "./ReactFiber"

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

    return null
  }

  return reconcileChildFibers
}

