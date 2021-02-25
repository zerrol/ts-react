import FiberRoot from "./FiberRoot"
import Fiber, { createWorkInProgress } from "./ReactFiber"
import { beginWork } from "./ReactFiberBeginWork"
import { FiberFlags } from "@/shared/constants"
import { completeWork } from "./ReactFiberCompleteWork"

let workInProgress: Fiber | null = null

export function scheduleUpdateOnFiber(
  fiber: Fiber
  // lane,
  // eventTime
) {
  // TODO ... losts of code detail with lane

  const root = fiber.stateNode as FiberRoot

  if (!root) throw new Error("can't schedule update on unmount root")

  // TODO: schedulePendingInteractions
  performSyncWorkOnRoot(root)
}

function performSyncWorkOnRoot(root: FiberRoot) {
  // TODO:处理 lane

  // 递归进行子元素的渲染工作，主要分为两个阶段
  // begin阶段，完成Fiber的创建和Diff算法匹配，并完成标志dom即将进行的操作的tag的赋值
  // complete阶段，将Fiber生成到实体dom树上
  const exitStatus = renderRootSync(root)

  // TODO: 根据exitStatus处理异常信息

  const finishedWork = root.current.alternate
  root.finishedWork = finishedWork

  // TODO: commitRoot(root)
  // commitRoot 会将生成好的dom节点更新到root节点上

  // ensureRootIsScheduled()
  return null
}

function renderRootSync(root: FiberRoot) {
  // TODO 创建workInProgress
  root.finishedWork = null
  workInProgress = createWorkInProgress(root.current, null)

  while (workInProgress !== null) {
    // 总结来说, performUnitOfWork，就是分成两步，
    // 第一步 beginWork 开始工作阶段，会创建或者更新Fiber节点，以及标志Effect
    // 第二步completeWork 将Fiber更新到实体DOM

    // 对于整个workLoop来说，其实就是在遍历Fiber树
    // beginWork 其实就是在对这颗树做前序遍历，即先对根节点做begin，然后是右节点，然后是右子节点的兄弟节点
    // completeWork 就是随着beginWork同时做后序遍历，即先对右子节点做complete，然后子节点的兄弟节点，最后是父节点
    performUnitOfWork(workInProgress)
  }
}

function performUnitOfWork(unitOfWork: Fiber) {
  // 如果是mount阶段，那么除了root之外的节点，这个值为空;
  // root的话这个值为 rootFiber，在renderRootSync的时候createWorkInProgress时进行的初始化
  // 如果是update阶段，current为上一次用过的fiber
  // 所以之后可以用current是否存在来判断是在mount还是update
  const current = unitOfWork.alternate

  // TODO: profilerTimer判断
  // 以current为根节点，对这颗子树进行初始化
  // 初始化的内容主要是生成（更新）子树每一个节点的fiber，并且标志effect
  let next = beginWork(
    current,
    unitOfWork
    // , lanes
  )

  // 处理memoizedProps
  // TODO memoizedProps的作用
  unitOfWork.memoizedProps = unitOfWork.pendingProps
  // 当next不存在时，也就是说当前这棵子树所有的节点对应的fiber都已经完成了初始化
  // 剩余的兄弟树会在completeUnitOfWork的时候重新回到递归中，进行beginWork初始化
  if (!next) {
    // TODO: completeUnitOfWork(unitOfWork)
    // 根据当前节点的类型，实现创建、更新真实 DOM （DOM 创建完成后存储在内存中并未挂载到 container)
    // 在beginWork的阶段，fiber中已经标志好了需要操作DOM相关的Effect
    completeUnitOfWork(unitOfWork)
  } else {
    workInProgress = next
  }

  // ReactCurrentOwner.current = null
}

function completeUnitOfWork(unitOfWork: Fiber) {
  // Attempt to(尝试) complete the current unit of work, then move to the next
  // sibling. If there are no more siblings, return to the parent fiber.

  let completedWork: Fiber | null = unitOfWork

  do {
    const current = completedWork.alternate
    const returnFiber = completedWork.return

    // 检查work已完成
    if ((completedWork.flags & FiberFlags.Incomplete) === FiberFlags.NoFlags) {
      // 这里返回的next大部分情况为null，真正指向兄弟节点的是下面
      let next = completeWork(current, completedWork)

      if (next !== null) {
        workInProgress = next
        return
      }

      // TODO resetChildLanes()

      if (
        returnFiber !== null &&
        // Do not append effects to parents if a sibling failed to complete
        (returnFiber.flags & FiberFlags.Incomplete) === FiberFlags.NoFlags
      ) {
        // TODO deal with effects ...
      }
    } else {
      // TODO: 因为something threw导致没有真正完成
      // This fiber did not complete because something threw. Pop values off
      // the stack without entering the complete phase. If this is a boundary,
      // capture values if possible.
    }

    // 将complete指向兄弟节点
    const siblingFiber = completedWork.sibling
    if (siblingFiber !== null) {
      // If there is more work to do in this returnFiber, do that next.
      workInProgress = siblingFiber
      return
    }

    // Otherwise,return to the parent
    completedWork = returnFiber
    workInProgress = completedWork
  } while (completedWork !== null)

  // We've reached(达成) the root.
  // if (workInProgressRootExitStatus === RootIncomplete) {
  //   workInProgressRootExitStatus = RootCompleted;
  // }
}