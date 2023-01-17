import Head from 'next/head';
import classNames from 'classnames/bind';
import styles from './inbox.module.scss'; // shared
import PageToolbar from '@/components/PageToolbar';
import TaskList from '@/components/list/TaskList';

const cx = classNames.bind(styles);

export default function Completed() {
  return (
    <main className={cx('main')}>
      <Head>
        <title>완료됨 - To Do</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <PageToolbar
        title="완료됨"
      />

      <div className={cx('body')}>
        <div className={cx('list-section')}>
          <TaskList
            filter={{
              isComplete: true,
            }}
          />

          <div className={cx('list-background')} />
        </div>
      </div>
    </main>
  );
}
