import { useState } from 'react';
import invariant from 'tiny-invariant';
import { Nullable } from '@/lib/types/common';
import { isRegExp, isOneOf } from '@/lib/types/guard';
import { TodoItemBase, TodoItem, FilteringCondition } from '@/lib/types/store/todoSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks/index';
import { openDetailPanel, updateSubStep } from '@/lib/store/todoSlice';
import { ListHeadline, ListItem } from './parts';

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
    <div className="relative mx-2">
      <ListHeadline
        title={title}
        isCollapsible={isCollapsible}
        isCollapsed={isCollapsed}
        onClick={() => isCollapsible && setIsCollapsed(!isCollapsed)}
      />

      {!isCollapsed &&
        filteredTodoSteps.map(({ id, title: stepTitle, isComplete, taskId, taskTitle }) => (
          <ListItem
            key={id}
            title={stepTitle}
            metadata={[{ key: 'parentTitle', value: taskTitle }]}
            isActive={id === focusedTaskId}
            isComplete={isComplete}
            onToggleCheck={() =>
              dispatch(updateSubStep({ taskId, stepId: id, isComplete: !isComplete }))
            }
            onClick={() => dispatch(openDetailPanel(taskId))}
          />
        ))}
    </div>
  );
}
