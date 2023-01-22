import Image from 'next/image';

export default function AppSplash() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center pb-[100px] pt-40">
      <Image className="my-auto" src="/images/todo_check.png" alt="" width={128} height={128} />

      <span className="h-[60px] w-[60px] animate-spin rounded-full border-2 border-solid border-transparent border-t-blue-500">
        <span className="sr-only">Loading...</span>
      </span>
    </main>
  );
}
