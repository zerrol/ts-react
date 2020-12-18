import { RootTag } from '@/constants'
import FiberNode, { createHostRootFiber } from './ReactFiber'

export default class FiberRoot {
  static create(containerInfo, tag: RootTag) {
    const uninitializedFiber = createHostRootFiber(tag);
    return new FiberRoot(containerInfo, tag, uninitializedFiber)
  }

  containerInfo: any

  tag: RootTag
  
  current: FiberNode

  constructor(containerInfo, tag: RootTag, current: FiberNode) {
    this.tag = tag
    this.current = current
    this.containerInfo = containerInfo
  }

}
