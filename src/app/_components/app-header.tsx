import UserNav from "../(dash)/_components/user-nav";
import Logo from "./logo";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur">
      <div className="flex h-20 items-center justify-between px-5">
        <Logo href="/search" />
        <UserNav />
      </div>
    </header>
  );
}
