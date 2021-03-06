import { useState, useRef, useEffect } from 'react';
import classNames from 'classnames/bind';
import { useDispatch, useSelector } from 'react-redux';
import {
  closeDeadlinePicker,
  closeDeadlineCalendar,
  setDeadline,
} from '@/store/todoSlice';
import DatePicker from '@/plugins/react-datepicker';
import dayjs from '@/plugins/dayjs';
import styles from './DeadlineCalendar.module.scss';

const cx = classNames.bind(styles);

export default function DeadlineCalendar({
  taskId,
}) {
  const dispatch = useDispatch();
  const isActiveDeadlineCalendar = useSelector(({ todo: state }) => state.isActiveDeadlineCalendar);
  const { top: topPosition, right: rightPosition } = useSelector(({ todo: state }) => state.deadlineCalendarPosition);
  const [ isMounted, setIsMounted ] = useState(false);
  const [ calendarDate, setCalendarDate ] = useState(new Date());
  const $refs = {
    container: useRef(null),
  };

  const set__Deadline = (timestamp) => {
    dispatch(setDeadline({
      taskId,
      deadline: timestamp,
    }));
    dispatch(closeDeadlinePicker());

    if (isActiveDeadlineCalendar) {
      dispatch(closeDeadlineCalendar());
    }
  };

  useEffect(() => {
    if (!isMounted) {
      setIsMounted(true);
    }
  });

  useEffect(() => {
    function clickHandler(event) {
      if (isActiveDeadlineCalendar && $refs.container.current) {
        const pickerContainer = event.target.closest(`.${$refs.container.current.className}`);

        if (pickerContainer === null) {
          dispatch(closeDeadlineCalendar());
        }
      }
    }

    if (isMounted) {
      document.addEventListener('click', clickHandler);
    }

    return () => {
      if (isMounted) {
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
          <div className={cx('title')}>날짜 선택</div>
          <DatePicker
            selected={calendarDate}
            onChange={date => setCalendarDate(date)}
            inline
            locale="ko"
            calendarClassName={cx('body')}
            renderCustomHeader={({
              date,
              decreaseMonth,
              increaseMonth,
              prevMonthButtonDisabled,
              nextMonthButtonDisabled,
            }) => (
              <div className={cx('month-toolbar')}>
                <div className={cx('toolbar-section')}>
                  <span className={cx('current-month')}>{dayjs(date).format('MMM YYYY')}</span>
                </div>
                <div className={cx('toolbar-section')}>
                  <button
                    className={cx('navigation')}
                    onClick={decreaseMonth}
                    disabled={prevMonthButtonDisabled}
                    title="이전 달"
                  >
                    <i className="fas fa-arrow-up"></i>
                  </button>
                  <button
                    className={cx('navigation')}
                    onClick={increaseMonth}
                    disabled={nextMonthButtonDisabled}
                    title="다음 달"
                  >
                    <i className="fas fa-arrow-down"></i>
                  </button>
                </div>
              </div>
            )}
            renderDayContents={(day) => (
              <span className={cx('day-wrapper')}>{day}</span>
            )}
          />
          <div className={cx('footer')}>
            <button
              className={cx('save-button')}
              onClick={() => set__Deadline(Number(dayjs(calendarDate).endOf('day').format('x')))}
            >
              저장
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
