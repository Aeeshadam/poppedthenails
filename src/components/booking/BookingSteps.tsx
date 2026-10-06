import Link from "next/link";
import { ChevronLeft } from "@/components/icons";

type BookingStepsProps = {
  step: 1 | 2 | 3;
  backHref: string;
};

export function BookingSteps({ step, backHref }: BookingStepsProps) {
  return (
    <div className="pt-3">
      <div className="grid grid-cols-[44px_1fr_44px] items-center">
        <Link
          href={backHref}
          aria-label="Back"
          className="-ml-2.5 inline-flex size-11 items-center justify-center rounded-full hover:bg-soft focus-visible:outline-2 focus-visible:outline-accent"
        >
          <ChevronLeft className="size-6" />
        </Link>
        <p className="text-center text-[15px] font-semibold">Book</p>
        <p className="text-right text-[15px] text-muted">
          <span className="sr-only">Step </span>
          {step} / 3
        </p>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-1.5" aria-hidden="true">
        {[1, 2, 3].map((n) => (
          <span key={n} className={`h-1 rounded-full ${n <= step ? "bg-accent" : "bg-line"}`} />
        ))}
      </div>
    </div>
  );
}
