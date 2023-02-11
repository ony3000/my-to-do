import { Fragment } from 'react';
import classNames from 'classnames';
import { IconContainer } from '@/components/layout';
import { Nullable, LegacyThemeColor } from '@/lib/types/common';
import { textColor } from '@/lib/utils/styles';

type ListHeadlineProps = {
  title?: Nullable<string>;
  isCollapsible: boolean;
  isCollapsed: boolean;
  onClick: () => void;
};

export function ListHeadline({
  title = '작업',
  isCollapsible,
  isCollapsed,
  onClick,
}: ListHeadlineProps) {
  return (
    <div
      className={classNames(
        'px-4',
        { hidden: title === null },
        { 'cursor-pointer': isCollapsible },
      )}
      onClick={onClick}
      aria-hidden="true"
    >
      <div className="flex h-[54px] items-center">
        {isCollapsible && (
          <IconContainer
            iconClassName={isCollapsed ? 'fas fa-chevron-right' : 'fas fa-chevron-down'}
          />
        )}
        <span className={classNames('my-2 mx-4 text-[16px] font-bold', { 'ml-0': !isCollapsible })}>
          {title ?? '작업'}
        </span>
      </div>
    </div>
  );
}

type ListItemProps = {
  baseColor?: LegacyThemeColor;
  title: string;
  metadata: Array<
    | { key: 'todayTask'; value: boolean }
    | { key: 'subStepProgress'; value: { completedCount: number; totalCount: number } }
    | {
        key: 'deadline';
        value: { timestamp: Nullable<number>; className: string; element: Nullable<JSX.Element> };
      }
    | { key: 'memo'; value: string }
    | { key: 'parentTitle'; value: string }
  >;
  isActive?: boolean;
  isComplete?: boolean;
  isImportant?: boolean;
  onToggleCheck: () => void;
  onClick: () => void;
  onToggleStar?: () => void;
};

export function ListItem({
  baseColor = 'blue',
  title,
  metadata,
  isActive = false,
  isComplete = false,
  isImportant = false,
  onToggleCheck,
  onClick,
  onToggleStar = undefined,
}: ListItemProps) {
  const buttonClassNames =
    'focus:shadow-like-outline-3 inline-flex h-8 w-8 items-center rounded-sm p-1 focus:shadow-blue-500 focus:outline-none';
  const metadataClassNames =
    'before:mx-1.5 before:text-gray-500 before:content-["•"] first:before:hidden';

  return (
    <div
      className={classNames(
        'shadow-like-border-b min-h-[52px] px-4 [&:hover+*>*]:shadow-transparent',
        { 'group hover:bg-gray-100 hover:shadow-gray-100': !isActive },
        { 'bg-lightBlue-100 shadow-lightBlue-100': isActive },
      )}
    >
      <div className="shadow-inner-like-border-t flex items-center shadow-gray-200 group-hover:shadow-transparent">
        <button
          type="button"
          className={classNames(buttonClassNames, '-ml-1', textColor(baseColor))}
          title={isComplete ? '완료되지 않음으로 표시' : '완료됨으로 표시'}
          onClick={onToggleCheck}
        >
          <IconContainer
            iconClassName={isComplete ? 'fas fa-check-circle' : 'far fa-circle'}
            iconLabel={isComplete ? '완료되지 않음으로 표시' : '완료됨으로 표시'}
          />
        </button>

        <button type="button" className="mx-1 min-h-[54px] flex-1 p-2 text-left" onClick={onClick}>
          <div className="text-[14px] text-gray-700">{title}</div>
          <div className="flex flex-wrap items-center text-[12px] leading-4 text-gray-500">
            {metadata.map((data) => {
              let innerElement = null;

              switch (data.key) {
                case 'todayTask':
                  if (data.value) {
                    innerElement = (
                      <span className={metadataClassNames}>
                        <IconContainer size="small" iconClassName="far fa-sun" />
                        <span>오늘 할 일</span>
                      </span>
                    );
                  }
                  break;
                case 'subStepProgress':
                  if (data.value.totalCount > 0) {
                    innerElement = (
                      <span className={metadataClassNames}>
                        <span>
                          {data.value.completedCount}/{data.value.totalCount}
                        </span>
                      </span>
                    );
                  }
                  break;
                case 'deadline':
                  if (data.value.timestamp) {
                    innerElement = (
                      <span className={classNames(metadataClassNames, data.value.className)}>
                        <IconContainer size="small" iconClassName="far fa-calendar" />
                        {data.value.element}
                      </span>
                    );
                  }
                  break;
                case 'memo':
                  if (data.value) {
                    innerElement = (
                      <span className={metadataClassNames}>
                        <IconContainer size="small" iconClassName="far fa-sticky-note" />
                        <span>노트</span>
                      </span>
                    );
                  }
                  break;
                case 'parentTitle':
                  innerElement = (
                    <span className={metadataClassNames}>
                      <span>{data.value}</span>
                    </span>
                  );
                  break;
                default:
                  return null;
              }

              return <Fragment key={data.key}>{innerElement}</Fragment>;
            })}
          </div>
        </button>

        {onToggleStar !== undefined && (
          <button
            type="button"
            className={classNames(
              buttonClassNames,
              '-mr-1',
              isImportant ? textColor(baseColor) : 'text-gray-400 hover:text-black',
            )}
            title={isImportant ? '중요도를 제거합니다.' : '작업을 중요로 표시합니다.'}
            onClick={onToggleStar}
          >
            <IconContainer
              iconClassName={isImportant ? 'fas fa-star' : 'far fa-star'}
              iconLabel={isImportant ? '중요도를 제거합니다.' : '작업을 중요로 표시합니다.'}
            />
          </button>
        )}
      </div>
    </div>
  );
}
