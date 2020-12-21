import FiberRoot from "./FiberRoot"
import Fiber, { createWorkInProgress } from "./ReactFiber"
import { beginWork } from "./ReactFiberBeginWork"

let workInProgress: Fiber | null = null

export function scheduleUpdateOnFiber(
  fiber: Fiber
  // lane,
  // eventTime
) {
  // TODO ... losts of code detail with lane

  const root = fiber.stateNode

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

  // commit
  // commitRoot(root)

  // ensureRootIsScheduled()
  return null
}

function renderRootSync(root: FiberRoot) {
  // TODO 创建workInProgress
  root.finishedWork = null
  workInProgress = createWorkInProgress(root.current, null)

  while (workInProgress !== null) {
    // 总结来说, performUnitOfWork，就是分成两步，
    // 第一步 beginWork 开始工作阶段，会创建或者更新Fiber节点，已经标志Effect
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
  let next = beginWork(
    current, 
    unitOfWork
    // , lanes
  )

  // TODO: 处理memoizedProps
  if(!next) {
    // TODO: completeUnitOfWork(unitOfWork)
  }else {
    workInProgress = next
  }

  // ReactCurrentOwner.current = null
}
