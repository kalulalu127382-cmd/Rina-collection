'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      router.push('/admin');
      router.refresh();
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8">
        {/* Logo */}
        <div className="text-center">
          <h1 className="font-serif text-3xl font-bold text-primary">
            Rina<span className="text-accent">.</span>
          </h1>
          <p className="mt-2 font-sans text-sm text-text-muted">Admin Dashboard</p>
        </div>

        {/* Login form */}
        <form onSubmit={handleLogin} className="bg-white rounded-2xl border border-border-light p-6 space-y-5 shadow-sm">
          <h2 className="font-sans text-lg font-semibold text-text">Sign In</h2>

          {error && (
            <div className="flex items-center gap-2 bg-error/5 border border-error/20 rounded-xl px-4 py-3">
              <AlertCircle className="w-4 h-4 text-error shrink-0" />
              <p className="font-sans text-sm text-error">{error}</p>
            </div>
          )}

          <Input
            label="Email"
            type="email"
            required
            placeholder="admin@rinacollection.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Password"
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            rounded
            size="lg"
            isLoading={loading}
          >
            Sign In
          </Button>
        </form>

        <p className="text-center text-xs text-text-muted">
          Protected admin area. Customers do not need to log in.
        </p>
      </div>
    </div>
  );
}
