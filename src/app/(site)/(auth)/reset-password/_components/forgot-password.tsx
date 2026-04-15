'use client';

import { InputGroup } from '@/components/ui/inputs';
import { authValidation } from '@/lib/zod/auth.schema';
import { AuthService } from '@/lib/auth/service';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

type Inputs = z.infer<typeof authValidation.forgotPasswordForm>;

type PropsType = {
  invalidToken: boolean;
};

export default function ForgotPasswordForm({ invalidToken }: PropsType) {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showGoogleMessage, setShowGoogleMessage] = useState(false);

  const form = useForm<Inputs>({
    resolver: zodResolver(authValidation.forgotPasswordForm),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(data: Inputs) {
    setIsLoading(true);
    setApiError(null);
    setShowGoogleMessage(false);

    try {
      console.log('[ForgotPasswordForm] Submitting for email:', data.email);

      const response = await AuthService.forgotPassword({
        email: data.email,
      });

      console.log('[ForgotPasswordForm] Success:', response.message);

      toast.success(
        'If an account exists with this email, a password reset link has been sent.'
      );

      form.reset();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to send reset email';
      
      console.error('[ForgotPasswordForm] Error:', errorMessage);
      
      // Check if error message indicates Google account
      if (
        errorMessage.toLowerCase().includes('google') ||
        errorMessage.toLowerCase().includes('different auth method')
      ) {
        setShowGoogleMessage(true);
      } else {
        setApiError(errorMessage);
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (invalidToken) {
      toast.error('Invalid or expired reset link. Please request a new one.');
    }
  }, [invalidToken]);

  return (
    <>
      <div className="text-center mb-8">
        <h3 className="text-gray-800 font-bold text-3xl mb-2 dark:text-white/90">
          Forgot Your Password?
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Enter the email address linked to your account, and we’ll send you a
          link to reset your password.
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-5">
          {apiError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
              {apiError}
            </div>
          )}

          {showGoogleMessage && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 px-4 py-3 rounded-lg text-sm">
              <strong>ℹ️ Account Sign-In Method:</strong> This account is connected to Google Sign-In. Please use the Sign in with Google button on the login page instead.
            </div>
          )}

          <Controller
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <InputGroup
                label="Email"
                type="email"
                placeholder="Enter your email address"
                required
                error={fieldState.error?.message}
                disabled={isLoading}
                {...field}
              />
            )}
          />

          <button
            className="bg-primary-500 hover:bg-primary-600 transition py-3 px-6 w-full font-medium text-white text-sm rounded-full disabled:opacity-75"
            disabled={isLoading}
            type="submit"
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </div>
      </form>

      <p className="text-gray-700 dark:text-gray-400 font-normal text-sm mt-5">
        Remembered password?{' '}
        <Link href="/signin" className="text-sm font-semibold text-primary-500">
          Sign In
        </Link>
      </p>
    </>
  );
}
