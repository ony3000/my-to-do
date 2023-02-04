import Head from 'next/head';
import { PageContainer, PageBody, TaskListSection } from '@/components/layout';
import { PageToolbar } from '@/components/toolbar';
import { TaskList } from '@/components/list';

export default function Completed() {
  return (
    <PageContainer>
      <Head>
        <title>완료됨 - To Do</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <PageToolbar title="완료됨" />

      <PageBody>
        <TaskListSection>
          <TaskList
            filter={{
              isComplete: true,
            }}
          />
        </TaskListSection>
      </PageBody>
    </PageContainer>
  );
}
