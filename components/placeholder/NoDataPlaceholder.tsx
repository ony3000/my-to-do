import Image from 'next/image';

export default function NoDataPlaceholder() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center overflow-hidden text-center">
      <div className="-mb-6 flex flex-col items-center">
        <a
          className="aspect-w-1 aspect-h-1 inline-flex w-[400px]"
          href="https://storyset.com/data"
          target="_blank"
          rel="noreferrer"
        >
          <Image
            src="/images/no_data.svg"
            title="Illustration by Freepik Storyset"
            alt="&ldquo;No Data&rdquo; Illustration"
            width={400}
            height={400}
          />
        </a>
      </div>
      <div className="relative mb-16 px-12">모두 검색해 보았지만 작업을 찾을 수 없습니다.</div>
    </div>
  );
}
