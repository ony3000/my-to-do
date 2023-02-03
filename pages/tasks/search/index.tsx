import Head from 'next/head';
import { PageContainer } from '@/components/layout';
import { PageToolbar } from '@/components/toolbar';
import { NoDataPlaceholder } from '@/components/placeholder';

export default function Search() {
  return (
    <PageContainer>
      <Head>
        <title>&ldquo;&rdquo; 검색 중 - To Do</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <PageToolbar title="&ldquo;&rdquo; 검색 중" />

      <NoDataPlaceholder />
    </PageContainer>
  );
}
