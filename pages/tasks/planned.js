import Head from 'next/head';
import classNames from 'classnames/bind';
import { useDispatch, useSelector } from 'react-redux';
import { openListOption } from '@/store/todoSlice';
import dayjs from '@/plugins/dayjs';
import styles from './inbox.module.scss'; // shared
import ListOption from '@/components/ListOption';
import TaskInput from '@/components/TaskInput';
import TaskList from '@/components/TaskList';

const cx = classNames.bind(styles);

export default function Planned() {
  const dispatch = useDispatch();
  const isActiveListOption = useSelector(({ todo: state }) => state.isActiveListOption);

  const midnightToday = dayjs().startOf('day');
  const midnightTomorrow = midnightToday.add(1, 'day');
  const midnightAfter2Days = midnightToday.add(2, 'day');
  const midnightAfter6Days = midnightToday.add(6, 'day');
  const midnightAfter7Days = midnightToday.add(7, 'day');

  return (
    <main className={cx('main')}>
      <Head>
        <title>계획된 일정 - To Do</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={cx('toolbar')}>
        <div className={cx('toolbar-headline')}>
          <div className={cx('toolbar-title-container')}>
            {/* 테마 색상 */}
            <h1 className={cx('list-title')}>계획된 일정</h1>

            {/* gray-500 색상 고정 */}
            <button
              className={cx('toolbar-button')}
              title="목록 옵션"
              onClick={(event) => !isActiveListOption && dispatch(openListOption({
                event,
                selector: `.${cx('toolbar-button')}`,
              }))}
            >
              <span className={cx('icon-wrapper')}>
                <i className="fas fa-ellipsis-h"></i>
                <span className="sr-only">목록 옵션</span>
              </span>
            </button>

            <ListOption />
          </div>
        </div>
      </div>

      <div className={cx('body')}>
        <div className={cx('input-section')}>
          <TaskInput
            placeholder="기한이 오늘인 작업 추가"
            itemProps={{
              deadline: Number(midnightTomorrow.format('x')) - 1,
            }}
          />
        </div>

        <div className={cx('list-section')}>
          <TaskList
            title="이전"
            isCollapsedInitially={true}
            isHideForEmptyList={true}
            filter={{
              isComplete: false,
              deadline: {
                $lt: Number(midnightToday.format('x')),
              },
            }}
          />

          <TaskList
            title="오늘"
            isHideForEmptyList={true}
            filter={{
              deadline: {
                $gte: Number(midnightToday.format('x')),
                $lt: Number(midnightTomorrow.format('x')),
              },
            }}
          />

          <TaskList
            title="내일"
            isHideForEmptyList={true}
            filter={{
              deadline: {
                $gte: Number(midnightTomorrow.format('x')),
                $lt: Number(midnightAfter2Days.format('x')),
              },
            }}
          />

          <TaskList
            title={`${midnightAfter2Days.format('M월 D일, ddd')} ~ ${midnightAfter6Days.format('M월 D일, ddd')}`}
            isHideForEmptyList={true}
            filter={{
              deadline: {
                $gte: Number(midnightAfter2Days.format('x')),
                $lt: Number(midnightAfter7Days.format('x')),
              },
            }}
          />

          <TaskList
            title="나중에"
            isHideForEmptyList={true}
            filter={{
              deadline: {
                $gte: Number(midnightAfter7Days.format('x')),
              },
            }}
          />

          <div className={cx('list-background')} />
        </div>
      </div>
    </main>
  );
}
