import { useState } from 'react';
import { useRouter } from 'next/router';
import invariant from 'tiny-invariant';
import { Nullable, LegacyOrderingCriterion, LegacyOrderingDirection } from '@/lib/types/common';
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
import { ListHeadline, ListItem } from './parts';

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
          }
          if (isRegExp(value)) {
            invariant(isOneOf(key, ['id', 'title', 'memo']));
            return item[key].match(value);
          }
          return item[key] === value;
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

  const midnightThisYear = dayjs().startOf('year');
  const midnightToday = dayjs().startOf('day');
  const midnightTomorrow = midnightToday.add(1, 'day');
  const midnightAfter2Days = midnightToday.add(2, 'day');

  const compareByStoredCriterion = (
    {
      criterion,
      direction,
    }: {
      criterion: LegacyOrderingCriterion;
      direction: LegacyOrderingDirection;
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
    } else if (generalSettings.moveImportantTask) {
      dispatch(markAsImportantWithOrderingFlag(id));
    } else {
      dispatch(markAsImportant(id));
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
    <div className="relative mx-2">
      <ListHeadline
        title={title}
        isCollapsible={isCollapsible}
        isCollapsed={isCollapsed}
        onClick={() => isCollapsible && setIsCollapsed(!isCollapsed)}
      />

      {!isCollapsed &&
        filteredTodoItems.map(
          ({
            id,
            title: taskTitle,
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

                deadlineElement = (
                  <span>
                    지연,{' '}
                    {dayjs(deadline, 'x').format(
                      deadline < Number(midnightThisYear.format('x'))
                        ? 'YYYY년 M월 D일, ddd'
                        : 'M월 D일, ddd',
                    )}
                  </span>
                );
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
              <ListItem
                key={id}
                baseColor={settingsPerPage.themeColor}
                title={taskTitle}
                metadata={[
                  { key: 'todayTask', value: isMarkedAsTodayTask && !isHideTodayIndicator },
                  {
                    key: 'subStepProgress',
                    value: {
                      completedCount: completedSubSteps.length,
                      totalCount: subSteps.length,
                    },
                  },
                  {
                    key: 'deadline',
                    value: {
                      timestamp: deadline,
                      className: deadlineTextColor,
                      element: deadlineElement,
                    },
                  },
                  { key: 'memo', value: memo },
                ]}
                isActive={id === focusedTaskId}
                isComplete={isComplete}
                isImportant={isImportant}
                onToggleCheck={() =>
                  dispatch(isComplete ? markAsIncomplete(id) : markAsCompleteWithOrderingFlag(id))
                }
                onClick={() => dispatch(openDetailPanel(id))}
                onToggleStar={() => importantHandler({ id, isImportant })}
              />
            );
          },
        )}
    </div>
  );
}
