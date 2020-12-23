export * from './FiberFlags'

export enum WorkTag {
  FunctionComponent, ClassComponent, IndeterminateComponent, HostRoot, HostComponent 
}

export enum RootTag {
  LegacyRoot, BlockingRoot, ConcurrentRoot
}