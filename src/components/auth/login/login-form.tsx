'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { loginSchema, LoginFormValues } from '@/schemas/login.form';

interface LoginError {
  response?: {
    status?: number;
    data?: {
      errors?: Array<{
        code?: string;
        message?: string;
      }>;
    };
  };
}

export function LoginForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { login, isLoading } = useAuth();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [attemptCount, setAttemptCount] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setLoginError(null);
      clearErrors();

      await login(data);

      setAttemptCount(0);
    } catch (error: unknown) {
      const loginError = error as LoginError;

      setAttemptCount(prev => prev + 1);

      const errorData = loginError.response?.data;
      const errorCode = errorData?.errors?.[0]?.code;
      const errorMessage = errorData?.errors?.[0]?.message;

      if (errorCode === 'too_many_login_attempts') {
        setLoginError(
          'Too many failed login attempts. Please wait a few minutes before trying again.'
        );
      } else if (
        errorCode === 'invalid_credentials' ||
        errorMessage?.includes('email address and/or password') ||
        errorMessage?.includes('not correct')
      ) {
        setLoginError(
          'The email address and/or password you specified are not correct.'
        );

        setError('email', {
          type: 'manual',
          message: 'Please verify your email address',
        });
        setError('password', {
          type: 'manual',
          message: 'Please verify your password',
        });
      } else if (errorCode === 'user_not_found') {
        setLoginError('Account not found. Please check your email or sign up.');
        setError('email', {
          type: 'manual',
          message: 'Email not found in our system',
        });
      } else if (errorCode === 'account_disabled') {
        setLoginError(
          'Your account has been disabled. Please contact support for assistance.'
        );
      } else if (loginError.response?.status === 401) {
        setLoginError(
          'Invalid email or password. Please check your credentials.'
        );

        setError('email', {
          type: 'manual',
          message: 'Please verify your email address',
        });
        setError('password', {
          type: 'manual',
          message: 'Please verify your password',
        });
      } else if (loginError.response?.status === 429) {
        setLoginError(
          'Too many login attempts. Please wait before trying again.'
        );
      } else if (loginError.response?.status === 404) {
        setLoginError('Account not found. Please check your email or sign up.');
        setError('email', {
          type: 'manual',
          message: 'Email not found in our system',
        });
      } else {
        setLoginError(errorMessage || 'Login failed. Please try again.');
      }
    }
  };

  const showSecurityMessage = attemptCount >= 3;

  return (
    <div className="bg-card flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="relative sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <div className={cn('grid gap-6', className)} {...props}>
            {loginError && (
              <div className="mb-4 flex items-center rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                <AlertCircle className="mr-2 h-5 w-5" />
                <span>{loginError}</span>
              </div>
            )}

            {showSecurityMessage && (
              <div className="mb-4 flex items-center rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
                <AlertCircle className="mr-2 h-5 w-5" />
                <span>
                  For security reasons, please double-check your credentials. If
                  you&apos;ve forgotten your password, consider resetting it.
                </span>
              </div>
            )}
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
              <p className="mt-2 text-gray-600">
                Please enter your details to sign in.
              </p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-6">
                <div>
                  <Input
                    id="email"
                    type="email"
                    label="Email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    disabled={isLoading}
                    className={cn(
                      errors.email
                        ? 'border-red-300 focus:ring-red-500'
                        : 'focus:ring-primary border-gray-300'
                    )}
                    {...register('email')}
                    onChange={e => {
                      register('email').onChange(e);
                      if (loginError) {
                        setLoginError(null);
                      }
                    }}
                  />
                  {errors.email && (
                    <p className="mt-2 flex items-center text-sm font-medium text-red-500">
                      <AlertCircle className="mr-1 h-4 w-4" />
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <Input
                    id="password"
                    type="password"
                    label="Password"
                    disabled={isLoading}
                    className={cn(
                      errors.password
                        ? 'border-red-300 focus:ring-red-500'
                        : 'focus:ring-primary border-gray-300'
                    )}
                    {...register('password')}
                    onChange={e => {
                      register('password').onChange(e);
                      if (loginError) {
                        setLoginError(null);
                      }
                    }}
                  />
                  {errors.password && (
                    <p className="mt-2 flex items-center text-sm font-medium text-red-500">
                      <AlertCircle className="mr-1 h-4 w-4" />
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className={cn(
                    'w-full rounded-lg px-4 py-3 font-medium text-white transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none',
                    isLoading
                      ? 'cursor-not-allowed bg-gray-400'
                      : 'bg-primary hover:bg-primary focus:ring-primary'
                  )}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="mr-2 h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
                      Signing in...
                    </div>
                  ) : (
                    'Login'
                  )}
                </Button>
              </div>
            </form>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              <Link
                href="/signup"
                className="text-primary hover:text-primary font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
