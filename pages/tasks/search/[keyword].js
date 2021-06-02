import Head from 'next/head';
import { useRouter } from 'next/router';
import classNames from 'classnames/bind';
import { useSelector } from 'react-redux';
import styles from '../inbox.module.scss'; // shared
import PageToolbar from '@/components/PageToolbar';
import TaskList from '@/components/TaskList';
import StepList from '@/components/StepList';
import NoDataPlaceholder from '@/components/NoDataPlaceholder';

const cx = classNames.bind(styles);

export default function Search() {
  const router = useRouter();
  const pageKey = router.pathname.replace(/^\/tasks\/?/, '') || 'inbox';
  const todoItems = useSelector(({ todo: state }) => state.todoItems);
  const settingsPerPage = useSelector(({ todo: state }) => state.pageSettings[pageKey]);

  const { keyword = '' } = router.query;
  const trimmedKeyword = keyword.trim();
  const pattern = new RegExp(trimmedKeyword, 'i');
  const visibleTodoItems = todoItems.filter((item) => {
    const isKeywordMatched = item.title.match(pattern) || item.memo.match(pattern) || item.subSteps.some(({ title }) => title.match(pattern));

    return (settingsPerPage.isHideCompletedItems === false || !item.isComplete) && isKeywordMatched;
  });

  return (
    <main className={cx('main')}>
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
        <div className={cx('body')}>
          <div className={cx('list-section')}>
            <TaskList
              title="작업"
              isCollapsible={false}
              isHideForEmptyList={true}
              isHideCompletedItems={settingsPerPage.isHideCompletedItems}
              filter={{
                title: pattern,
              }}
            />

            <TaskList
              title="메모"
              isCollapsible={false}
              isHideForEmptyList={true}
              isHideCompletedItems={settingsPerPage.isHideCompletedItems}
              filter={{
                memo: pattern,
              }}
            />

            <StepList
              isCollapsible={false}
              isHideForEmptyList={true}
              isHideCompletedItems={settingsPerPage.isHideCompletedItems}
              filter={{
                title: pattern,
              }}
            />

            <div className={cx('list-background')} />
          </div>
        </div>
      )}
    </main>
  );
}
