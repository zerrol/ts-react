import {
  createTextNode,
  finalizeInitialChildren,
  Instance,
} from "@/react-dom/ReactDOMComponent"
import {
  appendInitialChild,
  createInstance,
  createTextInstance,
} from "@/react-dom/ReactDOMHostConfig"
import { FiberFlags, WorkTag } from "@/shared/constants"
import FiberRoot from "./FiberRoot"
import Fiber from "./ReactFiber"

const {
  IndeterminateComponent,
  FunctionComponent,
  HostRoot,
  HostComponent,
  ClassComponent,
  HostText,
} = WorkTag

export function completeWork(
  current: Fiber | null,
  workInProgress: Fiber
  // renderLanes: lanes
) {
  const newProps = workInProgress.pendingProps
  const type = workInProgress.type

  switch (workInProgress.tag) {
    // TODO: ...other tag
    case HostRoot: {
      // TODO: deal with context...
      updateHostContainer(workInProgress)
      return null
    }

    case HostComponent: {
      // TODO : getRootHostContainer
      // TODO: 这里会拿到一个rootContainerInstance，应该主要是用来做diff算法的，和判断document环境的，先忽略

      // TODO：更新时触发先忽略
      // if(current !== null && workInProgress.stateNode !== null) {
      //    updateHostComponent
      // }

      // TODO: Deal with context
      if (!type)
        throw new Error(
          "Complete Host Component Error, type should not be null"
        )
      const instance = createInstance(type, newProps, workInProgress)

      // 将所有的子节点，加入到instance上面
      appendAllChildren(instance, workInProgress)

      workInProgress.stateNode = instance

      // 完成初始化，主要是为element加上attribute
      // 这里会为element加上attribute
      finalizeInitialChildren(instance, type, newProps)
      // TODO: 处理markRef...
      return null
    }
    case HostText: {
      const newText = newProps
      if (current && workInProgress.stateNode !== null) {
        // TODO: 实现更新的情况
        console.warn("completeWork HostText tag need implement update phase")
      } else {
        if(typeof newText !== 'string') {
          throw new Error('completeWork HostText is not string, maybe it is a bug')
        }
        
        // TODO: 处理context

        workInProgress.stateNode = createTextInstance(
          newText,
          // rootContainerInstance,
          // currentHostContext,
          // workInProgress,
        )
      }
      return null
    }
  }

  console.warn(`completeWork need implement new workTag: ${workInProgress.tag}`)
  return null
}

/**
 * 将所有的（真实）子节点加入到parent上面
 * 加入是从子节点到根节点的，因此只需要将最近的子节点加入到parent上就完成了整棵树的插入
 * @param parent 父亲实例
 * @param workInProgress 当前工作的fiber
 */
function appendAllChildren(
  parent: Instance,
  workInProgress: Fiber
  // needsVisibilityToggle: boolean,
  // isHidden: boolean,
) {
  let node = workInProgress.child
  while (node !== null) {
    if (node.tag === HostComponent || node.tag === HostText) {
      appendInitialChild(parent, node.stateNode as Instance)
    }
    // TODO: else if (FundamentalComponent)
    // TODO: 跳过 HostPortal
    else if (node.child !== null) {
      // 如果不是HostComponent等类型，会跳到子节点
      // 因为FunctionComponent和ClassComponent不是真实元素
      node.child.return = node
      node = node.child
      return
    }

    // 结束遍历
    if (node === workInProgress) {
      return
    }

    // 跳转到兄弟节点
    while (node.sibling === null) {
      if (node.return === null || node.return === workInProgress) {
        return
      }
      node = node.return
    }
    node.sibling.return = node.return
    node = node.sibling
  }
}

function updateHostComponent(
  current: Fiber,
  workInProgress: Fiber,
  type: string,
  newProps: any
  // rootContainerInstance: Container,
) {
  // TODO: deal with context...
  const oldProps = current?.memoizedProps
  if (oldProps === newProps) {
    return
  }

  // 这里的instance应该是原生的element
  const instance = workInProgress.stateNode

  // ...code
}

function updateHostContainer(workInProgress: Fiber) {
  // 浏览器平台update里边没有代码
}

/**
 * 这个updateHostContainer应该是给其他native平台用的
 * @param workInProgress
 */
function updateHostContainer$1(workInProgress: Fiber) {
  const portalOrRoot = workInProgress.stateNode as FiberRoot
  // TODO: const childrenUnChanged = workInProgress.firstEffect
  // if(childrenUnChanged) return

  const container = portalOrRoot?.containerInfo
  // 在源码中，会区分native、浏览器dom等情况
  // 浏览器dom的话其实就是赋值一个空数组
  // const new ChildSet = createContainerChildSet(container)
  const newChildSet = []
  appendAllChildrenToContainer(newChildSet, workInProgress)

  portalOrRoot!.pendingChildren = newChildSet

  markUpdate(workInProgress)

  // 同上，源码中是会区分运行环境的，这里只针对浏览器
  // finalizeContainerChildren(container, newChildSet);
  container.pendingChildren = newChildSet
}

/**
 * 将workInProgress所有的子节点，都加入到ContainerChildSet中
 * 其他native平台所用
 * @param containerChildSet
 * @param workInProgress
 */
function appendAllChildrenToContainer(
  containerChildSet: any[],
  workInProgress: Fiber
  // TODO 暂时用不着
  // needVisibilityToggle: boolean,
  // isHidden: boolean
) {
  let node = workInProgress.child
  // 递归将node都加入到childSet中
  while (node !== null) {
    // TODO 其他tag类型先不处理
    if (node.tag === WorkTag.HostComponent) {
      let instance = node.stateNode
      containerChildSet.push(instance)
    }
    // TODO: FundamentalComponent, HostText, HostPortal, SuspenseComponent
    else if (node.child !== null) {
      node.child.return = node
      // 继续遍历
      node = node.child
      continue
    }

    if (node === workInProgress) {
      return
    }

    // 找到最近的一个兄弟节点
    // 既：如果当前节点没有兄弟节点，则找到的叔（祖）节点
    while (node.sibling === null) {
      if (node.return === null || node.return === workInProgress) {
        return
      }

      node = node.return
    }
    node.sibling.return = node.return
    node = node.sibling
  }
}

function markUpdate(workInProgress: Fiber) {
  // Tag the fiber with an update effect.
  // This turns a Placement into a PlacementAndUpdate.
  workInProgress.flags |= FiberFlags.Update
}
