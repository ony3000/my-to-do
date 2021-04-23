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
  const dispatch = useDispatch();
  const focusedTaskId = useSelector(({ todo: state }) => state.focusedTaskId);
  const task = useSelector(({ todo: state }) => state.todoItems.find(({ id }) => (id === focusedTaskId)));

  const midnightThisYear = dayjs().startOf('year');

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
  const memoBlurHandler = (event, taskId) => {
    const inputElement = event.target;
    const trimmedMemo = inputElement.value.trim();

    dispatch(updateTodoItem({
      id: taskId,
      memo: trimmedMemo,
    }));
    inputElement.value = trimmedMemo;
  };

  return task ? (
    <>
      <div
        className={cx('overlay')}
        onClick={() => dispatch(closeDetailPanel())}
      />
      <div className={cx('container')}>
        <ul>
          <li>
            <button
              title={task.isComplete ? '완료되지 않음으로 표시' : '완료됨으로 표시'}
              onClick={() => dispatch(
                task.isComplete ? markAsIncomplete(task.id) : markAsComplete(task.id)
              )}
            >
              {task.isComplete ? (
                <i className="fas fa-check-circle"></i>
              ) : (
                <i className="far fa-circle"></i>
              )}
              <span className="sr-only">{task.isComplete ? '완료되지 않음으로 표시' : '완료됨으로 표시'}</span>
            </button>
          </li>
          <li>
            <textarea
              defaultValue={task.title}
              onBlur={e => titleBlurHandler(e, task.id)}
              style={{
                width: '100%',
                border: '1px solid black',
                resize: 'none',
                padding: '4px 6px',
              }}
            />
          </li>
          <li>
            <button
              title={task.isImportant ? '중요도를 제거합니다.' : '작업을 중요로 표시합니다.'}
              onClick={() => dispatch(
                task.isImportant ? markAsUnimportant(task.id) : markAsImportant(task.id)
              )}
            >
              {task.isImportant ? (
                <i className="fas fa-star"></i>
              ) : (
                <i className="far fa-star"></i>
              )}
              <span className="sr-only">{task.isImportant ? '중요도를 제거합니다.' : '작업을 중요로 표시합니다.'}</span>
            </button>
          </li>
          <li style={{ padding: '0 10px' }}>
            {task.subSteps.map(({
              id,
              title,
              isComplete,
            }) => (
              <div key={id}>
                <button
                  title={isComplete ? '완료되지 않음으로 표시' : '완료됨으로 표시'}
                  onClick={() => dispatch(updateSubStep({
                    taskId: task.id,
                    stepId: id,
                    isComplete: !isComplete,
                  }))}
                >
                  {isComplete ? (
                    <i className="fas fa-check-circle"></i>
                  ) : (
                    <i className="far fa-circle"></i>
                  )}
                  <span className="sr-only">{isComplete ? '완료되지 않음으로 표시' : '완료됨으로 표시'}</span>
                </button>
                <input
                  defaultValue={title}
                  onBlur={e => stepTitleBlurHandler(e, task.id, id)}
                  style={{
                    width: '100%',
                    border: '1px solid black',
                    resize: 'none',
                    padding: '4px 6px',
                  }}
                />
                <button
                  title="단계 삭제"
                  onClick={() => confirm(`"${title}"이(가) 영구적으로 삭제됩니다.\n이 작업은 취소할 수 없습니다.`) && dispatch(removeSubStep({
                    taskId: task.id,
                    stepId: id,
                  }))}
                >
                  <i className="fas fa-times"></i>
                  <span className="sr-only">단계 삭제</span>
                </button>
              </div>
            ))}
            <StepInput
              taskId={task.id}
            />
          </li>
          <li>
            {task.isMarkedAsTodayTask ? (
              <>
                <span>나의 하루에 추가됨</span>
                <button
                  title="나의 하루에서 제거"
                  onClick={() => dispatch(markAsNonTodayTask(task.id))}
                >
                  나의 하루에서 제거
                </button>
              </>
            ) : (
              <button
                onClick={() => dispatch(markAsTodayTask(task.id))}
              >
                나의 하루에 추가
              </button>
            )}
          </li>
          <li>기한 설정</li>
          <li>
            <textarea
              placeholder="메모 추가"
              defaultValue={task.memo}
              onBlur={e => memoBlurHandler(e, task.id)}
              style={{
                width: '100%',
                border: '1px solid black',
                resize: 'none',
                padding: '4px 6px',
              }}
            />
          </li>
          <li>
            <button
              title="세부 정보 화면 숨기기"
              onClick={() => dispatch(closeDetailPanel())}
            >
              세부 정보 화면 숨기기
            </button>
          </li>
          <li>
            {task.isComplete ? (
              <span>{dayjs(task.completedAt, 'x').format(task.completedAt < Number(midnightThisYear.format('x')) ? 'YYYY년 M월 D일, ddd' : 'M월 D일, ddd')}에 완료됨</span>
            ) : (
              <span>{dayjs(task.createdAt, 'x').format(task.createdAt < Number(midnightThisYear.format('x')) ? 'YYYY년 M월 D일, ddd' : 'M월 D일, ddd')}에 생성됨</span>
            )}
          </li>
          <li>
            <button
              title="작업 삭제"
              onClick={() => confirm(`"${task.title}"이(가) 영구적으로 삭제됩니다.\n이 작업은 취소할 수 없습니다.`) && dispatch(removeTodoItem(task.id))}
            >
              작업 삭제
            </button>
          </li>
        </ul>
      </div>
    </>
  ) : null;
}
