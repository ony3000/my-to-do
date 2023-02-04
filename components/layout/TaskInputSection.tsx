import type { ComponentProps } from 'react';

export default function TaskInputSection({ children }: ComponentProps<'div'>) {
  return <div className="mx-2 h-[52px] px-4">{children}</div>;
}
