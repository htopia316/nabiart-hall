'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/lib/i18n/navigation';
import { useAdminStore } from '@/lib/stores/admin';
import { AdminLogin } from '@/components/features/admin/AdminLogin';

const NAV_ITEMS = [
  { href: '/admin', label: '대시보드', icon: '📊' },
  { href: '/admin/shows', label: '공연 관리', icon: '🎭' },
  { href: '/admin/bookings', label: '예매 관리', icon: '🎟️' },
  { href: '/admin/people', label: '프로필 관리', icon: '👥' },
  { href: '/admin/notices', label: '공지사항 관리', icon: '📢' },
  { href: '/admin/rentals', label: '대관 관리', icon: '🏛️' },
  { href: '/admin/donations', label: '후원 관리', icon: '💝' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations();
  const pathname = usePathname();
  const { isAuthenticated, adminEmail, logout } = useAdminStore();

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-border bg-card p-4 lg:block">
        <div className="mb-6">
          <p className="text-xs text-muted-foreground">관리자</p>
          <p className="text-sm font-medium truncate">{adminEmail}</p>
        </div>
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href}>
                <div className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                  isActive ? 'bg-primary/10 font-medium text-primary' : 'hover:bg-muted'
                }`}>
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>
        <button
          onClick={logout}
          className="mt-8 w-full rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted"
        >
          로그아웃
        </button>
      </aside>

      {/* Mobile nav */}
      <div className="w-full overflow-x-auto border-b border-border lg:hidden">
        <div className="flex gap-1 p-2">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href}>
                <div className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs ${
                  isActive ? 'bg-primary/10 font-medium text-primary' : 'hover:bg-muted'
                }`}>
                  {item.icon} {item.label}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
