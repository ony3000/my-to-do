import { useRef, useEffect } from 'react';
import classNames from 'classnames/bind';
import { useDispatch, useSelector } from 'react-redux';
import {
  closeDeadlinePicker,
  setDeadline,
} from '@/store/todoSlice';
import dayjs from '@/plugins/dayjs';
import styles from './ListOption.module.scss'; // shared

const cx = classNames.bind(styles);

export default function DeadlinePicker({
  taskId,
}) {
  const dispatch = useDispatch();
  const isActiveDeadlinePicker = useSelector(({ todo: state }) => state.isActiveDeadlinePicker);
  const { top: topPosition, left: leftPosition } = useSelector(({ todo: state }) => state.deadlinePickerPosition);
  const $refs = {
    container: useRef(null),
  };

  const midnightToday = dayjs().startOf('day');
  const midnightTomorrow = midnightToday.add(1, 'day');
  const midnightAfter2Days = midnightToday.add(2, 'day');
  const midnightNextTuesday = midnightToday.startOf('isoWeek').add(8, 'day');

  const setFixedDeadline = (timestamp) => {
    dispatch(setDeadline({
      taskId,
      deadline: timestamp,
    }));
    dispatch(closeDeadlinePicker());
  };

  useEffect(() => {
    function clickHandler(event) {
      if (isActiveDeadlinePicker && $refs.container.current) {
        const pickerContainer = event.target.closest(`.${$refs.container.current.className}`);

        if (pickerContainer === null) {
          dispatch(closeDeadlinePicker());
        }
      }
    }

    document.addEventListener('click', clickHandler);

    return () => {
      document.removeEventListener('click', clickHandler);
    };
  });

  return isActiveDeadlinePicker ? (
    <div className={cx('fixed-layer')}>
      <div className={cx('visible-layer')}>
        <div
          ref={$refs.container}
          className={cx('container')}
          style={{
            top: `${topPosition}px`,
            left: `${leftPosition}px`,
          }}
        >
          <div className={cx('title')}>기한</div>
          <ul>
            <li className={cx('option-item')}>
              <button
                className={cx('option-button')}
                onClick={() => setFixedDeadline(Number(midnightTomorrow.format('x')) - 1)}
              >
                <span className={cx('icon-wrapper', 'relative')}>
                  <i className="far fa-calendar"></i>
                  <i className="fas fa-square" style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%) scale(0.25)',
                  }}></i>
                </span>
                <span className={cx('option-text')}>
                  오늘
                </span>
              </button>
            </li>
            <li className={cx('option-item')}>
              <button
                className={cx('option-button')}
                onClick={() => setFixedDeadline(Number(midnightAfter2Days.format('x')) - 1)}
              >
                <span className={cx('icon-wrapper', 'relative')}>
                  <i className="far fa-calendar"></i>
                  <i className="fas fa-arrow-right" style={{
                    position: 'absolute',
                    top: 'calc(50% + 2px)',
                    left: '50%',
                    transform: 'translate(-50%, -50%) scale(0.55)',
                  }}></i>
                </span>
                <span className={cx('option-text')}>
                  내일
                </span>
              </button>
            </li>
            <li className={cx('option-item')}>
              <button
                className={cx('option-button')}
                onClick={() => setFixedDeadline(Number(midnightNextTuesday.format('x')) - 1)}
              >
                <span className={cx('icon-wrapper', 'relative')}>
                  <i className="far fa-calendar"></i>
                  <i className="fas fa-angle-double-right" style={{
                    position: 'absolute',
                    top: 'calc(50% + 1px)',
                    left: '50%',
                    transform: 'translate(-50%, -50%) scale(0.6)',
                  }}></i>
                </span>
                <span className={cx('option-text')}>
                  다음 주
                </span>
              </button>
            </li>
            <li className={cx('option-separator')} />
            <li className={cx('option-item')}>
              <button
                className={cx('option-button')}
                onClick={() => console.log('날짜 선택')}
              >
                <span className={cx('icon-wrapper')}>
                  <i className="far fa-calendar-alt"></i>
                </span>
                <span className={cx('option-text')}>
                  날짜 선택
                </span>
                <span className={cx('icon-wrapper')}>
                  <i className="fas fa-chevron-right"></i>
                </span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  ) : null;
}
