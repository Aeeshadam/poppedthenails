import type { ComponentProps, ReactNode } from "react";

const inputClasses =
  "w-full rounded-input border border-line bg-surface px-4 text-base text-ink placeholder:text-muted/70 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 aria-invalid:border-warning";

type FieldProps = {
  label: ReactNode;
  htmlFor: string;
  hint?: ReactNode;
  /** Shown under the control. Give the control aria-describedby={errorId(htmlFor)} and aria-invalid. */
  error?: string;
  className?: string;
  children: ReactNode;
};

export const errorId = (htmlFor: string) => `${htmlFor}-error`;

export function Field({ label, htmlFor, hint, error, className = "", children }: FieldProps) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-2 block text-[15px] font-semibold">
        {label}
      </label>
      {children}
      {hint && <p className="mt-2 text-[13px] text-muted">{hint}</p>}
      {error && (
        <p id={errorId(htmlFor)} className="mt-2 text-[14px] font-medium text-warning">
          {error}
        </p>
      )}
    </div>
  );
}

export function TextInput({ className = "", ...rest }: ComponentProps<"input">) {
  return <input {...rest} className={`${inputClasses} h-[52px] ${className}`} />;
}

export function TextArea({ className = "", ...rest }: ComponentProps<"textarea">) {
  return <textarea {...rest} className={`${inputClasses} min-h-24 py-3.5 ${className}`} />;
}

export function Select({ className = "", ...rest }: ComponentProps<"select">) {
  return <select {...rest} className={`${inputClasses} h-[52px] pr-2 ${className}`} />;
}
