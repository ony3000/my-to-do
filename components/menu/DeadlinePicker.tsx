import { useState, useRef, useEffect } from 'react';
import classNames from 'classnames/bind';
import { useAppDispatch, useAppSelector } from '@/lib/hooks/index';
import {
  closeDeadlinePicker,
  openDeadlineCalendar,
  closeDeadlineCalendar,
  setDeadline,
} from '@/lib/store/todoSlice';
import dayjs from '@/lib/plugins/dayjs';
import { DeadlineCalendar } from '@/components/datepicker';
import styles from './ListOption.module.scss'; // shared

const cx = classNames.bind(styles);

type DeadlinePickerProps = {
  taskId: string;
};

export default function DeadlinePicker({ taskId }: DeadlinePickerProps) {
  const dispatch = useAppDispatch();
  const deadlinePickerPosition = useAppSelector(({ todo: state }) => state.deadlinePickerPosition);
  const deadlineCalendarPosition = useAppSelector(
    ({ todo: state }) => state.deadlineCalendarPosition,
  );
  const [isRendered, setIsRendered] = useState(false);
  const $refs = {
    container: useRef<HTMLDivElement>(null),
  };

  const midnightToday = dayjs().startOf('day');
  const midnightTomorrow = midnightToday.add(1, 'day');
  const midnightAfter2Days = midnightToday.add(2, 'day');
  const midnightNextTuesday = midnightToday.startOf('isoWeek').add(8, 'day');
  const isActiveDeadlinePicker = deadlinePickerPosition !== null;
  const topPosition = deadlinePickerPosition?.top || 0;
  const rightPosition = deadlinePickerPosition?.right || 0;
  const isActiveDeadlineCalendar = deadlineCalendarPosition !== null;

  const setFixedDeadline = (timestamp: number) => {
    dispatch(
      setDeadline({
        taskId,
        deadline: timestamp,
      }),
    );
    dispatch(closeDeadlinePicker());

    if (isActiveDeadlineCalendar) {
      dispatch(closeDeadlineCalendar());
    }
  };

  useEffect(() => {
    if (!isRendered) {
      setIsRendered(true);
    }
  }, [isRendered]);

  useEffect(() => {
    const clickHandler: EventListener = (event) => {
      if (
        isActiveDeadlinePicker &&
        $refs.container.current &&
        event.target instanceof HTMLElement
      ) {
        const pickerContainer = event.target.closest(`.${$refs.container.current.className}`);

        if (pickerContainer === null) {
          dispatch(closeDeadlinePicker());

          if (isActiveDeadlineCalendar) {
            dispatch(closeDeadlineCalendar());
          }
        }
      }
    };

    if (isRendered) {
      document.addEventListener('click', clickHandler);
    }

    return () => {
      if (isRendered) {
        document.removeEventListener('click', clickHandler);
      }
    };
  });

  return (
    <div className={cx('fixed-layer')}>
      <div className={cx('visible-layer')}>
        <div
          ref={$refs.container}
          className={cx('container')}
          style={{
            top: `${topPosition}px`,
            right: `${rightPosition}px`,
          }}
        >
          <div className={cx('title')}>기한</div>
          <ul>
            <li className={cx('option-item')}>
              <button
                type="button"
                className={cx('option-button')}
                onClick={() => setFixedDeadline(Number(midnightTomorrow.format('x')) - 1)}
              >
                <span className={cx('icon-wrapper', 'relative')}>
                  <i className="far fa-calendar" />
                  <i
                    className="fas fa-square"
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%) scale(0.25)',
                    }}
                  />
                </span>
                <span className={cx('option-text')}>오늘</span>
              </button>
            </li>
            <li className={cx('option-item')}>
              <button
                type="button"
                className={cx('option-button')}
                onClick={() => setFixedDeadline(Number(midnightAfter2Days.format('x')) - 1)}
              >
                <span className={cx('icon-wrapper', 'relative')}>
                  <i className="far fa-calendar" />
                  <i
                    className="fas fa-arrow-right"
                    style={{
                      position: 'absolute',
                      top: 'calc(50% + 2px)',
                      left: '50%',
                      transform: 'translate(-50%, -50%) scale(0.55)',
                    }}
                  />
                </span>
                <span className={cx('option-text')}>내일</span>
              </button>
            </li>
            <li className={cx('option-item')}>
              <button
                type="button"
                className={cx('option-button')}
                onClick={() => setFixedDeadline(Number(midnightNextTuesday.format('x')) - 1)}
              >
                <span className={cx('icon-wrapper', 'relative')}>
                  <i className="far fa-calendar" />
                  <i
                    className="fas fa-angle-double-right"
                    style={{
                      position: 'absolute',
                      top: 'calc(50% + 1px)',
                      left: '50%',
                      transform: 'translate(-50%, -50%) scale(0.6)',
                    }}
                  />
                </span>
                <span className={cx('option-text')}>다음 주</span>
              </button>
            </li>
            <li className={cx('option-separator')} />
            <li className={cx('option-item')}>
              <button
                type="button"
                className={cx('option-button', 'datepicker-activator')}
                onClick={(event) =>
                  !isActiveDeadlineCalendar &&
                  dispatch(
                    openDeadlineCalendar({
                      event,
                      selector: `.${cx('datepicker-activator')}`,
                    }),
                  )
                }
              >
                <span className={cx('icon-wrapper', 'relative')}>
                  <i className="far fa-calendar-alt" />
                  <i
                    className="far fa-clock"
                    style={{
                      position: 'absolute',
                      top: 'calc(50% + 6px)',
                      left: 'calc(50% + 6px)',
                      transform: 'translate(-50%, -50%) scale(0.6)',
                      backgroundColor: '#fff',
                    }}
                  />
                </span>
                <span className={cx('option-text')}>날짜 선택</span>
                <span className={cx('icon-wrapper')}>
                  <i className="fas fa-chevron-right" />
                </span>
              </button>

              {isActiveDeadlineCalendar && <DeadlineCalendar taskId={taskId} />}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
