import { RootTag, WorkTag } from '@/constants'
import FiberRoot from './FiberRoot'

export default class Fiber {

  static create(tag: WorkTag, pendingProps: any, key: null | string) {
    return new Fiber(tag, pendingProps, key)
  }

  key: null | string
  tag: WorkTag

  stateNode?: FiberRoot

  // Fiber
  alternate: Fiber | null = null 
  pendingProps: any

  constructor(tag: WorkTag, pendingProps: any, key: null | string) {
    this.tag = tag
    this.key = key
    this.pendingProps = pendingProps
  }
}

export function createHostRootFiber(tag: RootTag) {
  return new Fiber(WorkTag.HostRoot, null, null)
}


export function createWorkInProgress(current: Fiber, pendingProps: any) {
  let workInProgress = current.alternate
  if(!workInProgress)  {
    workInProgress = Fiber.create(current.tag, pendingProps, current.key)
    workInProgress.stateNode = current.stateNode

    // ... initailize other property
  }else {
    workInProgress.pendingProps = pendingProps
  }

  // ... initailize other property
  return workInProgress
}