'use client';

import { PasswordInput } from '@/components/ui/inputs';
import { authValidation } from '@/lib/zod/auth.schema';
import { AuthService } from '@/lib/auth/service';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

type Inputs = z.infer<typeof authValidation.resetPassword>;

type PropsType = {
  resetToken: string;
};

export default function ResetPasswordForm({ resetToken }: PropsType) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const form = useForm<Inputs>({
    resolver: zodResolver(authValidation.resetPassword),
    defaultValues: {
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  async function onSubmit(data: Inputs) {
    setIsLoading(true);
    setApiError(null);

    try {
      console.log('[ResetPasswordForm] Submitting password reset');

      const response = await AuthService.resetPassword({
        token: resetToken,
        new_password: data.newPassword,
      });

      console.log('[ResetPasswordForm] Success:', response.message);

      toast.success('Password reset successfully! Redirecting to login...');

      form.reset();

      await new Promise((resolve) => setTimeout(resolve, 2000));
      router.push('/signin');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to reset password';
      
      console.error('[ResetPasswordForm] Error:', errorMessage);
      setApiError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="text-center mb-8">
        <h3 className="text-gray-800 font-bold text-3xl mb-2 dark:text-white/90">
          Change Password
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Make sure to create a strong password to mark your projects.
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-5">
          {apiError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
              {apiError}
            </div>
          )}

          <Controller
            control={form.control}
            name="newPassword"
            render={({ field, fieldState }) => (
              <PasswordInput
                label="New Password"
                placeholder="Enter your new password"
                required
                error={fieldState.error?.message}
                disabled={isLoading}
                {...field}
              />
            )}
          />

          <Controller
            control={form.control}
            name="confirmNewPassword"
            render={({ field, fieldState }) => (
              <PasswordInput
                label="Confirm New Password"
                placeholder="Confirm your new password"
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
            {isLoading ? 'Submitting...' : 'Reset Password'}
          </button>
        </div>
      </form>
    </>
  );
}
