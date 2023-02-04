import Head from 'next/head';
import dayjs from '@/lib/plugins/dayjs';
import { useAppSelector } from '@/lib/hooks/index';
import { PageContainer, PageBody, TaskInputSection, TaskListSection } from '@/components/layout';
import { PageToolbar } from '@/components/toolbar';
import { TaskInput } from '@/components/input';
import { TaskList } from '@/components/list';

export default function Planned() {
  const settingsPerPage = useAppSelector(({ todo: state }) => state.pageSettings.planned);

  const midnightToday = dayjs().startOf('day');
  const midnightTomorrow = midnightToday.add(1, 'day');
  const midnightAfter2Days = midnightToday.add(2, 'day');
  const midnightAfter6Days = midnightToday.add(6, 'day');
  const midnightAfter7Days = midnightToday.add(7, 'day');

  return (
    <PageContainer>
      <Head>
        <title>계획된 일정 - To Do</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <PageToolbar title="계획된 일정" />

      <PageBody>
        <TaskInputSection>
          <TaskInput
            placeholder="기한이 오늘인 작업 추가"
            itemProps={{
              deadline: Number(midnightTomorrow.format('x')) - 1,
            }}
          />
        </TaskInputSection>

        <TaskListSection>
          <TaskList
            title="이전"
            isCollapsedInitially
            isHideForEmptyList
            isHideCompletedItems={settingsPerPage.isHideCompletedItems}
            filter={{
              isComplete: false,
              deadline: {
                $lt: Number(midnightToday.format('x')),
              },
            }}
          />

          <TaskList
            title="오늘"
            isHideForEmptyList
            isHideCompletedItems={settingsPerPage.isHideCompletedItems}
            filter={{
              deadline: {
                $gte: Number(midnightToday.format('x')),
                $lt: Number(midnightTomorrow.format('x')),
              },
            }}
          />

          <TaskList
            title="내일"
            isHideForEmptyList
            isHideCompletedItems={settingsPerPage.isHideCompletedItems}
            filter={{
              deadline: {
                $gte: Number(midnightTomorrow.format('x')),
                $lt: Number(midnightAfter2Days.format('x')),
              },
            }}
          />

          <TaskList
            title={`${midnightAfter2Days.format('M월 D일, ddd')} ~ ${midnightAfter6Days.format(
              'M월 D일, ddd',
            )}`}
            isHideForEmptyList
            isHideCompletedItems={settingsPerPage.isHideCompletedItems}
            filter={{
              deadline: {
                $gte: Number(midnightAfter2Days.format('x')),
                $lt: Number(midnightAfter7Days.format('x')),
              },
            }}
          />

          <TaskList
            title="나중에"
            isHideForEmptyList
            isHideCompletedItems={settingsPerPage.isHideCompletedItems}
            filter={{
              deadline: {
                $gte: Number(midnightAfter7Days.format('x')),
              },
            }}
          />
        </TaskListSection>
      </PageBody>
    </PageContainer>
  );
}
