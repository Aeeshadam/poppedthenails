export type AdminSlot = {
  /** UTC ISO start time. */
  starts_at: string;
  /** Client name if the slot has a live booking. */
  bookedBy: string | null;
};

export type DaySlot = {
  /** UTC ISO start time. */
  starts_at: string;
  /** UK time, e.g. "17:00". */
  time: string;
  /** Client name if the slot has a live booking. */
  bookedBy: string | null;
};
