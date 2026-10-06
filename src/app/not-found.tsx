import { ButtonLink } from "@/components/Button";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="mx-auto flex w-full max-w-column flex-1 flex-col items-center px-6 pt-16 text-center">
        <p className="font-script text-[38px] leading-none text-accent">oops</p>
        <h1 className="mt-3 font-serif text-title">Page not found</h1>
        <p className="mt-3 leading-relaxed text-muted">
          That page doesn&rsquo;t exist, or the link has changed.
        </p>
        <ButtonLink href="/" className="mt-8 w-full">
          Back to home
        </ButtonLink>
      </main>
      <Footer />
    </>
  );
}
