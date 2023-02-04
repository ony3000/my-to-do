import type { ComponentProps, ForwardedRef, MouseEventHandler } from 'react';
import { forwardRef } from 'react';
import classNames from 'classnames';
import type { LegacyListOption, LegacyOrderingCriterion } from '@/lib/types/common';
import { DeadlineType } from '@/lib/types/enums';
import {
  CHANGE_THEME,
  TOGGLE_COMPLETED_ITEMS,
  IMPORTANCE,
  DEADLINE,
  MYDAY,
  TITLE,
  CREATION_DATE,
} from '@/lib/store/todoSlice';

type MenuLayerProps = ComponentProps<'div'>;

export function MenuLayer({ children }: MenuLayerProps) {
  return (
    <div className="invisible fixed top-0 left-0 z-[1000000] min-h-screen w-full">
      <div className="visible relative">{children}</div>
    </div>
  );
}

type MenuContainerProps = ComponentProps<'div'> & { title: string };

// eslint-disable-next-line prefer-arrow-callback
export const MenuContainer = forwardRef(function ForwardedMenuContainer(
  { title, style, children }: MenuContainerProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <div
      ref={ref}
      className="shadow-elevation absolute min-w-[200px] max-w-[290px] rounded-sm bg-white py-[6px]"
      style={style}
    >
      <div className="mb-[6px] border-b border-solid border-gray-200 p-2 pb-3 text-center text-[14px] font-semibold text-gray-700">
        {title}
      </div>
      {children}
    </div>
  );
});

type MenuItemProps = {
  type: LegacyListOption | LegacyOrderingCriterion | DeadlineType;
  onClick: MouseEventHandler<HTMLButtonElement>;
  title?: string;
};

export function MenuItem({ type, onClick, title = undefined }: MenuItemProps) {
  const itemClassNames = 'relative flex items-center text-[14px]';
  const buttonClassNames =
    'relative flex h-9 w-full items-center border-0 px-1 text-left text-[14px] text-gray-900';
  const iconClassNames = 'inline-flex h-[30px] w-[30px] items-center justify-center text-[16px]';
  const titleClassNames = 'mx-2 flex-1';

  switch (type) {
    case CHANGE_THEME:
      return (
        <li className={itemClassNames}>
          <button type="button" className={buttonClassNames} onClick={onClick}>
            <span className={iconClassNames}>
              <i className="fas fa-palette" />
            </span>
            <span className={titleClassNames}>테마 변경</span>
            <span className={iconClassNames}>
              <i className="fas fa-chevron-right" />
            </span>
          </button>
        </li>
      );
    case TOGGLE_COMPLETED_ITEMS:
      return (
        <li className={itemClassNames}>
          <button type="button" className={buttonClassNames} onClick={onClick}>
            <span className={iconClassNames}>
              <i className="far fa-check-circle" />
            </span>
            <span className={titleClassNames}>{title ?? '완료된 작업 표시/숨기기'}</span>
          </button>
        </li>
      );
    case IMPORTANCE:
      return (
        <li className={itemClassNames}>
          <button type="button" className={buttonClassNames} onClick={onClick}>
            <span className={iconClassNames}>
              <i className="far fa-star" />
            </span>
            <span className={titleClassNames}>중요도</span>
          </button>
        </li>
      );
    case DEADLINE:
      return (
        <li className={itemClassNames}>
          <button type="button" className={buttonClassNames} onClick={onClick}>
            <span className={iconClassNames}>
              <i className="far fa-calendar-alt" />
            </span>
            <span className={titleClassNames}>기한</span>
          </button>
        </li>
      );
    case MYDAY:
      return (
        <li className={itemClassNames}>
          <button type="button" className={buttonClassNames} onClick={onClick}>
            <span className={iconClassNames}>
              <i className="far fa-sun" />
            </span>
            <span className={titleClassNames}>나의 하루에 추가됨</span>
          </button>
        </li>
      );
    case TITLE:
      return (
        <li className={itemClassNames}>
          <button type="button" className={buttonClassNames} onClick={onClick}>
            <span className={classNames(iconClassNames, 'rotate-90')}>
              <i className="fas fa-exchange-alt" />
            </span>
            <span className={titleClassNames}>제목</span>
          </button>
        </li>
      );
    case CREATION_DATE:
      return (
        <li className={itemClassNames}>
          <button type="button" className={buttonClassNames} onClick={onClick}>
            <span className={iconClassNames}>
              <i className="far fa-calendar-plus" />
            </span>
            <span className={titleClassNames}>만든 날짜</span>
          </button>
        </li>
      );
    case DeadlineType.Today:
      return (
        <li className={itemClassNames}>
          <button type="button" className={buttonClassNames} onClick={onClick}>
            <span className={classNames(iconClassNames, 'relative')}>
              <i className="far fa-calendar" />
              <i className="fas fa-square absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-[.25]" />
            </span>
            <span className={titleClassNames}>오늘</span>
          </button>
        </li>
      );
    case DeadlineType.Tomorrow:
      return (
        <li className={itemClassNames}>
          <button type="button" className={buttonClassNames} onClick={onClick}>
            <span className={classNames(iconClassNames, 'relative')}>
              <i className="far fa-calendar" />
              <i className="fas fa-arrow-right absolute top-[calc(50%+2px)] left-1/2 -translate-x-1/2 -translate-y-1/2 scale-[.55]" />
            </span>
            <span className={titleClassNames}>내일</span>
          </button>
        </li>
      );
    case DeadlineType.NextWeek:
      return (
        <li className={itemClassNames}>
          <button type="button" className={buttonClassNames} onClick={onClick}>
            <span className={classNames(iconClassNames, 'relative')}>
              <i className="far fa-calendar" />
              <i className="fas fa-angle-double-right absolute top-[calc(50%+1px)] left-1/2 -translate-x-1/2 -translate-y-1/2 scale-[.6]" />
            </span>
            <span className={titleClassNames}>다음 주</span>
          </button>
        </li>
      );
    case DeadlineType.ChooseDate:
      return (
        <li className={itemClassNames}>
          <button type="button" className={buttonClassNames} onClick={onClick}>
            <span className={classNames(iconClassNames, 'relative')}>
              <i className="far fa-calendar-alt" />
              <i className="far fa-clock absolute top-[calc(50%+6px)] left-[calc(50%+6px)] -translate-x-1/2 -translate-y-1/2 scale-[.6] bg-white" />
            </span>
            <span className={titleClassNames}>날짜 선택</span>
            <span className={iconClassNames}>
              <i className="fas fa-chevron-right" />
            </span>
          </button>
        </li>
      );
    default:
      return null;
  }
}
