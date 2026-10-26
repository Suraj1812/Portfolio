import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  /** Delay in seconds. */
  delay?: number;
  animation?: string;
};

/** Wrapper around the site-wide data-aos scroll reveal. */
export function ScrollReveal({
  children,
  className,
  delay = 0,
  animation = "fade-up",
}: ScrollRevealProps) {
  return (
    <div
      className={cn(className)}
      data-aos={animation}
      data-aos-delay={delay ? Math.round(delay * 1000) : undefined}
    >
      {children}
    </div>
  );
}
