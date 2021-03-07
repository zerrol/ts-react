import { Instance } from '@/react-dom/ReactDOMComponent'
import { FiberFlags, RootTag, WorkTag } from '@/shared/constants'
import { IComponent, ReactElement, ReactEmpty } from '@/shared/interface'
import FiberRoot from './FiberRoot'
import { UpdateQueue } from './interface'

export default class Fiber {

  static create(
    tag: WorkTag, 
    pendingProps: any, 
    key: null | string
  ) {
    return new Fiber(tag, pendingProps, key)
  }

  key: null | string

  // 标识Fiber类型的标签，是Function组件还是Class组件还是原生元素
  tag: WorkTag

  // 表示Fiber的类型，function/class/div/span等标签名
  type: string | IComponent | null = null

  stateNode?: FiberRoot | Instance

  updateQueue: UpdateQueue<any> | null = null

  memoizedState: any | null = null

  // Fiber
  alternate: Fiber | null = null 
  child: Fiber | null = null
  sibling: Fiber | null = null
  return: Fiber | null = null

  pendingProps: any
  memoizedProps: any

  // 副作用flag，用来标志fiber reconcile完成后，渲染到Dom上时应该做什么处理的标志
  flags: FiberFlags = FiberFlags.NoFlags

  // effects，自己子树中被标记了flags的节点组成的单向链表
  // 生成与complete阶段：complete()结束后
  // 作用是为了在commit阶段，可以直接通过遍历单链表完成递归，而不用再遍历树
  firstEffect: Fiber | null = null
  nextEffect: Fiber | null = null 
  lastEffect: Fiber | null = null

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
    workInProgress.type = current.type
    workInProgress.alternate = current
    current.alternate = workInProgress
  }else {
    workInProgress.pendingProps = pendingProps
    // Needed because Blocks store data on type.
    workInProgress.type = current.type;
    // We already have an alternate.
    // Reset the effect tag.
    workInProgress.flags = FiberFlags.NoFlags
  }

  workInProgress.child = current.child
  workInProgress.memoizedState = current.memoizedState
  workInProgress.memoizedProps = current.memoizedProps
  workInProgress.updateQueue = current.updateQueue

  workInProgress.sibling = current.sibling

  // ... initailize other property
  return workInProgress
}



function shouldConstruct(Component: Function) {
  const prototype = Component.prototype;
  return !!(prototype && prototype.isReactComponent);
}

export function createFiberFromElement(
  element: ReactElement
  // ...mode、lanes
) {
  let fiberTag = WorkTag.IndeterminateComponent
  if(typeof element.type === 'function') {
    // 这里如果是functionComponent 那么，type的值还是Indeterminate，表示暂未确定类型的组件
    // 会在后面的对于这个fiber的beginWork阶段，再去确定他的tag
    if(shouldConstruct(element.type)) {
      fiberTag = WorkTag.ClassComponent
    }
  }else if(typeof element.type === 'string') {
    fiberTag = WorkTag.HostComponent
  }

  const fiber = Fiber.create(fiberTag, element.props, element.key) 
  fiber.type = element.type

  return fiber
}

export function createFiberFromText(
  content: string,
  // mode: TypeOfMode,
  // lanes: Lanes,
): Fiber {
  const fiber = Fiber.create(WorkTag.HostText, content, null)
  // fiber.lanes = lanes;
  return fiber
}