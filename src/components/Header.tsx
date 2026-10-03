import { ButtonLink } from "./Button";
import { Logo } from "./Logo";

export function Header() {
  return (
    <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 pt-5">
      <Logo />
      <ButtonLink href="/book" variant="dark" size="md">
        Book
      </ButtonLink>
    </header>
  );
}
