import { Fragment, useState, useRef, useEffect, useCallback, MouseEventHandler } from 'react';
import { useRouter } from 'next/router';
import invariant from 'tiny-invariant';
import classNames from 'classnames';
import { IconContainer } from '@/components/layout';
import { ReactFocusEvent } from '@/lib/types/common';
import { isOneOf } from '@/lib/types/guard';
import { TodoItem, SettingsPerPage } from '@/lib/types/store/todoSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks/index';
import {
  openDeadlinePicker,
  closeDeadlinePicker,
  closeDeadlineCalendar,
  closeDetailPanel,
  removeTodoItem,
  updateTodoItem,
  markAsCompleteWithOrderingFlag,
  markAsIncomplete,
  markAsImportant,
  markAsImportantWithOrderingFlag,
  markAsUnimportant,
  markAsTodayTaskWithOrderingFlag,
  markAsNonTodayTask,
  removeSubStep,
  updateSubStep,
  unsetDeadline,
} from '@/lib/store/todoSlice';
import dayjs from '@/lib/plugins/dayjs';
import { StepInput } from '@/components/input';
import { DeadlinePicker } from '@/components/menu';
import { textColor } from '@/lib/utils/styles';

export default function DetailPanel() {
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
      'search',
      'search/[keyword]',
    ]),
  );

  const dispatch = useAppDispatch();
  const generalSettings = useAppSelector(({ todo: state }) => state.settings.general);
  const settingsPerPage = useAppSelector<SettingsPerPage>(
    ({ todo: state }) => state.pageSettings[pageKey],
  );
  const focusedTaskId = useAppSelector(({ todo: state }) => state.focusedTaskId);
  const task = useAppSelector(({ todo: state }) =>
    state.todoItems.find(({ id }) => id === focusedTaskId),
  );
  const deadlinePickerPosition = useAppSelector(({ todo: state }) => state.deadlinePickerPosition);
  const deadlineCalendarPosition = useAppSelector(
    ({ todo: state }) => state.deadlineCalendarPosition,
  );
  const [isActivated, setIsActivated] = useState(false);
  const $refs = {
    titleArea: useRef<HTMLTextAreaElement>(null),
    separator: useRef<HTMLDivElement>(null),
    memoArea: useRef<HTMLTextAreaElement>(null),
  };

  const midnightThisYear = dayjs().startOf('year');
  const midnightToday = dayjs().startOf('day');
  const midnightTomorrow = midnightToday.add(1, 'day');
  const midnightAfter2Days = midnightToday.add(2, 'day');
  const isActiveDeadlinePicker = deadlinePickerPosition !== null;
  const isActiveDeadlineCalendar = deadlineCalendarPosition !== null;
  let deadlineElement = null;
  let isOverdue = false;

  if (task?.deadline) {
    if (task.deadline < Number(midnightToday.format('x'))) {
      deadlineElement = <span>지연, {dayjs(task.deadline, 'x').format('M월 D일, ddd')}</span>;
      isOverdue = true;
    } else if (task.deadline < Number(midnightTomorrow.format('x'))) {
      deadlineElement = <span>오늘까지</span>;
    } else if (task.deadline < Number(midnightAfter2Days.format('x'))) {
      deadlineElement = <span>내일까지</span>;
    } else {
      deadlineElement = <span>{dayjs(task.deadline, 'x').format('M월 D일, ddd')}까지</span>;
    }
  }

  const closeHandler: MouseEventHandler = () => {
    dispatch(closeDetailPanel());
    dispatch(closeDeadlinePicker());

    if (isActiveDeadlineCalendar) {
      dispatch(closeDeadlineCalendar());
    }
  };
  const titleInputHandler = useCallback(
    (element: HTMLTextAreaElement) => {
      element.style.setProperty('height', '');

      const computedStyle = window.getComputedStyle(element);
      const borderWidth =
        parseInt(computedStyle.borderTopWidth, 10) + parseInt(computedStyle.borderBottomWidth, 10);
      const newHeight = element.scrollHeight + borderWidth;

      element.style.setProperty('height', `${newHeight}px`);

      const titleSection = document.querySelector('#title-section-trigger');

      if ($refs.separator.current && titleSection) {
        $refs.separator.current.style.setProperty(
          'top',
          `${titleSection.getBoundingClientRect().height}px`,
        );
      }
    },
    [$refs.separator],
  );
  const titleBlurHandler = (event: ReactFocusEvent<HTMLTextAreaElement>, taskId: string) => {
    const inputElement = event.currentTarget;
    const trimmedMemo = inputElement.value.trim();

    if (trimmedMemo) {
      dispatch(
        updateTodoItem({
          id: taskId,
          title: trimmedMemo,
        }),
      );
      inputElement.value = trimmedMemo;
    } else {
      inputElement.value = inputElement.defaultValue;
    }
    titleInputHandler(inputElement);
  };
  const stepTitleBlurHandler = (
    event: ReactFocusEvent<HTMLInputElement>,
    taskId: string,
    stepId: string,
  ) => {
    const inputElement = event.currentTarget;
    const trimmedMemo = inputElement.value.trim();

    if (trimmedMemo) {
      dispatch(
        updateSubStep({
          taskId,
          stepId,
          title: trimmedMemo,
        }),
      );
      inputElement.value = trimmedMemo;
    } else {
      inputElement.value = inputElement.defaultValue;
    }
  };
  const memoInputHandler = (element: HTMLTextAreaElement) => {
    element.style.setProperty('height', '');

    const computedStyle = window.getComputedStyle(element);
    const borderWidth =
      parseInt(computedStyle.borderTopWidth, 10) + parseInt(computedStyle.borderBottomWidth, 10);
    const newHeight = element.scrollHeight + borderWidth;

    element.style.setProperty('height', `${newHeight}px`);
  };
  const memoBlurHandler = (event: ReactFocusEvent<HTMLTextAreaElement>, taskId: string) => {
    const inputElement = event.currentTarget;
    const trimmedMemo = inputElement.value.trim();

    dispatch(
      updateTodoItem({
        id: taskId,
        memo: trimmedMemo,
      }),
    );
    inputElement.value = trimmedMemo;
    memoInputHandler(inputElement);
  };
  const removeHandler = ({
    title,
    action,
  }: {
    title: string;
    action: ReturnType<typeof removeSubStep | typeof removeTodoItem>;
  }) => {
    if (
      !generalSettings.confirmBeforeRemoving ||
      // eslint-disable-next-line no-alert
      window.confirm(`"${title}"이(가) 영구적으로 삭제됩니다.\n이 작업은 취소할 수 없습니다.`)
    ) {
      dispatch(action);
    }
  };
  const importantHandler = ({ id, isImportant }: TodoItem) => {
    if (isImportant) {
      dispatch(markAsUnimportant(id));
    } else if (generalSettings.moveImportantTask) {
      dispatch(markAsImportantWithOrderingFlag(id));
    } else {
      dispatch(markAsImportant(id));
    }
  };

  useEffect(() => {
    if (task && !isActivated) {
      if ($refs.titleArea.current) {
        titleInputHandler($refs.titleArea.current);
      }
      if ($refs.memoArea.current) {
        memoInputHandler($refs.memoArea.current);
      }
      setIsActivated(true);
    } else if (!task && isActivated) {
      setIsActivated(false);
    }
  }, [task, isActivated, $refs.titleArea, $refs.memoArea, titleInputHandler]);

  useEffect(() => {
    const flexibleSection = document.querySelector('#flexible-section-trigger');

    const scrollHandler: EventListener = () => {
      if (isActiveDeadlinePicker && flexibleSection) {
        dispatch(closeDeadlinePicker());

        if (isActiveDeadlineCalendar) {
          dispatch(closeDeadlineCalendar());
        }
      }
    };

    if (flexibleSection) {
      flexibleSection.addEventListener('scroll', scrollHandler);
    }

    return () => {
      if (flexibleSection) {
        flexibleSection.removeEventListener('scroll', scrollHandler);
      }
    };
  });

  const buttonClassNames =
    'inline-flex h-8 w-8 items-center p-1 focus:rounded-sm focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-500';
  const sectionClassNames =
    'my-2.5 flex rounded-sm bg-white text-[14px] text-gray-500 hover:bg-gray-100';

  return task ? (
    <Fragment key={task.id}>
      <div
        className="pointer-events-none hidden max-[770px]:pointer-events-auto max-[770px]:absolute max-[770px]:top-0 max-[770px]:left-0 max-[770px]:z-[70] max-[770px]:block max-[770px]:h-full max-[770px]:w-full max-[770px]:bg-gray-700 max-[770px]:opacity-40 max-[770px]:transition-opacity max-[770px]:duration-200"
        onClick={closeHandler}
        aria-hidden="true"
      />
      <div className="box-content h-[calc(100vh-48px)] w-[calc(100%-50px)] max-w-[360px] border-l border-solid border-gray-200 bg-gray-100 transition-[width] duration-200 max-[770px]:absolute max-[770px]:top-0 max-[770px]:right-0 max-[770px]:z-[80] max-[770px]:h-full">
        <div className="flex h-full flex-col bg-gray-100">
          <div
            id="flexible-section-trigger"
            className="mt-2.5 flex-1 overflow-y-auto overflow-x-hidden px-2.5 pb-4"
          >
            <div
              id="title-section-trigger"
              className="sticky top-0 z-10 rounded-t-sm border border-b-0 border-solid border-gray-200 bg-white px-2.5 pb-[2px]"
            >
              <div className="flex min-h-[52px] items-center">
                <button
                  type="button"
                  className={classNames(buttonClassNames, textColor(settingsPerPage.themeColor))}
                  title={task.isComplete ? '완료되지 않음으로 표시' : '완료됨으로 표시'}
                  onClick={() =>
                    dispatch(
                      task.isComplete
                        ? markAsIncomplete(task.id)
                        : markAsCompleteWithOrderingFlag(task.id),
                    )
                  }
                >
                  <IconContainer
                    iconClassName={task.isComplete ? 'fas fa-check-circle' : 'far fa-circle'}
                    iconLabel={task.isComplete ? '완료되지 않음으로 표시' : '완료됨으로 표시'}
                  />
                </button>
                <textarea
                  ref={$refs.titleArea}
                  className="my-2.5 h-8 w-full resize-none border-0 py-1 px-1.5 font-semibold text-gray-700 hover:bg-gray-100"
                  defaultValue={task.title}
                  maxLength={255}
                  onInput={(e) => titleInputHandler(e.currentTarget)}
                  onBlur={(e) => titleBlurHandler(e, task.id)}
                />
                <button
                  type="button"
                  className={classNames(
                    buttonClassNames,
                    task.isImportant ? textColor(settingsPerPage.themeColor) : 'text-gray-500',
                  )}
                  title={task.isImportant ? '중요도를 제거합니다.' : '작업을 중요로 표시합니다.'}
                  onClick={() => importantHandler(task)}
                >
                  <IconContainer
                    iconClassName={task.isImportant ? 'fas fa-star' : 'far fa-star'}
                    iconLabel={
                      task.isImportant ? '중요도를 제거합니다.' : '작업을 중요로 표시합니다.'
                    }
                  />
                </button>
              </div>
            </div>
            <div className="border-x border-solid border-gray-200 bg-white px-1.5 pb-[2px]">
              {task.subSteps.map(({ id, title, isComplete }) => (
                <div
                  key={id}
                  className="shadow-like-border-t group px-1 hover:bg-gray-100 hover:shadow-gray-100"
                >
                  <div className="shadow-inner-like-border-b ml-8 flex min-h-[42px] items-center text-[14px] text-gray-500 shadow-gray-200 group-hover:shadow-none">
                    <button
                      type="button"
                      className={classNames(
                        buttonClassNames,
                        '-ml-8',
                        textColor(settingsPerPage.themeColor),
                      )}
                      title={isComplete ? '완료되지 않음으로 표시' : '완료됨으로 표시'}
                      onClick={() =>
                        dispatch(
                          updateSubStep({
                            taskId: task.id,
                            stepId: id,
                            isComplete: !isComplete,
                          }),
                        )
                      }
                    >
                      <IconContainer
                        iconClassName={isComplete ? 'fas fa-check-circle' : 'far fa-circle'}
                        iconLabel={isComplete ? '완료되지 않음으로 표시' : '완료됨으로 표시'}
                      />
                    </button>
                    <input
                      className={classNames(
                        'w-full bg-transparent px-1.5 py-1',
                        { 'line-through': isComplete },
                        { 'text-gray-700': !isComplete },
                      )}
                      defaultValue={title}
                      maxLength={255}
                      onBlur={(e) => stepTitleBlurHandler(e, task.id, id)}
                    />
                    <button
                      type="button"
                      className={buttonClassNames}
                      title="단계 삭제"
                      onClick={() =>
                        removeHandler({
                          title,
                          action: removeSubStep({
                            taskId: task.id,
                            stepId: id,
                          }),
                        })
                      }
                    >
                      <IconContainer iconClassName="fas fa-times" iconLabel="단계 삭제" />
                    </button>
                  </div>
                </div>
              ))}
              <StepInput taskId={task.id} />
            </div>
            <div
              ref={$refs.separator}
              className="sticky z-10 h-[2px] rounded-b-sm border border-t-0 border-solid border-gray-200 bg-white"
            />

            <div className={classNames(sectionClassNames, 'border border-solid border-gray-200')}>
              <button
                type="button"
                className="min-h-[52px] flex-1 px-2 text-left"
                onClick={() =>
                  !task.isMarkedAsTodayTask && dispatch(markAsTodayTaskWithOrderingFlag(task.id))
                }
                disabled={task.isMarkedAsTodayTask}
              >
                <span
                  className={classNames('inline-flex h-8 w-8 items-center p-1', {
                    'text-blue-500': task.isMarkedAsTodayTask,
                  })}
                >
                  <IconContainer iconClassName="far fa-sun" />
                </span>
                <span className={classNames('mx-2', { 'text-blue-500': task.isMarkedAsTodayTask })}>
                  나의 하루에 {task.isMarkedAsTodayTask ? '추가됨' : '추가'}
                </span>
              </button>
              {task.isMarkedAsTodayTask ? (
                <div
                  style={{
                    padding: '0 8px',
                    alignSelf: 'center',
                  }}
                >
                  <button
                    type="button"
                    className={buttonClassNames}
                    title="나의 하루에서 제거"
                    onClick={() => dispatch(markAsNonTodayTask(task.id))}
                  >
                    <IconContainer iconClassName="fas fa-times" iconLabel="나의 하루에서 제거" />
                  </button>
                </div>
              ) : null}
            </div>

            <div className={classNames(sectionClassNames, 'border border-solid border-gray-200')}>
              <button
                type="button"
                className="min-h-[52px] flex-1 px-2 text-left"
                onClick={(event) =>
                  !isActiveDeadlinePicker &&
                  dispatch(
                    openDeadlinePicker({
                      event,
                    }),
                  )
                }
              >
                <span
                  className={classNames(
                    'inline-flex h-8 w-8 items-center p-1',
                    { 'text-blue-500': !task.isComplete && task.deadline && !isOverdue },
                    { 'text-red-600': !task.isComplete && task.deadline && isOverdue },
                  )}
                >
                  <IconContainer iconClassName="far fa-calendar-alt" />
                </span>
                <span
                  className={classNames(
                    'mx-2',
                    { 'text-blue-500': !task.isComplete && task.deadline && !isOverdue },
                    { 'text-red-600': !task.isComplete && task.deadline && isOverdue },
                  )}
                >
                  {task.deadline ? deadlineElement : '기한 설정'}
                </span>
              </button>
              {task.deadline ? (
                <div
                  style={{
                    padding: '0 8px',
                    alignSelf: 'center',
                  }}
                >
                  <button
                    type="button"
                    className={buttonClassNames}
                    title="기한 제거"
                    onClick={() => dispatch(unsetDeadline(task.id))}
                  >
                    <IconContainer iconClassName="fas fa-times" iconLabel="기한 제거" />
                  </button>
                </div>
              ) : null}

              {isActiveDeadlinePicker && <DeadlinePicker taskId={task.id} />}
            </div>

            <div className={sectionClassNames}>
              <textarea
                ref={$refs.memoArea}
                className="min-h-[86px] w-full resize-none rounded-sm border border-solid border-gray-200 p-4 text-[13px] font-medium leading-[normal] outline-none hover:border-gray-300 focus:border-blue-500"
                placeholder="메모 추가"
                defaultValue={task.memo}
                onInput={(e) => memoInputHandler(e.currentTarget)}
                onBlur={(e) => memoBlurHandler(e, task.id)}
              />
            </div>
          </div>

          <div className="flex min-h-[38px] items-center justify-between border-t border-solid border-gray-200 bg-gray-100 px-2.5">
            <button
              type="button"
              className={classNames(buttonClassNames, 'text-gray-500 hover:bg-white')}
              title="세부 정보 화면 숨기기"
              onClick={closeHandler}
            >
              <IconContainer iconClassName="fas fa-columns" iconLabel="세부 정보 화면 숨기기" />
            </button>
            <span className="text-[12px] text-gray-500">
              {task.isComplete && task.completedAt
                ? `${dayjs(task.completedAt, 'x').format(
                    task.completedAt < Number(midnightThisYear.format('x'))
                      ? 'YYYY년 M월 D일, ddd'
                      : 'M월 D일, ddd',
                  )}에 완료됨`
                : `${dayjs(task.createdAt, 'x').format(
                    task.createdAt < Number(midnightThisYear.format('x'))
                      ? 'YYYY년 M월 D일, ddd'
                      : 'M월 D일, ddd',
                  )}에 생성됨`}
            </span>
            <button
              type="button"
              className={classNames(buttonClassNames, 'text-gray-500 hover:bg-white')}
              title="작업 삭제"
              onClick={() =>
                removeHandler({
                  title: task.title,
                  action: removeTodoItem(task.id),
                })
              }
            >
              <IconContainer iconClassName="fas fa-trash-alt" iconLabel="작업 삭제" />
            </button>
          </div>
        </div>
      </div>
    </Fragment>
  ) : null;
}
