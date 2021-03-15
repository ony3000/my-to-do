import Head from 'next/head';
import classNames from 'classnames/bind';
import { useSelector, useDispatch } from 'react-redux';
import { markAsComplete, markAsIncomplete } from '../../store/todoSlice';
import dayjs from '../../plugins/dayjs';
import styles from './inbox.module.scss';
import TaskInput from '../../components/TaskInput';

const cx = classNames.bind(styles);

export default function Inbox() {
  const todoItems = useSelector(({ todo: state }) => state.todoItems);
  const dispatch = useDispatch();

  const midnightOfToday = dayjs().startOf('day');
  const midnightOfTomorrow = midnightOfToday.add(1, 'day');
  const midnightOfTheDayAfterTomorrow = midnightOfTomorrow.add(1, 'day');

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
          <div className={cx('list-container')}>
            {todoItems.map(({
              id,
              title,
              isComplete,
              subSteps,
              isImportant,
              isMarkedAsTodayTask,
              deadline,
              memo,
            }) => {
              const completedSubSteps = subSteps.filter((step) => step.isComplete);

              let deadlineElement = null;

              if (deadline) {
                if (deadline < Number(midnightOfToday.format('x'))) {
                  deadlineElement = <span>지연, {dayjs(deadline, 'x').format('M월 D일, ddd')}</span>;
                }
                else if (deadline < Number(midnightOfTomorrow.format('x'))) {
                  deadlineElement = <span>오늘까지</span>;
                }
                else if (deadline < Number(midnightOfTheDayAfterTomorrow.format('x'))) {
                  deadlineElement = <span>내일까지</span>;
                }
                else {
                  deadlineElement = <span>{dayjs(deadline, 'x').format('M월 D일, ddd')}까지</span>;
                }
              }

              return (
                <div
                  key={id}
                  className={cx('todo-item')}
                >
                  <div className={cx('todo-item-body')}>
                    {/* 테마 색상 */}
                    <button
                      className={cx('list-button', 'is-left')}
                      title={isComplete ? '완료되지 않음으로 표시' : '완료됨으로 표시'}
                      onClick={() => dispatch(
                        isComplete ? markAsIncomplete(id) : markAsComplete(id)
                      )}
                    >
                      <span className={cx('icon-wrapper')}>
                        {isComplete ? (
                          <i className="fas fa-check-circle"></i>
                        ) : (
                          <i className="far fa-circle"></i>
                        )}
                        <span className="sr-only">{isComplete ? '완료되지 않음으로 표시' : '완료됨으로 표시'}</span>
                      </span>
                    </button>

                    <button className={cx('item-summary')}>
                      <div className={cx('item-title')}>{title}</div>
                      <div className={cx('item-metadata')}>
                        {isMarkedAsTodayTask ? (
                          <span className={cx('meta-indicator')}>
                            <span className={cx('meta-icon-wrapper')}>
                              <i className="far fa-sun" />
                            </span>
                            <span>오늘 할 일</span>
                          </span>
                        ) : null}
                        {subSteps.length ? (
                          <span className={cx('meta-indicator')}>
                            <span>{completedSubSteps.length}/{subSteps.length}</span>
                          </span>
                        ) : null}
                        {deadline ? (
                          <span className={cx('meta-indicator')}>
                            {/* 기한이 지났으면 빨간색, 오늘까지면 파란색, 오늘 이후면 회색 */}
                            <span className={cx('meta-icon-wrapper')}>
                              <i className="far fa-calendar" />
                            </span>
                            {deadlineElement}
                          </span>
                        ) : null}
                        {memo ? (
                          <span className={cx('meta-indicator')}>
                            <span className={cx('meta-icon-wrapper')}>
                              <i className="far fa-sticky-note" />
                            </span>
                            <span>노트</span>
                          </span>
                        ) : null}
                      </div>
                    </button>

                    {/* 테마 색상 */}
                    <button
                      className={cx('list-button', 'is-right')}
                      title={isImportant ? '중요도를 제거합니다.' : '작업을 중요로 표시합니다.'}
                      onClick={() => console.log('toggle importance')}
                    >
                      <span className={cx('icon-wrapper')}>
                        {isImportant ? (
                          <i className="fas fa-star"></i>
                        ) : (
                          <i className="far fa-star"></i>
                        )}
                        <span className="sr-only">{isImportant ? '중요도를 제거합니다.' : '작업을 중요로 표시합니다.'}</span>
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className={cx('list-background')} />
        </div>
      </div>
    </main>
  );
}
