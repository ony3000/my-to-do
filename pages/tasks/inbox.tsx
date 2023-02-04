import Head from 'next/head';
import { PageContainer, PageBody, TaskInputSection, TaskListSection } from '@/components/layout';
import { PageToolbar } from '@/components/toolbar';
import { OrderingIndicator } from '@/components/indicator';
import { TaskInput } from '@/components/input';
import { TaskList } from '@/components/list';

export default function Inbox() {
  return (
    <PageContainer>
      <Head>
        <title>Tasks - To Do</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <PageToolbar title="Tasks" />

      <PageBody>
        <OrderingIndicator />

        <TaskInputSection>
          <TaskInput />
        </TaskInputSection>

        <TaskListSection>
          <TaskList
            title={null}
            isCollapsible={false}
            filter={{
              isComplete: false,
            }}
          />

          <TaskList
            title="완료됨"
            filter={{
              isComplete: true,
            }}
          />
        </TaskListSection>
      </PageBody>
    </PageContainer>
  );
}
