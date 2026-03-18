import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl rounded-[2rem] border border-white/70 bg-white/80 p-8 text-center shadow-card backdrop-blur sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate">404</p>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          This route drifted out of the story.
        </h1>
        <p className="mt-5 text-base leading-8 text-slate">
          The page you were looking for does not exist, but the portfolio itself is still right
          where it should be.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-full bg-navy px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
        >
          Return home
        </Link>
      </div>
    </main>
  );
}
