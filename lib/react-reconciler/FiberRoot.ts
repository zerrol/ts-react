import { RootTag } from '@/shared/constants'
import Fiber, { createHostRootFiber } from './ReactFiber'

export default class FiberRoot {
  static create(containerInfo, tag: RootTag) {
    // 创建了一个tag为HostRoot的Fiber
    const uninitializedFiber = createHostRootFiber(tag);
    
    // 这里互相引用
    const root = new FiberRoot(containerInfo, tag, uninitializedFiber)
    uninitializedFiber.stateNode = root

    // TODO: 在创建FiberRoot的时候，initializeUpdateQueue
    return root
  }

  containerInfo: any

  tag: RootTag
  
  current: Fiber
  
  // 已经结束的workInProgress的HostRoot, 准备被commit
  finishedWork: Fiber | null = null

  constructor(containerInfo, tag: RootTag, current: Fiber) {
    this.tag = tag
    this.current = current
    this.containerInfo = containerInfo
  }

}
