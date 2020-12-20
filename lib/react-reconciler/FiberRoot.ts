import { RootTag } from '@/constants'
import FiberNode, { createHostRootFiber } from './ReactFiber'

export default class FiberRoot {
  static create(containerInfo, tag: RootTag) {
    // 创建了一个tag为HostRoot的Fiber
    const uninitializedFiber = createHostRootFiber(tag);
    
    // 这里互相引用
    const root = new FiberRoot(containerInfo, tag, uninitializedFiber)
    uninitializedFiber.stateNode = root

    // TODO: 在创建FiberRoot的时候，初始化UpdateQunue
    return root
  }

  containerInfo: any

  tag: RootTag
  
  current: FiberNode
  
  // 已经结束的workInProgress的HostRoot, 准备被commit
  finishedWork?: FiberNode

  constructor(containerInfo, tag: RootTag, current: FiberNode) {
    this.tag = tag
    this.current = current
    this.containerInfo = containerInfo
  }

}
