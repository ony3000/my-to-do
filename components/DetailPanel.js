import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames/bind';
import { useDispatch, useSelector } from 'react-redux';
import {
  closeDetailPanel,
  removeTodoItem,
  updateTodoItem,
  markAsComplete,
  markAsIncomplete,
  markAsImportant,
  markAsUnimportant,
  markAsTodayTask,
  markAsNonTodayTask,
  removeSubStep,
  updateSubStep,
} from '@/store/todoSlice';
import dayjs from '@/plugins/dayjs';
import styles from './DetailPanel.module.scss';
import StepInput from '@/components/StepInput';

const cx = classNames.bind(styles);

export default function DetailPanel() {
  const router = useRouter();
  const pageKey = router.pathname.replace(/^\/tasks\/?/, '') || 'inbox';
  const dispatch = useDispatch();
  const settingsPerPage = useSelector(({ todo: state }) => state.pageSettings[pageKey]);
  const focusedTaskId = useSelector(({ todo: state }) => state.focusedTaskId);
  const task = useSelector(({ todo: state }) => state.todoItems.find(({ id }) => (id === focusedTaskId)));
  const [ isActivated, setIsActivated ] = useState(false);
  const $refs = {
    titleArea: useRef(null),
    separator: useRef(null),
    memoArea: useRef(null),
  };

  const midnightThisYear = dayjs().startOf('year');

  const titleInputHandler = (element) => {
    element.style.setProperty('height', '');

    const computedStyle = window.getComputedStyle(element);
    const borderWidth = parseInt(computedStyle.borderTopWidth) + parseInt(computedStyle.borderBottomWidth);
    const newHeight = element.scrollHeight + borderWidth;

    element.style.setProperty('height', `${newHeight}px`);

    $refs.separator.current.style.setProperty('top', `${element.closest(`.${cx('title-section')}`).getBoundingClientRect().height}px`);
  };
  const titleBlurHandler = (event, taskId) => {
    const inputElement = event.target;
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
  const stepTitleBlurHandler = (event, taskId, stepId) => {
    const inputElement = event.target;
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
  const memoInputHandler = (element) => {
    element.style.setProperty('height', '');

    const computedStyle = window.getComputedStyle(element);
    const borderWidth = parseInt(computedStyle.borderTopWidth) + parseInt(computedStyle.borderBottomWidth);
    const newHeight = element.scrollHeight + borderWidth;

    element.style.setProperty('height', `${newHeight}px`);
  };
  const memoBlurHandler = (event, taskId) => {
    const inputElement = event.target;
    const trimmedMemo = inputElement.value.trim();

    dispatch(updateTodoItem({
      id: taskId,
      memo: trimmedMemo,
    }));
    inputElement.value = trimmedMemo;
    memoInputHandler(inputElement);
  };

  useEffect(() => {
    if (task && !isActivated) {
      titleInputHandler($refs.titleArea.current);
      memoInputHandler($refs.memoArea.current);
      setIsActivated(true);
    }
    else if (!task && isActivated) {
      setIsActivated(false);
    }
  });

  return task ? (
    <>
      <div
        className={cx('overlay')}
        onClick={() => dispatch(closeDetailPanel())}
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
                    task.isComplete ? markAsIncomplete(task.id) : markAsComplete(task.id)
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
                  onInput={e => titleInputHandler(e.target)}
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
                  onClick={() => dispatch(
                    task.isImportant ? markAsUnimportant(task.id) : markAsImportant(task.id)
                  )}
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
                      onBlur={e => stepTitleBlurHandler(e, task.id, id)}
                    />
                    <button
                      className={cx('button')}
                      title="단계 삭제"
                      onClick={() => confirm(`"${title}"이(가) 영구적으로 삭제됩니다.\n이 작업은 취소할 수 없습니다.`) && dispatch(removeSubStep({
                        taskId: task.id,
                        stepId: id,
                      }))}
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
                onClick={() => !task.isMarkedAsTodayTask && dispatch(markAsTodayTask(task.id))}
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

            <div className={cx('general-section')}>
              <button
                className={cx('section-item')}
                onClick={() => console.log('기한 설정')}
              >
                <span className={cx('button')}>
                  <span className={cx('icon-wrapper')}>
                    <i className="far fa-calendar-alt"></i>
                  </span>
                </span>
                <span className={cx('section-title')}>
                  기한 설정
                </span>
              </button>
            </div>

            <div className={cx('general-section', 'has-no-border')}>
              <textarea
                ref={$refs.memoArea}
                className={cx('memo-input')}
                placeholder="메모 추가"
                defaultValue={task.memo}
                onInput={e => memoInputHandler(e.target)}
                onBlur={e => memoBlurHandler(e, task.id)}
              />
            </div>
          </div>

          <div className={cx('footer')}>
            <button
              className={cx('button')}
              title="세부 정보 화면 숨기기"
              onClick={() => dispatch(closeDetailPanel())}
            >
              <span className={cx('icon-wrapper')}>
                <i className="fas fa-columns"></i>
                <span className="sr-only">세부 정보 화면 숨기기</span>
              </span>
            </button>
            <span className={cx('date')}>
              {task.isComplete ? (
                `${dayjs(task.completedAt, 'x').format(task.completedAt < Number(midnightThisYear.format('x')) ? 'YYYY년 M월 D일, ddd' : 'M월 D일, ddd')}에 완료됨`
              ) : (
                `${dayjs(task.createdAt, 'x').format(task.createdAt < Number(midnightThisYear.format('x')) ? 'YYYY년 M월 D일, ddd' : 'M월 D일, ddd')}에 생성됨`
              )}
            </span>
            <button
              className={cx('button')}
              title="작업 삭제"
              onClick={() => confirm(`"${task.title}"이(가) 영구적으로 삭제됩니다.\n이 작업은 취소할 수 없습니다.`) && dispatch(removeTodoItem(task.id))}
            >
              <span className={cx('icon-wrapper')}>
                <i className="fas fa-trash-alt"></i>
                <span className="sr-only">작업 삭제</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  ) : null;
}
