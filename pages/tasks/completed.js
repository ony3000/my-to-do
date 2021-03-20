import Head from 'next/head';
import classNames from 'classnames/bind';
import styles from './inbox.module.scss'; // shared
import TaskList from '../../components/TaskList';

const cx = classNames.bind(styles);

export default function Completed() {
  return (
    <main className={cx('main')}>
      <Head>
        <title>완료됨 - To Do</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={cx('toolbar')}>
        <div className={cx('toolbar-headline')}>
          <div className={cx('toolbar-title-container')}>
            {/* 테마 색상 */}
            <h1 className={cx('list-title')}>완료됨</h1>

            {/* gray-500 색상 고정 */}
            <button
              className={cx('toolbar-button')}
              title="목록 옵션"
              onClick={() => console.log('목록 옵션')}
            >
              <span className={cx('icon-wrapper')}>
                <i className="fas fa-ellipsis-h"></i>
                <span className="sr-only">목록 옵션</span>
              </span>
            </button>
          </div>
        </div>
      </div>

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
