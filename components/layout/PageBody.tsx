import type { ComponentProps } from 'react';

export default function PageBody({ children }: ComponentProps<'div'>) {
  return <div className="flex flex-1 flex-col overflow-hidden">{children}</div>;
}
