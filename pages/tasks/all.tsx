import Head from 'next/head';
import { PageContainer, PageBody, TaskInputSection, TaskListSection } from '@/components/layout';
import { PageToolbar } from '@/components/toolbar';
import { TaskInput } from '@/components/input';
import { TaskList } from '@/components/list';

export default function All() {
  return (
    <PageContainer>
      <Head>
        <title>모두 - To Do</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <PageToolbar title="모두" />

      <PageBody>
        <TaskInputSection>
          <TaskInput />
        </TaskInputSection>

        <TaskListSection>
          <TaskList
            filter={{
              isComplete: false,
            }}
          />
        </TaskListSection>
      </PageBody>
    </PageContainer>
  );
}
