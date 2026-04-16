import type { ReactNode } from 'react';

interface MasterDetailLayoutProps {
  sidebar: ReactNode;
  detail: ReactNode;
  showDetail: boolean;
  isDesktop: boolean;
}

export function MasterDetailLayout({
  sidebar,
  detail,
  showDetail,
  isDesktop,
}: MasterDetailLayoutProps) {
  if (isDesktop) {
    return (
      <div className="flex h-screen">
        <nav
          aria-label="Notes list"
          className="w-72 flex-shrink-0 border-r border-gray-200 bg-gray-50"
        >
          {sidebar}
        </nav>
        <main className="flex-1 bg-white">{detail}</main>
      </div>
    );
  }

  return (
    <div className="h-screen">
      {showDetail ? (
        <main className="h-full bg-white">{detail}</main>
      ) : (
        <nav aria-label="Notes list" className="h-full bg-gray-50">
          {sidebar}
        </nav>
      )}
    </div>
  );
}
