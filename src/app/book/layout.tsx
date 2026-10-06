export default function BookLayout({ children }: LayoutProps<"/book">) {
  return <main className="mx-auto w-full max-w-column flex-1 px-6 pb-36">{children}</main>;
}
