"use client";
import Link from "next/link"
import Logo from "~/app/_components/logo"
import { Button } from "~/components/ui/button"
import GitHubIcon from "~/icons/github-icon"
import GoogleIcon from "~/icons/google-icon"
import SignInIllustration from "~/illustrations/sign-in-illustration"

import { useSignIn } from "@clerk/nextjs";

export default function SignInPage() {
    const { signIn } = useSignIn();

    const signInWithGoogle = () => {
        return signIn?.authenticateWithRedirect({
            strategy: "oauth_google",
            redirectUrl: "/sso-callback",
            redirectUrlComplete: "/",
        });
    };

    const signInWithGitHub = () => {
        return signIn?.authenticateWithRedirect({
            strategy: "oauth_github",
            redirectUrl: "/sso-callback",
            redirectUrlComplete: "/",
        });
    };

    return (
        <div className="container relative hidden h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="hidden h-full flex-col bg-muted p-10 pb-40 bg-zinc-900 text-white lg:flex dark:border-r">
                <div className="relative flex-col z-20 h-full flex text-lg font-medium">
                    <Logo />
                    <SignInIllustration className="mt-auto overflow-hidden w-max md:w-max/50" />
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
                    <div className="flex flex-row justify-center items-center space-x-3">
                        <Button className="flex items-center border border-white" size="icon" onClick={signInWithGoogle}>
                            <GoogleIcon />
                        </Button>
                        <Button className="flex items-center border border-white" size="icon" onClick={signInWithGitHub}>
                            <GitHubIcon />
                        </Button>
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
    )
}