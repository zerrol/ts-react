
export enum UpdateTag {
  UpdateState, ReplaceState, ForceUpdate, CaptureUpdate
}

export interface Update<State = any> {
  // eventTime: number

  // lane: number

  tag: UpdateTag
  payload: any,
  // callback: () => void

  next: Update<State> | null
}

export interface SharedQueue<State> {
  pending: Update<State> | null
}

export interface UpdateQueue<State> {
  // baseState: State,
  // firstBaseUpdate: Update<State> | null,
  // lastBaseUpdate: Update<State> | null,
  shared: SharedQueue<State>,
  // effects: Update<State>[] | null
}

