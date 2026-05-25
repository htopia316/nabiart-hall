'use client';

import { useState } from 'react';
import { Input, Button } from '@sunghoon_lee/akron-ui';
import { useAdminStore } from '@/lib/stores/admin';

export function AdminLogin() {
  const { login } = useAdminStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setError('');
    await new Promise((r) => setTimeout(r, 800));

    if (email === 'admin@nabiart.com' && password === 'admin1234') {
      login(email);
    } else {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.');
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-2 text-center text-2xl font-bold">관리자 로그인</h1>
        <p className="mb-8 text-center text-sm text-muted-foreground">나비아트홀 관리자 페이지</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="이메일"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="admin@nabiart.com"
          />
          <Input
            label="비밀번호"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="비밀번호"
          />

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}

          <Button type="submit" variant="primary" size="lg" disabled={loading} className="w-full">
            {loading ? '로그인 중...' : '로그인'}
          </Button>
        </form>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          테스트: admin@nabiart.com / admin1234
        </p>
      </div>
    </div>
  );
}
