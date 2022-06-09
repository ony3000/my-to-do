import Head from 'next/head';
import classNames from 'classnames/bind';
import styles from './inbox.module.scss'; // shared
import { useAppSelector } from '@/hooks/index';
import PageToolbar from '@/components/PageToolbar';
import TaskInput from '@/components/TaskInput';
import TaskList from '@/components/TaskList';

const cx = classNames.bind(styles);

export default function Important() {
  const settingsPerPage = useAppSelector(({ todo: state }) => state.pageSettings['important']);

  return (
    <main className={cx('main')}>
      <Head>
        <title>중요 - To Do</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <PageToolbar
        title="중요"
      />

      <div className={cx('body')}>
        <div className={cx('input-section')}>
          <TaskInput
            itemProps={{
              isImportant: true,
            }}
          />
        </div>

        <div className={cx('list-section')}>
          <TaskList
            title={null}
            isCollapsible={false}
            isHideCompletedItems={settingsPerPage.isHideCompletedItems}
            filter={{
              isImportant: true,
            }}
          />

          <div className={cx('list-background')} />
        </div>
      </div>
    </main>
  );
}
