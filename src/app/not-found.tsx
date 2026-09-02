import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { nav } from "@/lib/content";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <>
      <Header />
      <main
        id="main"
        className="grid min-h-[70vh] place-items-center pt-[72px]"
      >
        <div className="shell py-20 text-center">
          <p className="eyebrow mb-5">Error 404</p>
          <h1 className="display text-[2.25rem] sm:text-[3rem]">
            That page is not <em className="ink-gradient not-italic">here.</em>
          </h1>
          <p className="lede mx-auto mt-5 max-w-lg">
            The link may be out of date, or the page may have moved. Everything
            the site has is one of these:
          </p>

          <ul className="mt-9 flex flex-wrap justify-center gap-2">
            {[...nav, { label: "Contact", href: "/contact" }].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="border-line bg-surface text-ink-soft hover:border-brand hover:text-brand-deep inline-flex rounded-full border px-4 py-2.5 text-[0.9375rem] font-medium transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-10">
            <Link
              href="/"
              className="bg-ink hover:bg-brand-deep inline-flex rounded-full px-6 py-3.5 text-[0.9375rem] font-semibold text-white transition-colors"
            >
              Back to the homepage
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
