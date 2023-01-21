import { useState } from 'react';
import invariant from 'tiny-invariant';
import classNames from 'classnames/bind';
import { Nullable } from '@/lib/types/common';
import { isRegExp, isOneOf } from '@/lib/types/guard';
import { TodoItemBase, TodoItem, FilteringCondition } from '@/lib/types/store/todoSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks/index';
import { openDetailPanel, updateSubStep } from '@/lib/store/todoSlice';
import styles from './TaskList.module.scss'; // shared

const cx = classNames.bind(styles);

type StepListProps = {
  title?: Nullable<string>;
  isCollapsible?: boolean;
  isCollapsedInitially?: boolean;
  isHideForEmptyList?: boolean;
  isHideCompletedItems?: boolean;
  filter?: {
    [K in keyof TodoItemBase]?: FilteringCondition<TodoItemBase[K]>;
  };
};

export default function StepList({
  title = '단계',
  isCollapsible = true,
  isCollapsedInitially = false,
  isHideForEmptyList = false,
  isHideCompletedItems = false,
  filter = {},
}: StepListProps) {
  const dispatch = useAppDispatch();
  const filteredTodoItems = useAppSelector(({ todo: state }) =>
    state.todoItems
      .map<TodoItem>((item) => ({
        ...item,
        subSteps: item.subSteps.filter((step) =>
          Object.entries(filter).every(([key, value]) => {
            invariant(isOneOf(key, ['id', 'title', 'isComplete', 'createdAt']));
            if (isRegExp(value)) {
              invariant(isOneOf(key, ['id', 'title']));
              return step[key].match(value);
            }
            return step[key] === value;
          }),
        ),
      }))
      .filter((item) => item.subSteps.length > 0)
      .filter((item) => !(item.isComplete && isHideCompletedItems)),
  );
  const filteredTodoSteps = filteredTodoItems.reduce<
    Array<TodoItemBase & { taskId: string; taskTitle: string }>
  >(
    (accumulator, currentItem) => [
      ...accumulator,
      ...currentItem.subSteps.map<TodoItemBase & { taskId: string; taskTitle: string }>((step) => ({
        ...step,
        taskId: currentItem.id,
        taskTitle: currentItem.title,
      })),
    ],
    [],
  );
  const focusedTaskId = useAppSelector(({ todo: state }) => state.focusedTaskId);
  const [isCollapsed, setIsCollapsed] = useState(isCollapsedInitially || false);

  filteredTodoSteps.sort((former, latter) => latter.createdAt - former.createdAt);

  return isHideForEmptyList && filteredTodoSteps.length === 0 ? null : (
    <div className={cx('container')}>
      <div
        className={cx(
          'headline',
          { 'is-visible': title !== null },
          { 'is-collapsible': isCollapsible },
          { 'is-collapsed': isCollapsed },
        )}
        onClick={() => isCollapsible && setIsCollapsed(!isCollapsed)}
        aria-hidden="true"
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

      {filteredTodoSteps.map(({ id, title: stepTitle, isComplete, taskId, taskTitle }) => (
        <div key={id} className={cx('item', { 'is-active': id === focusedTaskId })}>
          <div className={cx('item-body')}>
            <button
              type="button"
              className={cx('item-button', 'is-left', 'text-blue-500')}
              title={isComplete ? '완료되지 않음으로 표시' : '완료됨으로 표시'}
              onClick={() =>
                dispatch(
                  updateSubStep({
                    taskId,
                    stepId: id,
                    isComplete: !isComplete,
                  }),
                )
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
              type="button"
              className={cx('item-summary')}
              onClick={() => dispatch(openDetailPanel(taskId))}
            >
              <div className={cx('item-title')}>{stepTitle}</div>
              <div className={cx('item-metadata')}>
                <span className={cx('meta-indicator')}>
                  <span>{taskTitle}</span>
                </span>
              </div>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
