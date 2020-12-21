import { Update, UpdateQueue, UpdateTag } from "./interface";
import Fiber from "./ReactFiber";

export function initializeUpdateQueue<State>(fiber: Fiber) {
  const queue: UpdateQueue<State> = {
    // TODO: 暂时注释未用到变量
    // baseState: fiber.memoizedState,
    // firstBaseUpdate: null, 
    // lastBaseUpdate: null,
    shared: {
      pending: null
    },
    // effects: null
  }

  fiber.updateQueue = queue
}

export function createUpdate(
  // eventTime: number
  // lane
)  {
  const update: Update = {
    // eventTime,
    // lane, 
    tag: UpdateTag.UpdateState,
    payload: null,
    // callback
    next: null
  }

  return update
}

export function enqueueUpdate<State>(fiber: Fiber, update: Update<State>) {
  const updateQueue = fiber.updateQueue
  if(updateQueue === null) {
    // Only occurs if the fiber has been unmounted.
    // 只有fiber已经被卸载时会出现
    return
  }

  const sharedQueue = updateQueue.shared
  const pending = sharedQueue.pending
  if(pending === null) {
    // 改造一个环形队列
    update.next = update
  }else {
    // 将当前的update，放到环形队列的头部
    update.next = pending.next
    pending.next = update
  }
  sharedQueue.pending = update
}