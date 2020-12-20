import FiberRoot from "./FiberRoot";
import FiberNode from "./ReactFiber";

export function scheduleUpdateOnFiber(fiber: FiberNode) {

  // TODO ... losts of code detail with lane

  const root = fiber.stateNode

  if(!root) throw new Error("can't schedule update on unmount root")

  // TODO: schedulePendingInteractions 
  performSyncWorkOnRoot(root)
}

function performSyncWorkOnRoot(root: FiberRoot) {
  // TODO:处理 lane 

  // 递归进行子元素的渲染工作，主要分为两个阶段
  // begin阶段，完成Fiber的创建和Diff算法匹配，并完成标志dom即将进行的操作的tag的赋值
  // complete阶段，将Fiber生成到实体dom树上
  const exitStatus =  renderRootSync(root)

  // TODO: 根据exitStatus处理异常信息
 
  const finishedWork = root.current.alternate
  root.finishedWork = finishedWork

  // commit
  // commitRoot(root)

  // ensureRootIsScheduled()
  return null
}

function renderRootSync(root: FiberRoot) {
  
}

