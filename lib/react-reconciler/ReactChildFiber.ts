import { FiberFlags, WorkTag } from "@/shared/constants"
import { ReactElement } from "@/shared/interface"
import { REACT_ELEMENT_TYPE } from "@/shared/symbols"
import Fiber, { createFiberFromElement, createFiberFromText, createWorkInProgress } from "./ReactFiber"

const { 
  Placement
} = FiberFlags

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
    const key = element.key
    let child = currentFirstChild
    // child存在表示进行更新
    // while(child !== null) {
    //   // TODO: 对child进行更新
    //   if(child.key === key) {
    //     if(child.elementType === element.type) {
    //       const existing = useFiber(child, element.props)
    //       existing.return = returnFiber
    //       return existing
    //     }
    //     break
    //   } else {
    //     console.warn('deleteChild 需要实现')
    //   }
    //   child = child.sibling
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

  function createChild(
    returnFiber: Fiber,
    newChild: ReactElement,
    // lanes
  ) {
    if (typeof newChild === 'string' || typeof newChild === 'number') {
      // Text nodes don't have keys. If the previous node is implicitly keyed
      // we can continue to replace it without aborting even if it is not a text
      // node.
      const created = createFiberFromText(
        '' + newChild,
        // returnFiber.mode,
        // lanes,
      )
      created.return = returnFiber
      return created
    }

    if(typeof newChild === 'object' && newChild !== null) {
      switch(newChild.$$typeof) {
        case REACT_ELEMENT_TYPE: {
          const created = createFiberFromElement(
            newChild,
            // returnFiber.mode,
            // lanes
          )

          created.return = returnFiber
          return created
        }
        default:
          console.warn('reconcile array need implement')
        // ...other case
      }
    }

    console.warn('reconcile array createChild need implement')
    return null
    // 子节点是fragment的情况
    // if (Array.isArray(newChild) || getIteratorFn(newChild)) {
    //   const created = createFiberFromFragment(
    //     newChild,
    //     returnFiber.mode,
    //     lanes,
    //     null,
    //   )
    //   created.return = returnFiber
    //   return created
    // }
  }

  
  function placeChild(
    newFiber: Fiber,
    // lastPlacedIndex: number,
    // newIndex: number,
  ) {
    // 初始化 newFiber.index
    // 作用暂时不考虑
    // newFiber.index = newIndex
    if(!shouldTrackSideEffects) {
      return  null
    }
   
    // TODO: update的情况，先不处理
    // This is an insertion.
    newFiber.flags = Placement
    return  null
  }

  function reconcileChildrenArray(
    returnFiber: Fiber,
    currentFirstChild: Fiber | null,
    newChildren: ReactElement[]
    // lanes
  ) {

    let resultingFirstChild: Fiber | null = null
    let previousNewFiber: Fiber | null = null

    let oldFiber = currentFirstChild
    let newIdx = 0
    // TODO update情况，先不处理

    if(oldFiber === null) {
      // 循环创建fiber
      for(; newIdx < newChildren.length; newIdx++) {
        let newFiber = createChild(returnFiber, newChildren[newIdx])
        if(newFiber === null) {
          continue
        }

        placeChild(newFiber)
        if (previousNewFiber === null) {
          // TODO: Move out of the loop. This only happens for the first run.
          resultingFirstChild = newFiber
        } else {
          previousNewFiber.sibling = newFiber
        }
        previousNewFiber = newFiber
      }

      return resultingFirstChild
    }

    console.warn('reconcileChildrenArray need implements')
    return null
  }

  function reconcileChildFibers(
    returnFiber: Fiber,
    currentFirstChild: Fiber | null,
    newChild: ReactElement | any,
    // lanes: 
  ) {
    const isObject = typeof newChild === 'object' && newChild !== null

    // 如果是对象
    // 只有newChild为一个节点时，例如<div>hello</div>，会走到下面
    // 如果有两个节点例如 <div> <span>1</span> <span>2</span> <div>
    // 则会走到 if(isArray)
    if(isObject) {
      switch(newChild.$$typeof) {
        case REACT_ELEMENT_TYPE: 
          return placeSingleChild(reconcileSingleElement(returnFiber, currentFirstChild, newChild))
        // ...other case
      }
    }

    if (Array.isArray(newChild)) {
      return reconcileChildrenArray(
        returnFiber,
        currentFirstChild,
        newChild,
        // lanes,
      )
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

