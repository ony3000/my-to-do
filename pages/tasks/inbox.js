import Head from 'next/head';
import classNames from 'classnames/bind';
import styles from './inbox.module.scss';
import TaskInput from '../../components/TaskInput';
import TaskList from '../../components/TaskList';

const cx = classNames.bind(styles);

export default function Inbox() {
  return (
    <main className={cx('main')}>
      <Head>
        <title>Tasks - To Do</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={cx('toolbar')}>
        <div className={cx('toolbar-headline')}>
          <div className={cx('toolbar-title-container')}>
            {/* 테마 색상 */}
            <h1 className={cx('list-title')}>Tasks</h1>

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

        <div>
          {/* 테마 색상 */}
          <button
            className={cx(
              'toolbar-button',
              'transform',
              'rotate-90',
            )}
            title="정렬 기준"
            onClick={() => console.log('정렬 기준')}
          >
            <span className={cx('icon-wrapper')}>
              <i className="fas fa-exchange-alt"></i>
              <span className="sr-only">정렬 기준</span>
            </span>
          </button>
        </div>
      </div>

      <div className={cx('body')}>
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
