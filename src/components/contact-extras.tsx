"use client";

import { useState, useSyncExternalStore } from "react";
import { Check, Copy } from "lucide-react";

const timeFormat = new Intl.DateTimeFormat("en-IN", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
  timeZone: "Asia/Kolkata",
});

function subscribeToMinute(callback: () => void) {
  const id = window.setInterval(callback, 15_000);
  return () => window.clearInterval(id);
}

/** Live local time in India, rendered only on the client to avoid hydration mismatch. */
export function LocalTime() {
  const time = useSyncExternalStore(
    subscribeToMinute,
    () => timeFormat.format(new Date()),
    () => null,
  );
  return <span suppressHydrationWarning>{time ?? "--:--"}</span>;
}

export function CopyEmailButton({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      className="contact-copy"
      onClick={copy}
      aria-label={copied ? "Email copied" : "Copy email address"}
    >
      {copied ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
      <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}
