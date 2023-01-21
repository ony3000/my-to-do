import Head from 'next/head';
import classNames from 'classnames/bind';
import { PageToolbar } from '@/components/toolbar';
import { OrderingIndicator } from '@/components/indicator';
import { TaskInput } from '@/components/input';
import { TaskList } from '@/components/list';
import styles from './inbox.module.scss'; // shared

const cx = classNames.bind(styles);

export default function Myday() {
  return (
    <main className={cx('main')}>
      <Head>
        <title>오늘 할 일 - To Do</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <PageToolbar title="오늘 할 일" displayToday />

      <div className={cx('body')}>
        <OrderingIndicator />

        <div className={cx('input-section')}>
          <TaskInput
            itemProps={{
              isMarkedAsTodayTask: true,
            }}
          />
        </div>

        <div className={cx('list-section')}>
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

          <div className={cx('list-background')} />
        </div>
      </div>
    </main>
  );
}
