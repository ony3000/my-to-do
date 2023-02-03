import type { ComponentProps } from 'react';

export default function TaskListSection({ children }: ComponentProps<'div'>) {
  return (
    <div className="flex max-h-full flex-1 flex-col overflow-y-auto overflow-x-hidden">
      {children}
      <div className="mx-6 flex-1 bg-[linear-gradient(180deg,#e4e4e7_0_1px,#fff_1px)] bg-[length:100%_54px]" />
    </div>
  );
}
