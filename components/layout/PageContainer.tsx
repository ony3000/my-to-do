import type { ComponentProps } from 'react';

export default function PageContainer({ children }: ComponentProps<'main'>) {
  return <main className="flex h-[calc(100vh-48px)] flex-col">{children}</main>;
}
