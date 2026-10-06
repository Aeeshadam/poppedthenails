"use client";

import { useState } from "react";
import { Button } from "./Button";

export function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Button
      variant="soft"
      size="md"
      onClick={copy}
      aria-label={copied ? `${label} copied` : `Copy ${label}`}
    >
      <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
    </Button>
  );
}
