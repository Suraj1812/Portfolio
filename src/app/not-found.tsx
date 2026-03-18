import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
      <div className="neo-panel-lg w-full max-w-2xl bg-[var(--yellow)] p-8 text-center sm:p-10">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-black">404</p>
        <h1 className="mt-4 font-display text-4xl font-black uppercase tracking-[-0.05em] text-black sm:text-5xl">
          This page punched through the layout.
        </h1>
        <p className="mt-5 text-base leading-8 text-black/75">
          The route you were looking for does not exist, but the portfolio is still live and ready
          to explore.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-[1rem] border-4 border-black bg-white px-5 py-3 text-sm font-black uppercase tracking-[0.12em] text-black transition-transform hover:-translate-y-0.5"
        >
          Return home
        </Link>
      </div>
    </main>
  );
}
