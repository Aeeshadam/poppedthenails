import type { DaySlot } from "@/lib/availability";

type TimeGridProps = {
  times: string[];
  slotsByTime: Map<string, DaySlot>;
  disabled: boolean;
  onToggle: (time: string) => void;
};

const look = {
  booked: "cursor-not-allowed border-ink bg-ink font-semibold text-white",
  open: "border-accent bg-accent font-semibold text-white hover:bg-accent-hover",
  off: "border-line bg-surface hover:border-accent disabled:hover:border-line",
};

export function TimeGrid({ times, slotsByTime, disabled, onToggle }: TimeGridProps) {
  return (
    <div className="mt-4 grid grid-cols-4 gap-2">
      {times.map((time) => {
        const slot = slotsByTime.get(time);
        const state = slot?.bookedBy ? "booked" : slot ? "open" : "off";
        return (
          <button
            key={time}
            type="button"
            aria-pressed={state === "booked" ? undefined : state === "open"}
            aria-label={state === "booked" ? `${time}, booked by ${slot?.bookedBy}` : time}
            disabled={state === "booked" || disabled}
            onClick={() => onToggle(time)}
            className={`h-12 rounded-input border text-[15px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${look[state]} ${
              disabled && state !== "booked" ? "opacity-50" : ""
            }`}
          >
            {time}
          </button>
        );
      })}
    </div>
  );
}

export function TimeGridKey() {
  return (
    <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[15px] text-muted" aria-label="Key">
      <li className="flex items-center gap-2">
        <span className="size-3.5 rounded-full bg-accent" /> Open slot
      </li>
      <li className="flex items-center gap-2">
        <span className="size-3.5 rounded-full bg-ink" /> Booked
      </li>
      <li className="flex items-center gap-2">
        <span className="size-3.5 rounded-full border border-line bg-surface" /> Not offered
      </li>
    </ul>
  );
}
