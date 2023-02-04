import { useState, useRef, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks/index';
import { closeDeadlinePicker, closeDeadlineCalendar, setDeadline } from '@/lib/store/todoSlice';
import DatePicker from '@/lib/plugins/react-datepicker';
import dayjs from '@/lib/plugins/dayjs';

type DeadlineCalendarProps = {
  taskId: string;
};

export default function DeadlineCalendar({ taskId }: DeadlineCalendarProps) {
  const dispatch = useAppDispatch();
  const deadlineCalendarPosition = useAppSelector(
    ({ todo: state }) => state.deadlineCalendarPosition,
  );
  const [isRendered, setIsRendered] = useState(false);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const $refs = {
    container: useRef<HTMLDivElement>(null),
  };

  const isActiveDeadlineCalendar = deadlineCalendarPosition !== null;
  const topPosition = deadlineCalendarPosition?.top || 0;
  const rightPosition = deadlineCalendarPosition?.right || 0;

  const setDeadlineHandler = (timestamp: number) => {
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
        isActiveDeadlineCalendar &&
        $refs.container.current &&
        event.target instanceof HTMLElement
      ) {
        const hasTarget = $refs.container.current.contains(event.target);

        if (!hasTarget) {
          dispatch(closeDeadlineCalendar());
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
    <div className="invisible fixed top-0 left-0 z-[1000000] min-h-screen w-full">
      <div className="visible relative">
        <div
          ref={$refs.container}
          className="shadow-elevation absolute min-w-[200px] max-w-[290px] rounded-sm bg-white py-1.5"
          style={{
            top: `${topPosition}px`,
            right: `${rightPosition}px`,
          }}
        >
          <div className="mb-1.5 border-b border-solid border-gray-200 p-2 pb-3 text-center text-[14px] font-semibold text-gray-700">
            날짜 선택
          </div>
          <DatePicker
            selected={calendarDate}
            onChange={(date) => setCalendarDate(date as Date)}
            inline
            locale="ko"
            calendarClassName="deadline-calendar"
            renderCustomHeader={({
              date,
              decreaseMonth,
              increaseMonth,
              prevMonthButtonDisabled,
              nextMonthButtonDisabled,
            }) => (
              <div className="flex justify-between">
                <div className="flex items-center">
                  <span className="px-2.5 text-[14px] font-semibold text-gray-700">
                    {dayjs(date).format('MMM YYYY')}
                  </span>
                </div>
                <div className="flex items-center">
                  <button
                    type="button"
                    className="inline-flex h-7 w-7 items-center justify-center text-gray-500 hover:bg-gray-100 active:bg-gray-200"
                    onClick={decreaseMonth}
                    disabled={prevMonthButtonDisabled}
                    title="이전 달"
                  >
                    <i className="fas fa-arrow-up" />
                  </button>
                  <button
                    type="button"
                    className="inline-flex h-7 w-7 items-center justify-center text-gray-500 hover:bg-gray-100 active:bg-gray-200"
                    onClick={increaseMonth}
                    disabled={nextMonthButtonDisabled}
                    title="다음 달"
                  >
                    <i className="fas fa-arrow-down" />
                  </button>
                </div>
              </div>
            )}
            renderDayContents={(day) => <span className="day-wrapper">{day}</span>}
          />
          <div className="mt-1.5 flex justify-end p-2 pb-3">
            <button
              type="button"
              className="h-8 rounded-sm bg-blue-500 px-3 text-[14px] font-bold text-white hover:bg-blue-600"
              onClick={() =>
                setDeadlineHandler(Number(dayjs(calendarDate).endOf('day').format('x')))
              }
            >
              저장
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
