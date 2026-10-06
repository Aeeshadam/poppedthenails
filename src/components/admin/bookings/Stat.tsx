import { Card } from "@/components/Card";

export function Stat({ label, value, unit }: { label: string; value: number; unit: string }) {
  return (
    <Card className="p-5">
      <p className="text-[15px] text-muted">{label}</p>
      <p className="mt-1 font-serif text-title leading-none">{value}</p>
      <p className="mt-2 text-[15px] text-muted">{unit}</p>
    </Card>
  );
}
