import { RootTag, WorkTag } from '@/constants'
import FiberRoot from './FiberRoot'

export default class FiberNode {
  key: null | string
  tag: WorkTag

  stateNode?: FiberRoot

  // Fiber

  pendingProps: any

  constructor(tag: WorkTag, pendingProps: any, key: null | string) {
    this.tag = tag
    this.key = key
    this.pendingProps = pendingProps
  }
}

export function createHostRootFiber(tag: RootTag) {
  return new FiberNode(WorkTag.HostRoot, null, null)
}