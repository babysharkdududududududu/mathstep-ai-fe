'use client';

import { GithubIcon, GoogleIcon } from '@/icons/icons';
import { AuthService } from '@/lib/auth/service';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export function SignInWithGoogle() {
  const router = useRouter();
  const { setToken } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
  setIsLoading(true);

  console.log("Initiating Google Sign-In...");

  try {
    if (typeof window === "undefined" || !window.google) {
      console.error("Google Sign-In library not loaded");
      throw new Error("Google Sign-In not available");
    }
      console.error("Google Sign-In library not loaded");


    const credential = await new Promise<string>((resolve, reject) => {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
        callback: (response: {
          credential?: string;
        }) => {
          if (response.credential) {
            resolve(response.credential);
          } else {
            reject(new Error("No credential returned"));
          }
        },
      });


      // Hiển thị popup Google
      window.google.accounts.id.prompt();
    });
      console.log("Prompting Google Sign-In...", credential);

    // gửi lên backend
    const result = await AuthService.googleLogin({
      token: credential,
    });

    setToken(result.access_token);
    localStorage.setItem("loggedIn", "true");

    toast.success("Google login successful");
    router.push("/onboarding");

  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Google login failed";

    toast.error(errorMessage);
    console.error("Google login error:", error);
  } finally {
    setIsLoading(false);
  }
};

  return (
    <button
      onClick={handleGoogleLogin}
      disabled={isLoading}
      className="bg-gray-100 text-left w-full justify-center dark:hover:bg-white/10 dark:hover:text-white/90 dark:bg-white/5 transition dark:text-gray-400 font-normal text-sm hover:bg-gray-200 rounded-full text-gray-700 hover:text-gray-800 flex items-center gap-3 px-4 sm:px-8 py-2.5 min-h-12 disabled:opacity-50 disabled:cursor-not-allowed"
      type="button"
    >
      <GoogleIcon className="shrink-0" />
      <span>{isLoading ? 'Signing in...' : 'Sign in with Google'}</span>
    </button>
  );
}

export function SignInWithGithub() {
  return (
    <button className="bg-gray-100 w-full justify-center dark:hover:bg-white/10 dark:hover:text-white/90 dark:bg-white/5 transition dark:text-gray-400 font-normal text-sm hover:bg-gray-200 rounded-full text-gray-700 hover:text-gray-800 flex items-center gap-3 px-4 sm:px-8 py-2.5 text-left min-h-12" type="button">
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
