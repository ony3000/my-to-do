import { useState } from 'react';
import { useRouter } from 'next/router';
import invariant from 'tiny-invariant';
import classNames from 'classnames/bind';
import { Dict, Nullable, OrderingCriterion, OrderingDirection } from '@/lib/types/common';
import { isRegExp, isOneOf } from '@/lib/types/guard';
import { TodoItem, SettingsPerPage, FilteringCondition } from '@/lib/types/store/todoSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks/index';
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
} from '@/lib/store/todoSlice';
import dayjs from '@/lib/plugins/dayjs';
import styles from './TaskList.module.scss';

const cx = classNames.bind(styles);

type TaskListProps = {
  title?: Nullable<string>;
  isCollapsible?: boolean;
  isCollapsedInitially?: boolean;
  isHideForEmptyList?: boolean;
  isHideTodayIndicator?: boolean;
  isHideCompletedItems?: boolean;
  filter?: {
    [K in keyof TodoItem]?: FilteringCondition<TodoItem[K]>;
  };
};

export default function TaskList({
  title = '작업',
  isCollapsible = true,
  isCollapsedInitially = false,
  isHideForEmptyList = false,
  isHideTodayIndicator = false,
  isHideCompletedItems = false,
  filter = {},
}: TaskListProps) {
  const router = useRouter();
  const pageKey = router.pathname.replace(/^\/tasks\/?/, '') || 'inbox';

  invariant(
    isOneOf(pageKey, [
      'myday',
      'important',
      'planned',
      'all',
      'completed',
      'inbox',
      'search/[keyword]',
    ]),
  );

  const dispatch = useAppDispatch();
  const filteredTodoItems = useAppSelector(({ todo: state }) =>
    state.todoItems
      .filter((item) =>
        Object.entries(filter).every(([key, value]) => {
          invariant(
            isOneOf(key, [
              'id',
              'title',
              'isComplete',
              'createdAt',
              'subSteps',
              'isImportant',
              'isMarkedAsTodayTask',
              'deadline',
              'memo',
              'completedAt',
              'markedAsImportantAt',
              'markedAsTodayTaskAt',
            ]),
          );
          if (key === 'deadline') {
            const { $gt, $gte, $lt, $lte } = filter.deadline ?? {};

            return (
              item.deadline &&
              item.deadline > ($gt ?? -Infinity) &&
              item.deadline >= ($gte ?? -Infinity) &&
              item.deadline < ($lt ?? Infinity) &&
              item.deadline <= ($lte ?? Infinity)
            );
          } else if (isRegExp(value)) {
            invariant(isOneOf(key, ['id', 'title', 'memo']));
            return item[key].match(value);
          } else {
            return item[key] === value;
          }
        }),
      )
      .filter((item) => !(item.isComplete && isHideCompletedItems)),
  );
  const generalSettings = useAppSelector(({ todo: state }) => state.settings.general);
  const settingsPerPage = useAppSelector<SettingsPerPage>(
    ({ todo: state }) => state.pageSettings[pageKey],
  );
  const focusedTaskId = useAppSelector(({ todo: state }) => state.focusedTaskId);
  const [isCollapsed, setIsCollapsed] = useState(isCollapsedInitially || false);

  const midnightToday = dayjs().startOf('day');
  const midnightTomorrow = midnightToday.add(1, 'day');
  const midnightAfter2Days = midnightToday.add(2, 'day');

  const compareByStoredCriterion = (
    {
      criterion,
      direction,
    }: {
      criterion: OrderingCriterion;
      direction: OrderingDirection;
    },
    former: TodoItem,
    latter: TodoItem,
  ) => {
    switch (criterion) {
      case IMPORTANCE:
        return (
          (Number(latter.isImportant) - Number(former.isImportant)) *
          (direction === ASCENDING ? -1 : 1)
        );
      case DEADLINE:
        return (
          Number(!!latter.deadline) - Number(!!former.deadline) ||
          (Number(former.deadline) - Number(latter.deadline)) *
            (direction === DESCENDING ? -1 : 1) ||
          former.createdAt - latter.createdAt
        );
      case MYDAY:
        return (
          (Number(latter.isMarkedAsTodayTask) - Number(former.isMarkedAsTodayTask)) *
          (direction === ASCENDING ? -1 : 1)
        );
      case TITLE:
        return former.title.localeCompare(latter.title) * (direction === DESCENDING ? -1 : 1);
      case CREATION_DATE:
        return (latter.createdAt - former.createdAt) * (direction === ASCENDING ? -1 : 1);
      default:
        return false;
    }
  };
  const importantHandler = ({ id, isImportant }: { id: string; isImportant: boolean }) => {
    if (isImportant) {
      dispatch(markAsUnimportant(id));
    } else {
      if (generalSettings.moveImportantTask) {
        dispatch(markAsImportantWithOrderingFlag(id));
      } else {
        dispatch(markAsImportant(id));
      }
    }
  };

  switch (pageKey) {
    case 'myday':
      filteredTodoItems.sort(
        (former, latter) =>
          (settingsPerPage.ordering
            ? compareByStoredCriterion(settingsPerPage.ordering, former, latter)
            : false) ||
          Number(latter.markedAsImportantAt || latter.markedAsTodayTaskAt) -
            Number(former.markedAsImportantAt || former.markedAsTodayTaskAt),
      );
      break;
    case 'planned':
      filteredTodoItems.sort(
        (former, latter) =>
          Number(former.deadline) - Number(latter.deadline) || former.createdAt - latter.createdAt,
      );
      break;
    case 'all':
      filteredTodoItems.sort(
        (former, latter) =>
          (latter.markedAsImportantAt || latter.createdAt) -
          (former.markedAsImportantAt || former.createdAt),
      );
      break;
    case 'completed':
      filteredTodoItems.sort(
        (former, latter) => Number(latter.completedAt) - Number(former.completedAt),
      );
      break;
    case 'inbox':
      filteredTodoItems.sort(
        (former, latter) =>
          (settingsPerPage.ordering
            ? compareByStoredCriterion(settingsPerPage.ordering, former, latter)
            : false) ||
          (latter.markedAsImportantAt || latter.createdAt) -
            (former.markedAsImportantAt || former.createdAt),
      );
      break;
    default:
      filteredTodoItems.sort((former, latter) => latter.createdAt - former.createdAt);
  }

  return isHideForEmptyList && filteredTodoItems.length === 0 ? null : (
    <div className={cx('container')}>
      <div
        className={cx(
          'headline',
          { 'is-visible': title !== null },
          { 'is-collapsible': isCollapsible },
          { 'is-collapsed': isCollapsed },
        )}
        onClick={() => isCollapsible && setIsCollapsed(!isCollapsed)}
      >
        <div className={cx('headline-body')}>
          <span className={cx('icon-wrapper')}>
            {isCollapsed ? (
              <i className="fas fa-chevron-right" />
            ) : (
              <i className="fas fa-chevron-down" />
            )}
          </span>
          <span className={cx('headline-title')}>{title ?? '작업'}</span>
        </div>
      </div>

      {filteredTodoItems.map(
        ({ id, title, isComplete, subSteps, isImportant, isMarkedAsTodayTask, deadline, memo }) => {
          const completedSubSteps = subSteps.filter((step) => step.isComplete);

          let deadlineTextColor = 'text-gray-500';
          let deadlineElement = null;

          if (deadline) {
            if (deadline < Number(midnightToday.format('x'))) {
              if (!isComplete) {
                deadlineTextColor = 'text-red-600';
              }

              deadlineElement = <span>지연, {dayjs(deadline, 'x').format('M월 D일, ddd')}</span>;
            } else if (deadline < Number(midnightTomorrow.format('x'))) {
              if (!isComplete) {
                deadlineTextColor = 'text-blue-500';
              }

              deadlineElement = <span>오늘까지</span>;
            } else if (deadline < Number(midnightAfter2Days.format('x'))) {
              deadlineElement = <span>내일까지</span>;
            } else {
              deadlineElement = <span>{dayjs(deadline, 'x').format('M월 D일, ddd')}까지</span>;
            }
          }

          return (
            <div key={id} className={cx('item', { 'is-active': id === focusedTaskId })}>
              <div className={cx('item-body')}>
                <button
                  className={cx(
                    'item-button',
                    'is-left',
                    `text-${settingsPerPage.themeColor ? settingsPerPage.themeColor : 'blue'}-500`,
                  )}
                  title={isComplete ? '완료되지 않음으로 표시' : '완료됨으로 표시'}
                  onClick={() =>
                    dispatch(isComplete ? markAsIncomplete(id) : markAsCompleteWithOrderingFlag(id))
                  }
                >
                  <span className={cx('icon-wrapper')}>
                    {isComplete ? (
                      <i className="fas fa-check-circle" />
                    ) : (
                      <i className="far fa-circle" />
                    )}
                    <span className="sr-only">
                      {isComplete ? '완료되지 않음으로 표시' : '완료됨으로 표시'}
                    </span>
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
                        <span>
                          {completedSubSteps.length}/{subSteps.length}
                        </span>
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
                    isImportant
                      ? `text-${
                          settingsPerPage.themeColor ? settingsPerPage.themeColor : 'blue'
                        }-500`
                      : 'text-gray-400 hover:text-black',
                  )}
                  title={isImportant ? '중요도를 제거합니다.' : '작업을 중요로 표시합니다.'}
                  onClick={() =>
                    importantHandler({
                      id,
                      isImportant,
                    })
                  }
                >
                  <span className={cx('icon-wrapper')}>
                    {isImportant ? <i className="fas fa-star" /> : <i className="far fa-star" />}
                    <span className="sr-only">
                      {isImportant ? '중요도를 제거합니다.' : '작업을 중요로 표시합니다.'}
                    </span>
                  </span>
                </button>
              </div>
            </div>
          );
        },
      )}
    </div>
  );
}
