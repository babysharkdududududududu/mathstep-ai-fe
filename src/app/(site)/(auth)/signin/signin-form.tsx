'use client';

import { Checkbox } from '@/components/ui/inputs/checkbox';
import { Input, InputGroup } from '@/components/ui/inputs';
import { Label } from '@/components/ui/label';
import { EyeCloseIcon, EyeIcon } from '@/icons/icons';
import { authValidation } from '@/lib/zod/auth.schema';
import { AuthService } from '@/lib/auth/service';
import { useAuth } from '@/hooks/use-auth';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';

type Inputs = z.infer<typeof authValidation.login>;

export default function SignInForm() {
  const router = useRouter();
  const { setToken } = useAuth();

  const form = useForm<Inputs>({
    resolver: zodResolver(authValidation.login),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const [rememberMe, setRememberMe] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleShowPassword = () => {
    setIsShowPassword(!isShowPassword);
  };

  async function onSubmit(data: Inputs) {
    setIsLoading(true);
    setApiError(null);

    try {
      const response = await AuthService.login(data);

      // Store token
      setToken(response.access_token);
      localStorage.setItem('loggedIn', 'true');
      if (rememberMe) {
        localStorage.setItem('lastUser', data.email);
      }

      toast.success('Đăng nhập thành công. Chuyển đến onboarding...');
      router.push('/onboarding');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Đăng nhập thất bại. Vui lòng thử lại.';
      setApiError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid gap-5">
        {apiError && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
            {apiError}
          </div>
        )}

        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <InputGroup
              type="email"
              label="Email address"
              placeholder="Your email address"
              groupClassName="col-span-full"
              disabled={isLoading}
              {...field}
              error={fieldState.error?.message}
            />
          )}
        />

        <div>
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              type={isShowPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              id="password"
              disabled={isLoading}
              {...form.register('password')}
            />

            <button
              type="button"
              title={isShowPassword ? 'Hide password' : 'Show password'}
              aria-label={isShowPassword ? 'Hide password' : 'Show password'}
              onClick={handleShowPassword}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-600"
            >
              {isShowPassword ? <EyeIcon /> : <EyeCloseIcon />}
            </button>
          </div>
          {form.formState.errors.password && (
            <p className="text-red-500 text-sm mt-1.5">{form.formState.errors.password.message}</p>
          )}
        </div>

        <div className="flex items-center justify-between flex-wrap gap-3">
          <Checkbox
            label="Keep me logged in"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            name="remember_me"
          />

          <Link href="/reset-password" className="text-primary-500 text-sm">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-primary-500 hover:bg-primary-600 transition py-3 px-6 w-full font-medium text-white text-sm rounded-full disabled:opacity-75"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </div>
    </form>
  );
}
