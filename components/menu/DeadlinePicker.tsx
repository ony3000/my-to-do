import { useState, useRef, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks/index';
import {
  closeDeadlinePicker,
  openDeadlineCalendar,
  closeDeadlineCalendar,
  setDeadline,
} from '@/lib/store/todoSlice';
import dayjs from '@/lib/plugins/dayjs';
import { DeadlineCalendar } from '@/components/datepicker';
import { DeadlineType } from '@/lib/types/enums';
import { MenuLayer, MenuContainer, MenuItem } from './parts';

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
        const hasTarget = $refs.container.current.contains(event.target);

        if (!hasTarget) {
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
  }, [dispatch, isRendered, $refs.container, isActiveDeadlinePicker, isActiveDeadlineCalendar]);

  return (
    <MenuLayer>
      <MenuContainer
        ref={$refs.container}
        title="기한"
        style={{
          top: `${topPosition}px`,
          right: `${rightPosition}px`,
        }}
      >
        <ul>
          <MenuItem
            type={DeadlineType.Today}
            onClick={() => setFixedDeadline(Number(midnightTomorrow.format('x')) - 1)}
          />
          <MenuItem
            type={DeadlineType.Tomorrow}
            onClick={() => setFixedDeadline(Number(midnightAfter2Days.format('x')) - 1)}
          />
          <MenuItem
            type={DeadlineType.NextWeek}
            onClick={() => setFixedDeadline(Number(midnightNextTuesday.format('x')) - 1)}
          />
          <li className="my-1.5 border-b border-solid border-black/[.08] bg-white" />
          <MenuItem
            type={DeadlineType.ChooseDate}
            onClick={(event) =>
              !isActiveDeadlineCalendar &&
              dispatch(
                openDeadlineCalendar({
                  event,
                }),
              )
            }
          />
        </ul>

        {isActiveDeadlineCalendar && <DeadlineCalendar taskId={taskId} />}
      </MenuContainer>
    </MenuLayer>
  );
}
