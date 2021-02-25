import { appendChildToContainer } from "@/react-dom/ReactDOMHostConfig";
import { FiberFlags, WorkTag } from "@/shared/constants";
import FiberRoot from "./FiberRoot";
import Fiber from "./ReactFiber";

const {
  ContentReset
} = FiberFlags

export function commitPlacement(finishedWork: Fiber) {
  const parentFiber = getHostParentFiber(finishedWork)
  let parent: FiberRoot | Element | undefined
  let isContainer: boolean
  const parentStateNode = parentFiber.stateNode
  switch (parentFiber.tag) {
    case WorkTag.HostComponent:
      parent = parentStateNode
      isContainer = false
      break;
    case WorkTag.HostRoot:
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
    // resetTextContent(parent);
    // Clear ContentReset from the effect tag
    // parentFiber.flags &= ~ContentReset;
  // }

  if(isContainer && parent instanceof Element && finishedWork.stateNode instanceof Element) {
    appendChildToContainer(parent, finishedWork.stateNode)
  }
  // TODO else...

}

function getHostParentFiber(fiber: Fiber): Fiber {
  let parent = fiber.return;
  while (parent !== null) {
    if (isHostParent(parent)) {
      return parent;
    }
    parent = parent.return;
  }
  // invariant(
  //   false,
  //   'Expected to find a host parent. This error is likely caused by a bug ' +
  //     'in React. Please file an issue.',
  // );
  throw new Error('Expected to find a host parent. This error is likely caused by a bug ')
}


function isHostParent(fiber: Fiber): boolean {
  return (
    fiber.tag === WorkTag.HostComponent ||
    fiber.tag === WorkTag.HostRoot 
    // || fiber.tag === WorkTag.HostPortal
  )
}