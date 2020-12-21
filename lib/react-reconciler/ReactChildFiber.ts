import Fiber from "./ReactFiber"

export const reconcileChildFibers = ChildReconciler(true)
export const mountChildFibers = ChildReconciler(false)

/**
 * 子节点调和
 * @param shouldTrackSideEffects 是否需要跟踪副作用，一般如果是mount时不需要加入副作用，因为root节点会加上
 */
function ChildReconciler(shouldTrackSideEffects: boolean) {

  function reconcileChildFibers(
    returnFiber: Fiber,
    currentFirstChild: Fiber | null,
    // newChild: any,
    // lanes: 
  ) {
    return null
  }

  return reconcileChildFibers
}

