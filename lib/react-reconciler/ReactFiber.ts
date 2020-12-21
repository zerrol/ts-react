import { RootTag, WorkTag } from '@/constants'
import FiberRoot from './FiberRoot'
import { UpdateQueue } from './interface'

export default class Fiber {

  static create(tag: WorkTag, pendingProps: any, key: null | string) {
    return new Fiber(tag, pendingProps, key)
  }

  key: null | string
  tag: WorkTag

  stateNode?: FiberRoot

  updateQueue: UpdateQueue<any> | null = null

  memoizedState: any | null = null

  // Fiber
  alternate: Fiber | null = null 
  pendingProps: any

  child: Fiber | null = null

  constructor(tag: WorkTag, pendingProps: any, key: null | string) {
    this.tag = tag
    this.key = key
    this.pendingProps = pendingProps
  }
}

/**
 * 以下为工厂方法
 */

/**
 * 创建HostRoot
 * @param tag 
 */
export function createHostRootFiber(tag: RootTag) {
  return new Fiber(WorkTag.HostRoot, null, null)
}

export function createWorkInProgress(current: Fiber, pendingProps: any) {
  let workInProgress = current.alternate
  if(!workInProgress)  {
    workInProgress = Fiber.create(current.tag, pendingProps, current.key)
    workInProgress.stateNode = current.stateNode

    // ... initailize other property

    workInProgress.alternate = current
    current.alternate = workInProgress
  }else {
    workInProgress.pendingProps = pendingProps
  }

  // ... initailize other property
  return workInProgress
}