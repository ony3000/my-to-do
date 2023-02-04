import Head from 'next/head';
import { useAppSelector } from '@/lib/hooks/index';
import { PageContainer, PageBody, TaskInputSection, TaskListSection } from '@/components/layout';
import { PageToolbar } from '@/components/toolbar';
import { TaskInput } from '@/components/input';
import { TaskList } from '@/components/list';

export default function Important() {
  const settingsPerPage = useAppSelector(({ todo: state }) => state.pageSettings.important);

  return (
    <PageContainer>
      <Head>
        <title>중요 - To Do</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <PageToolbar title="중요" />

      <PageBody>
        <TaskInputSection>
          <TaskInput
            itemProps={{
              isImportant: true,
            }}
          />
        </TaskInputSection>

        <TaskListSection>
          <TaskList
            title={null}
            isCollapsible={false}
            isHideCompletedItems={settingsPerPage.isHideCompletedItems}
            filter={{
              isImportant: true,
            }}
          />
        </TaskListSection>
      </PageBody>
    </PageContainer>
  );
}
