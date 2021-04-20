import Head from 'next/head';
import classNames from 'classnames/bind';
import styles from './inbox.module.scss'; // shared
import PageToolbar from '@/components/PageToolbar';
import TaskInput from '@/components/TaskInput';
import TaskList from '@/components/TaskList';

const cx = classNames.bind(styles);

export default function Myday() {
  return (
    <main className={cx('main')}>
      <Head>
        <title>오늘 할 일 - To Do</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <PageToolbar
        title="오늘 할 일"
        displayToday={true}
      />

      <div className={cx('body')}>
        <div className={cx('input-section')}>
          <TaskInput
            itemProps={{
              isMarkedAsTodayTask: true,
            }}
          />
        </div>

        <div className={cx('list-section')}>
          <TaskList
            isCollapsible={false}
            isHideTodayIndicator={true}
            filter={{
              isComplete: false,
              isMarkedAsTodayTask: true,
            }}
          />

          <TaskList
            title="완료됨"
            isHideTodayIndicator={true}
            filter={{
              isComplete: true,
              isMarkedAsTodayTask: true,
            }}
          />

          <div className={cx('list-background')} />
        </div>
      </div>
    </main>
  );
}
