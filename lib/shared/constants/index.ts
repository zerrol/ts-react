export * from './FiberFlags'

export enum WorkTag {
  FunctionComponent,
  ClassComponent,
  IndeterminateComponent, 
  HostRoot, 
  HostComponent, 
  HostText,
  HostPortal
}

export enum RootTag {
  LegacyRoot, BlockingRoot, ConcurrentRoot
}