
export enum FiberFlags {
  // Don't change these two values. They're used by React Dev Tools.
  NoFlags = /*                      */ 0b0000000000000000000,
  PerformedWork = /*                */ 0b0000000000000000001,
  // You can change the rest (and add more).
  Placement = /*                    */ 0b0000000000000000010,
  Update = /*                       */ 0b0000000000000000100,
  PlacementAndUpdate = /*           */ 0b0000000000000000110,
  Deletion = /*                     */ 0b0000000000000001000
}


