"use client";

import { GithubIcon, GoogleIcon } from "@/icons/icons";
import { AuthService } from "@/lib/auth/service";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import loadingAnim from "@/assets/lottiefiles/loading.json";
import Lottie from "lottie-react";

export function SignInWithGoogle() {
  const router = useRouter();
  const { setToken } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const handleGoogleLogin = async () => {
    try {
      if (typeof window === "undefined" || !window.google) {
        throw new Error("Google Sign-In not available");
      }

      const credential = await new Promise<string>((resolve, reject) => {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
          callback: (response) => {
            if (response.credential) resolve(response.credential);
            else reject(new Error("No credential returned"));
          },
        });

        window.google.accounts.id.prompt();
      });

      // 👉 chỉ bật loading khi chắc chắn có credential
      setIsLoading(true);

      const result = await AuthService.googleLogin({
        token: credential,
      });

      setToken(result.access_token);
      localStorage.setItem("loggedIn", "true");

      toast.success("Google login successful");

      await sleep(10000);
      router.push("/onboarding");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Google login failed",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleGoogleLogin}
        disabled={isLoading}
        className="bg-gray-100 text-left w-full justify-center dark:hover:bg-white/10 dark:hover:text-white/90 dark:bg-white/5 transition dark:text-gray-400 font-normal text-sm hover:bg-gray-200 rounded-full text-gray-700 hover:text-gray-800 flex items-center gap-3 px-4 sm:px-8 py-2.5 min-h-12 disabled:opacity-50 disabled:cursor-not-allowed"
        type="button"
      >
        <GoogleIcon className="shrink-0" />
        <span>{isLoading ? "Signing in..." : "Sign in with Google"}</span>
      </button>
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-black/70">
          <div className="w-120 h-120">
            <Lottie animationData={loadingAnim} loop />
          </div>
        </div>
      )}
    </>
  );
}

export function SignInWithGithub() {
  return (
    <button
      className="bg-gray-100 w-full justify-center dark:hover:bg-white/10 dark:hover:text-white/90 dark:bg-white/5 transition dark:text-gray-400 font-normal text-sm hover:bg-gray-200 rounded-full text-gray-700 hover:text-gray-800 flex items-center gap-3 px-4 sm:px-8 py-2.5 text-left min-h-12"
      type="button"
    >
      <GithubIcon className="size-6 shrink-0" />
      <span>Sign in with Github</span>
    </button>
  );
}

// Declare global window interface for Google Sign-In
declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: {
              credential?: string;
              select_by?: string;
            }) => void;
          }) => void;
          prompt: () => void;
        };
      };
    };
  }
}
