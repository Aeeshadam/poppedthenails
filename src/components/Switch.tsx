"use client";

type SwitchProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
};

export function Switch({ checked, onChange, label }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className="inline-flex min-h-11 items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <span
        className={`flex h-8 w-[52px] items-center rounded-full p-1 transition-colors ${checked ? "bg-accent" : "bg-lilac/70"}`}
      >
        <span
          className={`size-6 rounded-full bg-white shadow-sm transition-transform ${checked ? "translate-x-5" : ""}`}
        />
      </span>
    </button>
  );
}
