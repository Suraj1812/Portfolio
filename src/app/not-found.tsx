import Link from "next/link";

export default function NotFound() {
  return (
    <main className="portfolio-container flex min-h-screen items-center py-20">
      <div className="max-w-xl">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#cb4a27]">
          404 / Page not found
        </p>
        <h1 className="mt-5 font-display text-5xl font-medium leading-tight tracking-[-0.04em] text-[#222422] sm:text-6xl">
          A little off course.
        </h1>
        <p className="mt-5 text-base leading-7 text-[#222422]/65">
          This page could not be found. Head back to explore my selected work or
          get in touch.
        </p>
        <Link href="/" className="button button-primary mt-8">
          Return home
        </Link>
      </div>
    </main>
  );
}
