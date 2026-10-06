import type { ReactNode } from "react";
import { Card } from "./Card";

export function EmptyState({ className = "", children }: { className?: string; children: ReactNode }) {
  return <Card className={`p-5 text-muted ${className}`}>{children}</Card>;
}
