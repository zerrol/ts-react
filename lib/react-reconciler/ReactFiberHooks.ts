import Fiber from "./ReactFiber";

export function renderWithHooks<Props, SecondArg>(
  current: Fiber | null,
  workInProgress: Fiber,
  Component: (p: Props) => any,
  // Component: (p: Props, arg: SecondArg) => any,
  props: Props,
  // secondArg: SecondArg, TODO: secondArg先不处理
  // lanes
) {
  // 用来保存hooks中的需要缓存的state
  workInProgress.memoizedState = null
  workInProgress.updateQueue = null
  // workInProgress.lanes = NoLanes

  // TODO ReactCurrentDispatcher
  let children = Component(props)

  // We can assume the previous dispatcher is always this one, since we set it
  // at the beginning of the render phase and there's no re-entrancy.
  // ReactCurrentDispatcher.current = ContextOnlyDispatcher;

  return children
}
