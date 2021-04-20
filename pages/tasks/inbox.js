import Head from 'next/head';
import classNames from 'classnames/bind';
import styles from './inbox.module.scss';
import PageToolbar from '@/components/PageToolbar';
import OrderingIndicator from '@/components/OrderingIndicator';
import TaskInput from '@/components/TaskInput';
import TaskList from '@/components/TaskList';

const cx = classNames.bind(styles);

export default function Inbox() {
  return (
    <main className={cx('main')}>
      <Head>
        <title>Tasks - To Do</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <PageToolbar
        title="Tasks"
      />

      <div className={cx('body')}>
        <OrderingIndicator />

        <div className={cx('input-section')}>
          <TaskInput />
        </div>

        <div className={cx('list-section')}>
          <TaskList
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

          <div className={cx('list-background')} />
        </div>
      </div>
    </main>
  );
}
