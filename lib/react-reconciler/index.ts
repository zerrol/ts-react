import { ReactNodeList } from "@/interface";
import FiberRoot from "./FiberRoot";
import { scheduleUpdateOnFiber } from "./ReactFiberWorkLoop";
import { createUpdate, enqueueUpdate } from "./ReactUpdateQueue";

/**
 * 更新容器
 * @param element children
 * @param container 容器
 * @param parentComponent 父组件，在首次render时为null
 */
export function updateContainer(element: ReactNodeList, container:FiberRoot, parentComponent: null) {
  // TODO: request eventTime 

  // TODO: request lane

  // TODO: update
  const current = container.current
  const update = createUpdate()

  // 注意：重点
  // 这里会开始将element，也是就是说所以要渲染到根节点上的元素都暂存到update.payload这个字段上
  // 一直到workLoop的beginWork阶段，调用updateHostRoot方法，
  // 才会通过element，生成memoizedState，进而生成children的fiber
  update.payload = { element }

  enqueueUpdate(current, update)
  scheduleUpdateOnFiber(container.current)
}