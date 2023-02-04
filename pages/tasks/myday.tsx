import Head from 'next/head';
import { PageContainer, PageBody, TaskInputSection, TaskListSection } from '@/components/layout';
import { PageToolbar } from '@/components/toolbar';
import { OrderingIndicator } from '@/components/indicator';
import { TaskInput } from '@/components/input';
import { TaskList } from '@/components/list';

export default function Myday() {
  return (
    <PageContainer>
      <Head>
        <title>오늘 할 일 - To Do</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <PageToolbar title="오늘 할 일" displayToday />

      <PageBody>
        <OrderingIndicator />

        <TaskInputSection>
          <TaskInput
            itemProps={{
              isMarkedAsTodayTask: true,
            }}
          />
        </TaskInputSection>

        <TaskListSection>
          <TaskList
            title={null}
            isCollapsible={false}
            isHideTodayIndicator
            filter={{
              isComplete: false,
              isMarkedAsTodayTask: true,
            }}
          />

          <TaskList
            title="완료됨"
            isHideTodayIndicator
            filter={{
              isComplete: true,
              isMarkedAsTodayTask: true,
            }}
          />
        </TaskListSection>
      </PageBody>
    </PageContainer>
  );
}
