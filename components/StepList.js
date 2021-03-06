import { useState } from 'react';
import classNames from 'classnames/bind';
import { useDispatch, useSelector } from 'react-redux';
import { openDetailPanel, updateSubStep } from '@/store/todoSlice';
import styles from './TaskList.module.scss'; // shared

const cx = classNames.bind(styles);

export default function StepList({
  title = '단계',
  isCollapsible = true,
  isCollapsedInitially = false,
  isHideForEmptyList = false,
  isHideCompletedItems = false,
  filter = {},
}) {
  const dispatch = useDispatch();
  const filteredTodoItems = useSelector(
    ({ todo: state }) => state.todoItems
      .map((item) => {
        return {
          ...item,
          subSteps: item.subSteps.filter((step) => Object.entries(filter).every(([ key, value ]) => {
            if (value?.constructor === RegExp) {
              return step[key].match(value);
            }
            else {
              return step[key] === value;
            }
          })),
        };
      })
      .filter((item) => (item.subSteps.length > 0))
      .filter((item) => !(item.isComplete && isHideCompletedItems))
  );
  const filteredTodoSteps = filteredTodoItems.reduce((accumulator, currentItem) => [
    ...accumulator,
    ...currentItem.subSteps.map((step) => ({
      ...step,
      taskId: currentItem.id,
      taskTitle: currentItem.title,
    })),
  ], []);
  const focusedTaskId = useSelector(({ todo: state }) => state.focusedTaskId);
  const [ isCollapsed, setIsCollapsed ] = useState(isCollapsedInitially || false);

  filteredTodoSteps.sort((former, latter) => (latter.createdAt - former.createdAt));

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
      >
        <div className={cx('headline-body')}>
          <span className={cx('icon-wrapper')}>
            {isCollapsed ? (
              <i className="fas fa-chevron-right"></i>
            ) : (
              <i className="fas fa-chevron-down"></i>
            )}
          </span>
          <span className={cx('headline-title')}>{title ?? '작업'}</span>
        </div>
      </div>

      {filteredTodoSteps.map(({
        id,
        title,
        isComplete,
        taskId,
        taskTitle,
      }) => (
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
                'text-blue-500',
              )}
              title={isComplete ? '완료되지 않음으로 표시' : '완료됨으로 표시'}
              onClick={() => dispatch(updateSubStep({
                taskId,
                stepId: id,
                isComplete: !isComplete,
              }))}
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
              onClick={() => dispatch(openDetailPanel(taskId))}
            >
              <div className={cx('item-title')}>{title}</div>
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
