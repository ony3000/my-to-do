import Head from 'next/head';
import { useRouter } from 'next/router';
import invariant from 'tiny-invariant';
import { useAppSelector } from '@/lib/hooks/index';
import { PageContainer, PageBody, TaskListSection } from '@/components/layout';
import { PageToolbar } from '@/components/toolbar';
import { StepList, TaskList } from '@/components/list';
import { NoDataPlaceholder } from '@/components/placeholder';

export default function Search() {
  const router = useRouter();
  const pageKey = router.pathname.replace(/^\/tasks\/?/, '');

  invariant(pageKey === 'search/[keyword]');

  const todoItems = useAppSelector(({ todo: state }) => state.todoItems);
  const settingsPerPage = useAppSelector(({ todo: state }) => state.pageSettings[pageKey]);

  const { keyword = '' } = router.query as { keyword: string };
  const trimmedKeyword = keyword.trim();
  const pattern = new RegExp(trimmedKeyword, 'i');
  const visibleTodoItems = todoItems.filter((item) => {
    const isKeywordMatched =
      item.title.match(pattern) ||
      item.memo.match(pattern) ||
      item.subSteps.some(({ title }) => title.match(pattern));

    return (settingsPerPage.isHideCompletedItems === false || !item.isComplete) && isKeywordMatched;
  });

  return (
    <PageContainer>
      <Head>
        <title>&ldquo;{keyword}&rdquo; 검색 중 - To Do</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <PageToolbar
        title={`${String.fromCodePoint(8220)}${keyword}${String.fromCodePoint(8221)} 검색 중`}
      />

      {visibleTodoItems.length === 0 ? (
        <NoDataPlaceholder />
      ) : (
        <PageBody>
          <TaskListSection>
            <TaskList
              title="작업"
              isCollapsible={false}
              isHideForEmptyList
              isHideCompletedItems={settingsPerPage.isHideCompletedItems}
              filter={{
                title: pattern,
              }}
            />

            <TaskList
              title="메모"
              isCollapsible={false}
              isHideForEmptyList
              isHideCompletedItems={settingsPerPage.isHideCompletedItems}
              filter={{
                memo: pattern,
              }}
            />

            <StepList
              isCollapsible={false}
              isHideForEmptyList
              isHideCompletedItems={settingsPerPage.isHideCompletedItems}
              filter={{
                title: pattern,
              }}
            />
          </TaskListSection>
        </PageBody>
      )}
    </PageContainer>
  );
}
