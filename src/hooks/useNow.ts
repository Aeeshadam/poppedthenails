"use client";

import { useEffect, useState } from "react";

type UseNowOptions = {
  /** Update this often, in milliseconds. Leave out for a clock that doesn't tick. */
  every?: number;
  /** Tick only while this is true, e.g. while there is a countdown on screen. */
  enabled?: boolean;
};

/** Starts from the server's time so the first render matches the HTML. */
export function useNow(serverNow: string, { every, enabled = true }: UseNowOptions = {}): Date {
  const [now, setNow] = useState(() => new Date(serverNow));

  useEffect(() => {
    if (!every || !enabled) return;
    const timer = setInterval(() => setNow(new Date()), every);
    return () => clearInterval(timer);
  }, [every, enabled]);

  return now;
}
