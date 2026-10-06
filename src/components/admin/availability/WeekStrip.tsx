import { IconButton } from "@/components/IconButton";
import { ChevronLeft, ChevronRight } from "@/components/icons";
import { dayOfMonth, formatDateKey, formatWeekRange, WEEKDAYS, type DateKey } from "@/lib/dates";

type WeekStripProps = {
  days: DateKey[];
  today: DateKey;
  selectedDay: DateKey;
  hasSlots: (day: DateKey) => boolean;
  onSelectDay: (day: DateKey) => void;
  onChangeWeek: (by: -1 | 1) => void;
};

/** Week label with arrows, then seven day buttons with a dot on days that have slots. */
export function WeekStrip({ days, today, selectedDay, hasSlots, onSelectDay, onChangeWeek }: WeekStripProps) {
  const monday = days[0];

  return (
    <>
      <div className="flex items-center justify-between">
        <IconButton label="Previous week" onClick={() => onChangeWeek(-1)}>
          <ChevronLeft />
        </IconButton>
        <h2 className="font-semibold" aria-live="polite">
          {monday && formatWeekRange(monday)}
        </h2>
        <IconButton label="Next week" onClick={() => onChangeWeek(1)}>
          <ChevronRight />
        </IconButton>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1.5">
        {days.map((day, i) => {
          const selected = day === selectedDay;
          const dot = hasSlots(day);
          return (
            <button
              key={day}
              type="button"
              aria-pressed={selected}
              aria-label={`${formatDateKey(day, "long")}${dot ? ", has slots" : ""}`}
              onClick={() => onSelectDay(day)}
              className={`flex min-h-16 flex-col items-center justify-center rounded-2xl border py-2 transition-colors focus-visible:outline-2 focus-visible:outline-accent ${
                selected ? "border-accent bg-accent text-white" : "border-line bg-background hover:border-accent"
              } ${day < today && !selected ? "opacity-50" : ""}`}
            >
              <span className={`text-[13px] ${selected ? "text-white/85" : "text-muted"}`}>{WEEKDAYS[i]?.slice(0, 3)}</span>
              <span className="text-lg font-semibold leading-tight">{dayOfMonth(day)}</span>
              <span
                className={`mt-0.5 size-1.5 rounded-full ${dot ? (selected ? "bg-white" : "bg-accent") : "bg-transparent"}`}
              />
            </button>
          );
        })}
      </div>
    </>
  );
}
