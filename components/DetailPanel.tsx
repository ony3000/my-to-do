import { Fragment, useState, useRef, useEffect, MouseEventHandler } from 'react';
import { useRouter } from 'next/router';
import invariant from 'tiny-invariant';
import classNames from 'classnames/bind';
import { ReactFocusEvent } from '@/types/common';
import { isOneOf } from '@/types/guard';
import { TodoItem } from '@/types/store/todoSlice';
import { SettingsPerPage } from '@/types/store/todoSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/index';
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
} from '@/store/todoSlice';
import dayjs from '@/plugins/dayjs';
import styles from './DetailPanel.module.scss';
import StepInput from '@/components/StepInput';
import DeadlinePicker from '@/components/DeadlinePicker';

const cx = classNames.bind(styles);

export default function DetailPanel() {
  const router = useRouter();
  const pageKey = router.pathname.replace(/^\/tasks\/?/, '') || 'inbox';

  invariant(isOneOf(pageKey, ['myday', 'important', 'planned', 'all', 'completed', 'inbox', 'search', 'search/[keyword]']));

  const dispatch = useAppDispatch();
  const generalSettings = useAppSelector(({ todo: state }) => state.settings.general);
  const settingsPerPage: SettingsPerPage = useAppSelector(({ todo: state }) => state.pageSettings[pageKey]);
  const focusedTaskId = useAppSelector(({ todo: state }) => state.focusedTaskId);
  const task = useAppSelector(({ todo: state }) => state.todoItems.find(({ id }) => (id === focusedTaskId)));
  const deadlinePickerPosition = useAppSelector(({ todo: state }) => state.deadlinePickerPosition);
  const deadlineCalendarPosition = useAppSelector(({ todo: state }) => state.deadlineCalendarPosition);
  const [ isActivated, setIsActivated ] = useState(false);
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
    }
    else if (task.deadline < Number(midnightTomorrow.format('x'))) {
      deadlineElement = <span>오늘까지</span>;
    }
    else if (task.deadline < Number(midnightAfter2Days.format('x'))) {
      deadlineElement = <span>내일까지</span>;
    }
    else {
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
  const titleInputHandler = (element: HTMLTextAreaElement) => {
    element.style.setProperty('height', '');

    const computedStyle = window.getComputedStyle(element);
    const borderWidth = parseInt(computedStyle.borderTopWidth) + parseInt(computedStyle.borderBottomWidth);
    const newHeight = element.scrollHeight + borderWidth;

    element.style.setProperty('height', `${newHeight}px`);

    const closestSection = element.closest(`.${cx('title-section')}`);

    if ($refs.separator.current && closestSection) {
      $refs.separator.current.style.setProperty('top', `${closestSection.getBoundingClientRect().height}px`);
    }
  };
  const titleBlurHandler = (event: ReactFocusEvent<HTMLTextAreaElement>, taskId: string) => {
    const inputElement = event.currentTarget;
    const trimmedMemo = inputElement.value.trim();

    if (trimmedMemo) {
      dispatch(updateTodoItem({
        id: taskId,
        title: trimmedMemo,
      }));
      inputElement.value = trimmedMemo;
    }
    else {
      inputElement.value = inputElement.defaultValue;
    }
    titleInputHandler(inputElement);
  };
  const stepTitleBlurHandler = (event: ReactFocusEvent<HTMLInputElement>, taskId: string, stepId: string) => {
    const inputElement = event.currentTarget;
    const trimmedMemo = inputElement.value.trim();

    if (trimmedMemo) {
      dispatch(updateSubStep({
        taskId,
        stepId,
        title: trimmedMemo,
      }))
      inputElement.value = trimmedMemo;
    }
    else {
      inputElement.value = inputElement.defaultValue;
    }
  };
  const memoInputHandler = (element: HTMLTextAreaElement) => {
    element.style.setProperty('height', '');

    const computedStyle = window.getComputedStyle(element);
    const borderWidth = parseInt(computedStyle.borderTopWidth) + parseInt(computedStyle.borderBottomWidth);
    const newHeight = element.scrollHeight + borderWidth;

    element.style.setProperty('height', `${newHeight}px`);
  };
  const memoBlurHandler = (event: ReactFocusEvent<HTMLTextAreaElement>, taskId: string) => {
    const inputElement = event.currentTarget;
    const trimmedMemo = inputElement.value.trim();

    dispatch(updateTodoItem({
      id: taskId,
      memo: trimmedMemo,
    }));
    inputElement.value = trimmedMemo;
    memoInputHandler(inputElement);
  };
  const removeHandler = ({ title, action }: {
    title: string;
    action: ReturnType<typeof removeSubStep | typeof removeTodoItem>;
  }) => {
    if (!generalSettings.confirmBeforeRemoving || confirm(`"${title}"이(가) 영구적으로 삭제됩니다.\n이 작업은 취소할 수 없습니다.`)) {
      dispatch(action);
    }
  };
  const importantHandler = ({ id, isImportant }: TodoItem) => {
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

  useEffect(() => {
    if (task && !isActivated) {
      if ($refs.titleArea.current) {
        titleInputHandler($refs.titleArea.current);
      }
      if ($refs.memoArea.current) {
        memoInputHandler($refs.memoArea.current);
      }
      setIsActivated(true);
    }
    else if (!task && isActivated) {
      setIsActivated(false);
    }
  });

  useEffect(() => {
    const flexibleSection = document.querySelector(`.${cx('flexible-section')}`);

    const scrollHandler: EventListener = (event) => {
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

  return task ? (
    <Fragment key={task.id}>
      <div
        className={cx('overlay')}
        onClick={closeHandler}
      />
      <div className={cx('container')}>
        <div className={cx('body')}>
          <div className={cx('flexible-section')}>
            <div className={cx('title-section')}>
              <div className={cx('title-body')}>
                <button
                  className={cx(
                    'button',
                    `text-${settingsPerPage.themeColor ? settingsPerPage.themeColor : 'blue'}-500`,
                  )}
                  title={task.isComplete ? '완료되지 않음으로 표시' : '완료됨으로 표시'}
                  onClick={() => dispatch(
                    task.isComplete ? markAsIncomplete(task.id) : markAsCompleteWithOrderingFlag(task.id)
                  )}
                >
                  <span className={cx('icon-wrapper')}>
                    {task.isComplete ? (
                      <i className="fas fa-check-circle"></i>
                    ) : (
                      <i className="far fa-circle"></i>
                    )}
                  </span>
                  <span className="sr-only">{task.isComplete ? '완료되지 않음으로 표시' : '완료됨으로 표시'}</span>
                </button>
                <textarea
                  ref={$refs.titleArea}
                  className={cx('title-input')}
                  defaultValue={task.title}
                  maxLength={255}
                  onInput={e => titleInputHandler(e.currentTarget)}
                  onBlur={e => titleBlurHandler(e, task.id)}
                />
                <button
                  className={cx(
                    'button',
                    (
                      task.isImportant
                        ? `text-${settingsPerPage.themeColor ? settingsPerPage.themeColor : 'blue'}-500`
                        : 'text-gray-500'
                    ),
                  )}
                  title={task.isImportant ? '중요도를 제거합니다.' : '작업을 중요로 표시합니다.'}
                  onClick={() => importantHandler(task)}
                >
                  <span className={cx('icon-wrapper')}>
                    {task.isImportant ? (
                      <i className="fas fa-star"></i>
                    ) : (
                      <i className="far fa-star"></i>
                    )}
                  </span>
                  <span className="sr-only">{task.isImportant ? '중요도를 제거합니다.' : '작업을 중요로 표시합니다.'}</span>
                </button>
              </div>
            </div>
            <div className={cx('step-section')}>
              {task.subSteps.map(({
                id,
                title,
                isComplete,
              }) => (
                <div key={id} className={cx('step-item')}>
                  <div className={cx('step-body')}>
                    <button
                      className={cx(
                        'button',
                        `text-${settingsPerPage.themeColor ? settingsPerPage.themeColor : 'blue'}-500`,
                      )}
                      title={isComplete ? '완료되지 않음으로 표시' : '완료됨으로 표시'}
                      onClick={() => dispatch(updateSubStep({
                        taskId: task.id,
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
                      </span>
                      <span className="sr-only">{isComplete ? '완료되지 않음으로 표시' : '완료됨으로 표시'}</span>
                    </button>
                    <input
                      className={cx(
                        'step-title-input',
                        { 'line-through': isComplete },
                        { 'text-gray-700': !isComplete },
                      )}
                      defaultValue={title}
                      maxLength={255}
                      onBlur={e => stepTitleBlurHandler(e, task.id, id)}
                    />
                    <button
                      className={cx('button')}
                      title="단계 삭제"
                      onClick={() => removeHandler({
                        title,
                        action: removeSubStep({
                          taskId: task.id,
                          stepId: id,
                        }),
                      })}
                    >
                      <span className={cx('icon-wrapper')}>
                        <i className="fas fa-times"></i>
                      </span>
                      <span className="sr-only">단계 삭제</span>
                    </button>
                  </div>
                </div>
              ))}
              <StepInput
                taskId={task.id}
              />
            </div>
            <div
              ref={$refs.separator}
              className={cx('separator')}
            />

            <div
              className={cx(
                'general-section',
                { 'is-active': task.isMarkedAsTodayTask },
              )}
            >
              <button
                className={cx('section-item')}
                onClick={() => !task.isMarkedAsTodayTask && dispatch(markAsTodayTaskWithOrderingFlag(task.id))}
                disabled={task.isMarkedAsTodayTask}
              >
                <span className={cx('button')}>
                  <span className={cx('icon-wrapper')}>
                    <i className="far fa-sun"></i>
                  </span>
                </span>
                <span className={cx('section-title')}>
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
                    className={cx('button')}
                    title="나의 하루에서 제거"
                    onClick={() => dispatch(markAsNonTodayTask(task.id))}
                  >
                    <span className={cx('icon-wrapper')}>
                      <i className="fas fa-times"></i>
                    </span>
                    <span className="sr-only">나의 하루에서 제거</span>
                  </button>
                </div>
              ) : null}
            </div>

            <div
              className={cx(
                'general-section',
                { 'is-active': !task.isComplete && task.deadline },
                { 'has-error': !task.isComplete && isOverdue },
              )}
            >
              <button
                className={cx('section-item')}
                onClick={(event) => !isActiveDeadlinePicker && dispatch(openDeadlinePicker({
                  event,
                  selector: `.${cx('section-item')}`,
                }))}
              >
                <span className={cx('button')}>
                  <span className={cx('icon-wrapper')}>
                    <i className="far fa-calendar-alt"></i>
                  </span>
                </span>
                <span className={cx('section-title')}>
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
                    className={cx('button')}
                    title="기한 제거"
                    onClick={() => dispatch(unsetDeadline(task.id))}
                  >
                    <span className={cx('icon-wrapper')}>
                      <i className="fas fa-times"></i>
                    </span>
                    <span className="sr-only">기한 제거</span>
                  </button>
                </div>
              ) : null}

              {isActiveDeadlinePicker && (
                <DeadlinePicker
                  taskId={task.id}
                />
              )}
            </div>

            <div className={cx('general-section', 'has-no-border')}>
              <textarea
                ref={$refs.memoArea}
                className={cx('memo-input')}
                placeholder="메모 추가"
                defaultValue={task.memo}
                onInput={e => memoInputHandler(e.currentTarget)}
                onBlur={e => memoBlurHandler(e, task.id)}
              />
            </div>
          </div>

          <div className={cx('footer')}>
            <button
              className={cx('button')}
              title="세부 정보 화면 숨기기"
              onClick={closeHandler}
            >
              <span className={cx('icon-wrapper')}>
                <i className="fas fa-columns"></i>
                <span className="sr-only">세부 정보 화면 숨기기</span>
              </span>
            </button>
            <span className={cx('date')}>
              {task.isComplete && task.completedAt ? (
                `${dayjs(task.completedAt, 'x').format(task.completedAt < Number(midnightThisYear.format('x')) ? 'YYYY년 M월 D일, ddd' : 'M월 D일, ddd')}에 완료됨`
              ) : (
                `${dayjs(task.createdAt, 'x').format(task.createdAt < Number(midnightThisYear.format('x')) ? 'YYYY년 M월 D일, ddd' : 'M월 D일, ddd')}에 생성됨`
              )}
            </span>
            <button
              className={cx('button')}
              title="작업 삭제"
              onClick={() => removeHandler({
                title: task.title,
                action: removeTodoItem(task.id),
              })}
            >
              <span className={cx('icon-wrapper')}>
                <i className="fas fa-trash-alt"></i>
                <span className="sr-only">작업 삭제</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </Fragment>
  ) : null;
}
