import Head from 'next/head';
import classNames from 'classnames/bind';
import dayjs from '@/plugins/dayjs';
import styles from './inbox.module.scss'; // shared
import TaskInput from '@/components/TaskInput';
import TaskList from '@/components/TaskList';

const cx = classNames.bind(styles);

export default function Myday() {
  const midnightToday = dayjs().startOf('day');

  return (
    <main className={cx('main')}>
      <Head>
        <title>오늘 할 일 - To Do</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div
        className={cx('toolbar')}
        style={{
          height: 'auto',
          minHeight: 60,
          alignItems: 'flex-start',
        }}
      >
        <div
          className={cx('toolbar-headline')}
          style={{
            margin: '3px 0',
          }}
        >
          <div className={cx('toolbar-title-container')}>
            {/* 테마 색상 */}
            <h1 className={cx('list-title')}>오늘 할 일</h1>

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

          <div
            style={{
              padding: '0 8px 4px',
              fontSize: 12,
              fontWeight: 200,
            }}
          >
            {midnightToday.format('M월 D일, dddd')}
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
            style={{
              margin: '8px 0',
            }}
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
          <TaskInput
            itemProps={{
              isMarkedAsTodayTask: true,
            }}
          />
        </div>

        <div
          className={cx('list-section')}
          style={{
            maxHeight: 'calc(100vh - 182px)',
          }}
        >
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
