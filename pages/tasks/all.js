import Head from 'next/head';
import classNames from 'classnames/bind';
import styles from './inbox.module.scss'; // shared
import PageToolbar from '@/components/PageToolbar';
import TaskInput from '@/components/TaskInput';
import TaskList from '@/components/TaskList';

const cx = classNames.bind(styles);

export default function All() {
  return (
    <main className={cx('main')}>
      <Head>
        <title>모두 - To Do</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <PageToolbar
        title="모두"
      />

      <div className={cx('body')}>
        <div className={cx('input-section')}>
          <TaskInput />
        </div>

        <div className={cx('list-section')}>
          <TaskList
            filter={{
              isComplete: false,
            }}
          />

          <div className={cx('list-background')} />
        </div>
      </div>
    </main>
  );
}
