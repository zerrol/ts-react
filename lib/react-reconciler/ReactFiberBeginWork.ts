import { FiberFlags, WorkTag } from "@/shared/constants";
import { IComponent } from "@/shared/interface";
import { mountChildFibers, reconcileChildFibers } from "./ReactChildFiber";
import Fiber from "./ReactFiber";
import { renderWithHooks } from "./ReactFiberHooks";
import { processUpdateQueue } from "./ReactUpdateQueue";

const {
  HostRoot,
  HostComponent,
  FunctionComponent,
  IndeterminateComponent,
  HostText
} = WorkTag

export function beginWork(
  current: Fiber | null,
  workInProgress: Fiber,
  // lanes
) {
  // TODO: ...code deal with lanes

  // 初次render时，root的current已经存在为rootFiber
  // 其他在初次render时，为null
  if (current !== null) {
    // TODO: 处理 props，判断是否可复用Fiber
  }

  switch (workInProgress.tag) {
    // 如果是函数式组件，在初次render时，tag会初始化为 IndeterminateComponent
    case IndeterminateComponent:
      return mountIndeterminateComponent(current, workInProgress, workInProgress.type as IComponent)
    case HostRoot:
      return updateHostRoot(current, workInProgress)
    case HostComponent:
      return updateHostComponent(current, workInProgress)
    case FunctionComponent: {
      const Component = workInProgress.type as IComponent
      const unresolvedProps = workInProgress.pendingProps
      // 这个elementType预计也是为了update
      // TODO: const resovledProps = workInProgress.elementType === Component
      const resolvedProps = unresolvedProps

      return updateFunctionComponent(
        current, workInProgress, Component, resolvedProps
      )
    }
    case HostText:
      return null
  }

  console.warn('beginWork need other case implements')
}



/**
 * 下面只要是根据WorkTag对应类型做更新
 */

function mountIndeterminateComponent(
  _current: Fiber | null,
  workInProgress: Fiber,
  Component: IComponent,
  // lanes
) {
  // TODO 更新阶段处理
  if(_current !== null) {
    console.warn(' mount indeterminate current is not null')
  }

  const props = workInProgress.pendingProps

  // TODO conetxt
  // TODO renderWithHooks
 const value = renderWithHooks( null, workInProgress, Component, props)

  workInProgress.flags |= FiberFlags.PerformedWork

  // TODO 判斷是ClassComponent的情況
  // if(typeof value === 'object')...

  // FunctionComponent的情况o
  workInProgress.tag = FunctionComponent
  reconcileChildren(null, workInProgress, value)
  return workInProgress.child
}


function updateFunctionComponent(
  current: Fiber | null,
  workInProgress: Fiber,
  Component: IComponent,
  nextProps: any,
  // renderLanes: Lanse
) {

  let nextChildren = renderWithHooks(
    current,
    workInProgress,
    Component,
    nextProps,
    // conext
    // lanes
  )

  // TODO：update时复用fiber
  // if(current !== null && !didReceiveUpdate)

  workInProgress.flags |= FiberFlags.PerformedWork
  reconcileChildren(
    current,
    workInProgress,
    nextChildren,
    // renderLanes
  )
  return workInProgress.child
}

/**
 * 更新HostRoot, 主要是reactDom.render(el,root)中的第二个参数root
 * @param current 已经存在的fiber
 * @param workInProgress 当前正在渲染的fiber
 */
function updateHostRoot(
  current: Fiber | null,
  workInProgress: Fiber,
  // lanes
) {
  // TODO: ...deal with context

  // TODO: ...updateQueue & state & props
  processUpdateQueue(workInProgress)

  const nextChildren = workInProgress.memoizedState.element
  // TODO prevState VS curState

  reconcileChildren(current, workInProgress, nextChildren)
  return workInProgress.child
}

/**
 * 更新HostComponent，主要是指原生的标签例如，div\span等
 * @param current 
 * @param workInProgress 
 */
function updateHostComponent(
  current: Fiber | null,
  workInProgress: Fiber,
  // lanes
) {

  const nextProps = workInProgress.pendingProps
  const type = workInProgress.type as string

  // 注意：这里获取nextChildren的方式和之前写过的updateHostRoot的处理方式不同
  let nextChildren = nextProps.children
  const prevProps = current !== null ? current.memoizedState : null

  const isDirectTextChild = shouldSetTextContent(type, nextProps)
  if (isDirectTextChild) {
    nextChildren = null
  } else if (prevProps !== null && shouldSetTextContent(type, prevProps)) {
    workInProgress.flags |= FiberFlags.ContentReset
  }

  // TODO：markRef
  reconcileChildren(current, workInProgress, nextChildren)
  return workInProgress.child
}


/**
 * 下面是调和相关，开始处理Fiber
 */

export function reconcileChildren(
  current: Fiber | null,
  workInProgress: Fiber,
  nextChildren: any,
  // lanes
) {

  if (current === null) {
    // TODO: mount child fibers
    workInProgress.child = mountChildFibers(
      workInProgress,
      null,
      nextChildren,
      // renderLanes
    )
  } else {

    // 初次渲染时，root节点执行此处
    workInProgress.child = reconcileChildFibers(
      workInProgress,
      current.child,
      nextChildren,
      // lanes
    )
  }

}


function shouldSetTextContent(type: string | null, props: any) {
  if (type === null)
    return true

  return (
    type === 'textarea' ||
    type === 'option' ||
    type === 'noscript' ||
    typeof props.children === 'string' ||
    typeof props.children === 'number' ||
    (typeof props.dangerouslySetInnerHTML === 'object' &&
      props.dangerouslySetInnerHTML !== null &&
      props.dangerouslySetInnerHTML.__html != null)
  )
}
