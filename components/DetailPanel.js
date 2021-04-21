import classNames from 'classnames/bind';
import { useDispatch, useSelector } from 'react-redux';
import {
  closeDetailPanel,
  markAsComplete,
  markAsIncomplete,
  markAsImportant,
  markAsUnimportant,
} from '@/store/todoSlice';
import dayjs from '@/plugins/dayjs';
import styles from './DetailPanel.module.scss';

const cx = classNames.bind(styles);

export default function DetailPanel() {
  const dispatch = useDispatch();
  const focusedTaskId = useSelector(({ todo: state }) => state.focusedTaskId);
  const task = useSelector(({ todo: state }) => state.todoItems.find(({ id }) => (id === focusedTaskId)));

  const midnightThisYear = dayjs().startOf('year');

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
          <li>{task.title}</li>
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
          <li>하위 단계 추가</li>
          <li>나의 하루에 추가/제거</li>
          <li>기한 설정</li>
          <li>메모</li>
          <li>
            <button onClick={() => dispatch(closeDetailPanel())}>세부 정보 화면 숨기기</button>
          </li>
          <li>
            {task.isComplete ? (
              <span>{dayjs(task.completedAt, 'x').format(task.completedAt < Number(midnightThisYear.format('x')) ? 'YYYY년 M월 D일, ddd' : 'M월 D일, ddd')}에 완료됨</span>
            ) : (
              <span>{dayjs(task.createdAt, 'x').format(task.createdAt < Number(midnightThisYear.format('x')) ? 'YYYY년 M월 D일, ddd' : 'M월 D일, ddd')}에 생성됨</span>
            )}
          </li>
          <li>작업 삭제</li>
        </ul>
      </div>
    </>
  ) : null;
}
