import Image from 'next/image';

export default function NoDataPlaceholder() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden justify-center items-center text-center">
      <div className="flex flex-col items-center -mb-6">
        <a
          className="inline-flex aspect-w-1 aspect-h-1"
          href="https://storyset.com/data"
          target="_blank"
          rel="noreferrer"
          style={{
            width: 400,
          }}
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
      <div className="relative px-12 mb-16">모두 검색해 보았지만 작업을 찾을 수 없습니다.</div>
    </div>
  );
}
