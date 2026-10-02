"use client";

import { useSyncExternalStore } from "react";
import { experience } from "@/lib/portfolio-data";
import {
  formatAsOfMonth,
  formatDuration,
  monthKey,
  monthsBetween,
  totalExperienceMonths,
  type ExperienceDate,
} from "@/lib/experience-duration";

const subscribers = new Set<() => void>();
let interval: ReturnType<typeof setInterval> | undefined;
const notify = () => subscribers.forEach((subscriber) => subscriber());

function subscribe(subscriber: () => void) {
  subscribers.add(subscriber);
  if (subscribers.size === 1) {
    interval = setInterval(notify, 60_000);
    window.addEventListener("focus", notify);
    document.addEventListener("visibilitychange", notify);
  }
  return () => {
    subscribers.delete(subscriber);
    if (subscribers.size === 0) {
      clearInterval(interval);
      window.removeEventListener("focus", notify);
      document.removeEventListener("visibilitychange", notify);
    }
  };
}

const getSnapshot = () => monthKey(new Date());

function useExperienceMonth(initialMonth: string) {
  return useSyncExternalStore(subscribe, getSnapshot, () => initialMonth);
}

type DurationProps = {
  initialMonth: string;
  className?: string;
} & (
  | { total: true; start?: never; end?: never }
  | { total?: false; start: ExperienceDate; end?: ExperienceDate }
);

export function ExperienceDuration(props: DurationProps) {
  const asOfMonth = useExperienceMonth(props.initialMonth);
  const months = props.total
    ? totalExperienceMonths(experience, asOfMonth)
    : monthsBetween(props.start, asOfMonth, props.end);
  return (
    <span
      className={props.className}
      title={`Calculated as of ${formatAsOfMonth(asOfMonth)}`}
    >
      {formatDuration(months)}
    </span>
  );
}

export function ExperienceAsOf({ initialMonth }: { initialMonth: string }) {
  const asOfMonth = useExperienceMonth(initialMonth);
  return (
    <span className="experience-as-of">
      As of {formatAsOfMonth(asOfMonth)} · updates automatically
    </span>
  );
}
