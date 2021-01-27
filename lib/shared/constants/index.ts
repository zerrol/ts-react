export * from './FiberFlags'

export enum WorkTag {
  FunctionComponent, ClassComponent, IndeterminateComponent, HostRoot, HostComponent, HostText
}

export enum RootTag {
  LegacyRoot, BlockingRoot, ConcurrentRoot
}