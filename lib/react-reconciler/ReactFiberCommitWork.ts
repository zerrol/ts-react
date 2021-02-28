import { appendChildToContainer } from "@/react-dom/ReactDOMHostConfig" 
import { FiberFlags, WorkTag } from "@/shared/constants" 
import FiberRoot from "./FiberRoot" 
import Fiber from "./ReactFiber" 

const {
  ContentReset,
  Placement
} = FiberFlags

const {
  HostComponent,
  HostRoot,
  HostText,
  HostPortal
} = WorkTag

export function commitPlacement(finishedWork: Fiber) {
  // 先找到原生的父元素
  // 这里一定需要是原生dom，用来在他下面插入这个节点
  const parentFiber = getHostParentFiber(finishedWork)

  let parent: FiberRoot | Element | undefined
  let isContainer: boolean
  const parentStateNode = parentFiber.stateNode

  switch (parentFiber.tag) {
    case HostComponent:
      parent = parentStateNode
      isContainer = false
      break 
    case HostRoot:
      if(!(parentStateNode instanceof FiberRoot)) {
        throw new Error('Invalid parent state node. It should be FiberRoot, This error is likely caused by a bug ')
      } 
      parent = parentStateNode?.containerInfo
      isContainer = true
      break
    // TODO: other case
    default:
      throw new Error('Invalid host parent fiber. This error is likely caused by a bug ')
  }

  // if (parentFiber.flags & FiberFlags.ContentReset) {
    // Reset the text content of the parent before doing any insertions
    // resetTextContent(parent) 
    // Clear ContentReset from the effect tag
    // parentFiber.flags &= ~ContentReset 
  // }

  // 找到他真正原生的兄弟，已经在父元素上面的dom元素
  // 因为如果父节点已经有子节点了
  // 那么插入finishedWork时需要调用的是 insertBefore，而不能直接appendChild 
  const before = getHostSibling(finishedWork)

  if(isContainer) {
    insertOrAppendPlacementNodeIntoContainer(finishedWork, before, parent)
  }
  // TODO else...

}

function getHostParentFiber(fiber: Fiber): Fiber {
  let parent = fiber.return 
  while (parent !== null) {
    if (isHostParent(parent)) {
      return parent 
    }
    parent = parent.return 
  }
  // invariant(
  //   false,
  //   'Expected to find a host parent. This error is likely caused by a bug ' +
  //     'in React. Please file an issue.',
  // ) 
  throw new Error('Expected to find a host parent. This error is likely caused by a bug ')
}

function insertOrAppendPlacementNodeIntoContainer(
  node: Fiber,
  before: any,
  parent: any,
)  {
  const {tag} = node 
  const isHost = tag === HostComponent || tag === HostText 
  if (isHost) {
    const stateNode = isHost ? node.stateNode : node.stateNode?.instance 
    // TODO 处理before
    // if (before) {
    //  insertInContainerBefore(parent, stateNode, before) 
    appendChildToContainer(parent, stateNode) 

  } else if (tag === HostPortal) {
    // If the insertion itself is a portal, then we don't want to traverse
    // down its children. Instead, we'll get insertions from each child in
    // the portal directly.
  } else {
    // 如果是非原生的fiber
    // 那么就需要遍历找到原生的类型的fiber做为before返回
    const child = node.child
    if (child !== null) {
      insertOrAppendPlacementNodeIntoContainer(child, before, parent) 
      let sibling = child.sibling 
      while (sibling !== null) {
        insertOrAppendPlacementNodeIntoContainer(sibling, before, parent) 
        sibling = sibling.sibling 
      }
    }
  }
}

function isHostParent(fiber: Fiber): boolean {
  return (
    fiber.tag === WorkTag.HostComponent ||
    fiber.tag === WorkTag.HostRoot 
    // || fiber.tag === WorkTag.HostPortal
  )
}

function getHostSibling(fiber: Fiber) {
  // We're going to search forward into the tree until we find a sibling host
  // node. Unfortunately, if multiple insertions are done in a row we have to
  // search past them. This leads to exponential search for the next sibling.
  // TODO: Find a more efficient way to do this.
  let node: Fiber = fiber 
  siblings: while (true) {
    // If we didn't find anything, let's try the next sibling.
    while (node.sibling === null) {
      if (node.return === null || isHostParent(node.return)) {
        // If we pop out of the root or hit the parent the fiber we are the
        // last sibling.
        return null 
      }
      node = node.return 
    }
    node.sibling.return = node.return 
    node = node.sibling 
    while (
      node.tag !== WorkTag.HostComponent &&
      node.tag !== WorkTag.HostText 
      // && node.tag !== DehydratedFragment
    ) {
      // If it is not host node and, we might have a host node inside it.
      // Try to search down until we find one.
      if (node.flags & Placement) {
        // If we don't have a child, try the siblings instead.
        continue siblings 
      }
      // If we don't have a child, try the siblings instead.
      // We also skip portals because they are not part of this host tree.
      if (node.child === null || node.tag === HostPortal) {
        continue siblings 
      } else {
        node.child.return = node 
        node = node.child 
      }
    }
    // Check if this host node is stable or about to be placed.
    if (!(node.flags & Placement)) {
      // Found it!
      return node.stateNode 
    }
  }
}