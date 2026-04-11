'use client';

import { Checkbox } from '@/components/ui/inputs/checkbox';
import { Input, InputGroup } from '@/components/ui/inputs';
import { Label } from '@/components/ui/label';
import { EyeCloseIcon, EyeIcon } from '@/icons/icons';
import { authValidation } from '@/lib/zod/auth.schema';
import { AuthService } from '@/lib/auth/service';
import { useAuth } from '@/hooks/use-auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

type Inputs = z.infer<typeof authValidation.register>;

export default function SignupForm() {
  const router = useRouter();
  const { setToken } = useAuth();

  const form = useForm<Inputs>({
    resolver: zodResolver(authValidation.register),
    defaultValues: {
      firstName: '',
      lastName: '',
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
      console.log('[SignupForm] Submitting with:', { 
        email: data.email, 
        firstName: data.firstName,
        lastName: data.lastName,
        keepMeLoggedIn: rememberMe 
      });

      const response = await AuthService.register({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        role: 'STUDENT',
      });

      console.log('[SignupForm] Register response:', { 
        hasAccessToken: !!response.access_token,
        hasRefreshToken: !!response.refresh_token,
        userId: response.user_id,
        email: response.email
      });

      setToken(response.access_token);

      if (rememberMe && response.refresh_token) {
        localStorage.setItem('authToken', response.access_token);
        localStorage.setItem('refreshToken', response.refresh_token);
        console.log('[SignupForm] Stored refresh token - "Keep me logged in" active');
      } else {
        localStorage.removeItem('refreshToken');
      }

      localStorage.setItem('loggedIn', 'true');
      if (rememberMe) {
        localStorage.setItem('lastUser', data.email);
      }

      toast.success('Đăng ký thành công. Tiếp tục đến onboarding...');
      
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push('/onboarding');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Đăng ký thất bại. Vui lòng thử lại.';
      
      console.error('[SignupForm] Registration error:', errorMessage);
      setApiError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {apiError && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm col-span-full">
            {apiError}
          </div>
        )}

        <Controller
          control={form.control}
          name="firstName"
          render={({ field, fieldState }) => (
            <InputGroup
              label="First name"
              placeholder="Your first name"
              disabled={isLoading}
              {...field}
              error={fieldState.error?.message}
            />
          )}
        />

        <Controller
          control={form.control}
          name="lastName"
          render={({ field, fieldState }) => (
            <InputGroup
              label="Last name"
              placeholder="Your last name"
              disabled={isLoading}
              {...field}
              error={fieldState.error?.message}
            />
          )}
        />

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

        <div className="col-span-full">
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
            <p className="text-red-500 text-sm mt-1.5">
              {form.formState.errors.password.message}
            </p>
          )}
        </div>

        <Checkbox
          label="Keep me logged in"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
          name="remember_me"
          className="col-span-full"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="bg-primary-500 hover:bg-primary-600 transition py-3 px-6 w-full font-medium text-white text-sm rounded-full col-span-full disabled:opacity-75"
        >
          {isLoading ? 'Signing up...' : 'Sign Up'}
        </button>
      </div>
    </form>
  );
}
      
