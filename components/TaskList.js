import { useState } from 'react';
import classNames from 'classnames/bind';
import { useSelector, useDispatch } from 'react-redux';
import { markAsComplete, markAsIncomplete, markAsImportant, markAsUnimportant } from '../store/todoSlice';
import dayjs from '../plugins/dayjs';
import styles from './TaskList.module.scss';

const cx = classNames.bind(styles);

export default function TaskList({
  title = '작업',
  isCollapsible = true,
  isCollapsedInitially = false,
  isHideForEmptyList = false,
  isHideTodayIndicator = false,
  filter = {},
}) {
  const [ isCollapsed, setIsCollapsed ] = useState(isCollapsedInitially || false);
  const todoItems = useSelector(({ todo: state }) => state.todoItems.filter((item) => Object.keys(filter).every((key) => {
    if (key === 'deadline') {
      const { $gt, $gte, $lt, $lte } = filter.deadline;

      return (
        item.deadline > ($gt ?? -Infinity)
          && item.deadline >= ($gte ?? -Infinity)
          && item.deadline < ($lt ?? Infinity)
          && item.deadline <= ($lte ?? Infinity)
      );
    }
    else {
      return item[key] === filter[key];
    }
  })));
  const dispatch = useDispatch();

  const midnightToday = dayjs().startOf('day');
  const midnightTomorrow = midnightToday.add(1, 'day');
  const midnightAfter2Days = midnightToday.add(2, 'day');

  return isHideForEmptyList && todoItems.length === 0 ? null : (
    <div className={cx('container')}>
      <div
        className={cx(
          'headline',
          { 'is-collapsible': isCollapsible },
          { 'is-collapsed': isCollapsed },
        )}
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className={cx('headline-body')}>
          <span className={cx('icon-wrapper')}>
            {isCollapsed ? (
              <i className="fas fa-chevron-right"></i>
            ) : (
              <i className="fas fa-chevron-down"></i>
            )}
          </span>
          <span className={cx('headline-title')}>{title}</span>
        </div>
      </div>

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
          if (deadline < Number(midnightToday.format('x'))) {
            deadlineElement = <span>지연, {dayjs(deadline, 'x').format('M월 D일, ddd')}</span>;
          }
          else if (deadline < Number(midnightTomorrow.format('x'))) {
            deadlineElement = <span>오늘까지</span>;
          }
          else if (deadline < Number(midnightAfter2Days.format('x'))) {
            deadlineElement = <span>내일까지</span>;
          }
          else {
            deadlineElement = <span>{dayjs(deadline, 'x').format('M월 D일, ddd')}까지</span>;
          }
        }

        return (
          <div
            key={id}
            className={cx('item')}
          >
            <div className={cx('item-body')}>
              {/* 테마 색상 */}
              <button
                className={cx('item-button', 'is-left')}
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
                  {isMarkedAsTodayTask && !isHideTodayIndicator ? (
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
                className={cx('item-button', 'is-right')}
                title={isImportant ? '중요도를 제거합니다.' : '작업을 중요로 표시합니다.'}
                onClick={() => dispatch(
                  isImportant ? markAsUnimportant(id) : markAsImportant(id)
                )}
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
  );
}
