"use client";
import Link from "next/link";
import Logo from "~/app/_components/logo";
import { Button } from "~/components/ui/button";
import Loader from "~/app/_components/loader";
import GitHubIcon from "~/icons/github-icon";
import GoogleIcon from "~/icons/google-icon";
import SignInIllustration from "~/illustrations/sign-in-illustration";

import { useSignIn, useSession } from "@clerk/nextjs";
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Tooltip,
} from "~/components/ui/tooltip";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { signIn } = useSignIn();
  const { isSignedIn, isLoaded } = useSession();
  const router = useRouter();
  const redirectUrlComplete = "/play";
  const redirectUrl = "/sso-callback";

  if (!isLoaded) {
    return <Loader />;
  }

  if (isSignedIn) {
    router.push("/play");
    return <Loader />;
  }

  const signInWithGoogle = () => {
    return signIn?.authenticateWithRedirect({
      strategy: "oauth_google",
      redirectUrl,
      redirectUrlComplete,
    });
  };

  const signInWithGitHub = () => {
    return signIn?.authenticateWithRedirect({
      strategy: "oauth_github",
      redirectUrl,
      redirectUrlComplete,
    });
  };

  return (
    <TooltipProvider delayDuration={0}>
      <div className="container relative hidden h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="hidden h-full flex-col bg-muted bg-zinc-900 p-10 pb-40 text-white dark:border-r lg:flex">
          <div className="relative z-20 flex h-full flex-col justify-center text-lg font-medium">
            <Logo />
            <div className="m-auto mt-auto w-3/4">
              <SignInIllustration />
            </div>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Sign in to your account
              </h1>
              <p className="text-sm text-muted-foreground">
                Select one of the following options to sign in.
              </p>
            </div>
            <div className="flex flex-row items-center justify-center space-x-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="flex items-center"
                    size="icon"
                    onClick={signInWithGoogle}
                  >
                    <GoogleIcon />
                  </Button>
                </TooltipTrigger>
                <TooltipContent align="center" side="top">
                  <p>Google</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="flex items-center"
                    size="icon"
                    onClick={signInWithGitHub}
                  >
                    <GitHubIcon />
                  </Button>
                </TooltipTrigger>
                <TooltipContent align="center" side="top">
                  <p>GitHub</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <p className="px-8 text-center text-sm text-muted-foreground">
              By selecting a option, u are agreeing to our{" "}
              <Link
                href="/terms"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
