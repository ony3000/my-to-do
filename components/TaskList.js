import { useState } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames/bind';
import { useDispatch, useSelector } from 'react-redux';
import {
  IMPORTANCE,
  DEADLINE,
  MYDAY,
  TITLE,
  CREATION_DATE,
  ASCENDING,
  DESCENDING,
  openDetailPanel,
  markAsCompleteWithOrderingFlag,
  markAsIncomplete,
  markAsImportant,
  markAsImportantWithOrderingFlag,
  markAsUnimportant,
} from '@/store/todoSlice';
import dayjs from '@/plugins/dayjs';
import styles from './TaskList.module.scss';

const cx = classNames.bind(styles);

export default function TaskList({
  title = '작업',
  isCollapsible = true,
  isCollapsedInitially = false,
  isHideForEmptyList = false,
  isHideTodayIndicator = false,
  isHideCompletedItems = false,
  filter = {},
}) {
  const router = useRouter();
  const pageKey = router.pathname.replace(/^\/tasks\/?/, '') || 'inbox';
  const dispatch = useDispatch();
  const filteredTodoItems = useSelector(
    ({ todo: state }) => state.todoItems
      .filter((item) => Object.keys(filter).every((key) => {
        if (key === 'deadline') {
          const { $gt, $gte, $lt, $lte } = filter.deadline;

          return (
            item.deadline
              && item.deadline > ($gt ?? -Infinity)
              && item.deadline >= ($gte ?? -Infinity)
              && item.deadline < ($lt ?? Infinity)
              && item.deadline <= ($lte ?? Infinity)
          );
        }
        else {
          return item[key] === filter[key];
        }
      }))
      .filter((item) => !(item.isComplete && isHideCompletedItems))
  );
  const generalSettings = useSelector(({ todo: state }) => state.settings.general);
  const settingsPerPage = useSelector(({ todo: state }) => state.pageSettings[pageKey]);
  const focusedTaskId = useSelector(({ todo: state }) => state.focusedTaskId);
  const [ isCollapsed, setIsCollapsed ] = useState(isCollapsedInitially || false);

  const midnightToday = dayjs().startOf('day');
  const midnightTomorrow = midnightToday.add(1, 'day');
  const midnightAfter2Days = midnightToday.add(2, 'day');

  const compareByStoredCriterion = ({ criterion, direction }, former, latter) => {
    switch (criterion) {
      case IMPORTANCE:
        return (latter.isImportant - former.isImportant) * (direction === ASCENDING ? -1 : 1);
      case DEADLINE:
        return (
          (!!latter.deadline - !!former.deadline)
            || (former.deadline - latter.deadline) * (direction === DESCENDING ? -1 : 1)
            || former.createdAt - latter.createdAt
        );
      case MYDAY:
        return (latter.isMarkedAsTodayTask - former.isMarkedAsTodayTask) * (direction === ASCENDING ? -1 : 1);
      case TITLE:
        return (former.title.localeCompare(latter.title)) * (direction === DESCENDING ? -1 : 1);
      case CREATION_DATE:
        return (latter.createdAt - former.createdAt) * (direction === ASCENDING ? -1 : 1);
      default:
        return false;
    }
  };
  const importantHandler = ({ id, isImportant }) => {
    if (isImportant) {
      dispatch(markAsUnimportant(id));
    }
    else {
      if (generalSettings.moveImportantTask) {
        dispatch(markAsImportantWithOrderingFlag(id));
      }
      else {
        dispatch(markAsImportant(id));
      }
    }
  };

  switch (pageKey) {
    case 'myday':
      filteredTodoItems.sort((former, latter) => (
        (settingsPerPage.ordering ? compareByStoredCriterion(settingsPerPage.ordering, former, latter) : false)
          || (latter.markedAsImportantAt || latter.markedAsTodayTaskAt) - (former.markedAsImportantAt || former.markedAsTodayTaskAt)
      ));
      break;
    case 'planned':
      filteredTodoItems.sort((former, latter) => (
        former.deadline - latter.deadline || former.createdAt - latter.createdAt
      ));
      break;
    case 'all':
      filteredTodoItems.sort((former, latter) => (
        (latter.markedAsImportantAt || latter.createdAt) - (former.markedAsImportantAt || former.createdAt)
      ));
      break;
    case 'completed':
      filteredTodoItems.sort((former, latter) => (latter.completedAt - former.completedAt));
      break;
    case 'inbox':
      filteredTodoItems.sort((former, latter) => (
        (settingsPerPage.ordering ? compareByStoredCriterion(settingsPerPage.ordering, former, latter) : false)
          || (latter.markedAsImportantAt || latter.createdAt) - (former.markedAsImportantAt || former.createdAt)
      ));
      break;
    default:
      filteredTodoItems.sort((former, latter) => (latter.createdAt - former.createdAt));
  }

  return isHideForEmptyList && filteredTodoItems.length === 0 ? null : (
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

      {filteredTodoItems.map(({
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

        let deadlineTextColor = 'text-gray-500';
        let deadlineElement = null;

        if (deadline) {
          if (deadline < Number(midnightToday.format('x'))) {
            if (!isComplete) {
              deadlineTextColor = 'text-red-600';
            }

            deadlineElement = <span>지연, {dayjs(deadline, 'x').format('M월 D일, ddd')}</span>;
          }
          else if (deadline < Number(midnightTomorrow.format('x'))) {
            if (!isComplete) {
              deadlineTextColor = 'text-blue-500';
            }

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
            className={cx(
              'item',
              { 'is-active': id === focusedTaskId },
            )}
          >
            <div className={cx('item-body')}>
              <button
                className={cx(
                  'item-button',
                  'is-left',
                  `text-${settingsPerPage.themeColor ? settingsPerPage.themeColor : 'blue'}-500`,
                )}
                title={isComplete ? '완료되지 않음으로 표시' : '완료됨으로 표시'}
                onClick={() => dispatch(
                  isComplete ? markAsIncomplete(id) : markAsCompleteWithOrderingFlag(id)
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

              <button
                className={cx('item-summary')}
                onClick={() => dispatch(openDetailPanel(id))}
              >
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
                    <span className={cx('meta-indicator', deadlineTextColor)}>
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

              <button
                className={cx(
                  'item-button',
                  'is-right',
                  (
                    isImportant
                      ? `text-${settingsPerPage.themeColor ? settingsPerPage.themeColor : 'blue'}-500`
                      : 'text-gray-400 hover:text-black'
                  ),
                )}
                title={isImportant ? '중요도를 제거합니다.' : '작업을 중요로 표시합니다.'}
                onClick={() => importantHandler({
                  id,
                  isImportant,
                })}
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
