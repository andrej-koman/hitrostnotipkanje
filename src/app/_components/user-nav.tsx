"use client";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";

import SignInButton from "~/components/ui/sign-in-button";

import { Avatar, AvatarImage } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
} from "~/components/ui/dropdown-menu";
import { SignOutButton } from "@clerk/nextjs";
import SignOutIcon from "~/icons/sign-out-icon";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function UserNav() {
  const { user } = useUser();
  const pathname = usePathname();

  if (pathname === "/") {
    return (
      <div className="flex flex-row gap-x-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/sign-in">Login</Link>
        </Button>
        <Button
          variant="default"
          size="sm"
          className="flex items-center justify-center text-xs"
          asChild
        >
          <Link href="/play" className="text-justify">
            Play
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <SignedIn>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-6 w-6 cursor-pointer">
              <AvatarImage
                src={user?.imageUrl}
                alt={user?.fullName ?? undefined}
              />
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user?.fullName}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.primaryEmailAddress?.emailAddress}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <SignOutButton
                signOutOptions={{
                  redirectUrl: pathname,
                }}
              />
              <DropdownMenuShortcut>
                <SignOutIcon className="h-4 w-4" />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SignedIn>
      <SignedOut>
        <SignInButton />
      </SignedOut>
    </>
  );
}
