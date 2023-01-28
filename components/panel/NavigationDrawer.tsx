import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import invariant from 'tiny-invariant';
import classNames from 'classnames';
import { IconContainer } from '@/components/layout';
import { isOneOf } from '@/lib/types/guard';
import { useAppDispatch, useAppSelector } from '@/lib/hooks/index';
import { openSidebar, closeSidebar } from '@/lib/store/todoSlice';
import dayjs from '@/lib/plugins/dayjs';
import { textColor, textBoldColor } from '@/lib/utils/styles';

type AnchorItem = {
  isHideAutomatically: boolean;
  key: string;
  text: string;
  href: string;
  hrefAliases?: string[];
  icon: {
    className: string;
  };
  count?: number;
  textColor?: string;
};

export default function NavigationDrawer() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isActiveSidebar = useAppSelector(({ todo: state }) => state.isActiveSidebar);
  const smartListSettings = useAppSelector(({ todo: state }) => state.settings.smartList);
  const todoItems = useAppSelector(({ todo: state }) => state.todoItems);
  const pageSettings = useAppSelector(({ todo: state }) => state.pageSettings);
  const [isRendered, setIsRendered] = useState(false);

  const midnightToday = dayjs().startOf('day');
  const { autoHideEmptyLists } = smartListSettings;
  const incompleteTodoItems = todoItems.filter((item) => !item.isComplete);
  const anchors: AnchorItem[] = [
    {
      isHideAutomatically: false,
      key: 'myday',
      text: '오늘 할 일',
      href: '/tasks/myday',
      icon: {
        className: 'far fa-sun',
      },
      count: incompleteTodoItems.filter((item) => item.isMarkedAsTodayTask).length,
    },
    {
      isHideAutomatically:
        todoItems
          .filter((item) => item.isImportant)
          .filter((item) => !(item.isComplete && pageSettings.important.isHideCompletedItems))
          .length === 0,
      key: 'important',
      text: '중요',
      href: '/tasks/important',
      icon: {
        className: 'far fa-star',
      },
      count: incompleteTodoItems.filter((item) => item.isImportant).length,
      textColor: 'text-blue-700',
    },
    {
      isHideAutomatically:
        todoItems
          .filter(
            (item) =>
              item.deadline &&
              (item.deadline >= Number(midnightToday.format('x')) || !item.isComplete),
          )
          .filter((item) => !(item.isComplete && pageSettings.planned.isHideCompletedItems))
          .length === 0,
      key: 'planned',
      text: '계획된 일정',
      href: '/tasks/planned',
      icon: {
        className: 'far fa-calendar-alt',
      },
      count: incompleteTodoItems.filter((item) => item.deadline).length,
      textColor: 'text-blue-700',
    },
    {
      isHideAutomatically: todoItems.filter((item) => !item.isComplete).length === 0,
      key: 'all',
      text: '모두',
      href: '/tasks/all',
      icon: {
        className: 'fas fa-infinity',
      },
      count: incompleteTodoItems.length,
      textColor: textBoldColor(pageSettings.all.themeColor),
    },
    {
      isHideAutomatically: todoItems.filter((item) => item.isComplete).length === 0,
      key: 'completed',
      text: '완료됨',
      href: '/tasks/completed',
      icon: {
        className: 'far fa-check-circle',
      },
      textColor: textBoldColor(pageSettings.completed.themeColor),
    },
    {
      isHideAutomatically: false,
      key: 'inbox',
      text: 'Tasks',
      href: '/tasks/inbox',
      hrefAliases: ['/tasks'],
      icon: {
        className: `fas fa-home ${textColor(pageSettings.inbox.themeColor)}`,
      },
      count: incompleteTodoItems.length,
      textColor: textBoldColor(pageSettings.inbox.themeColor),
    },
  ];

  useEffect(() => {
    if (!isRendered) {
      if (window.innerWidth < 920 && isActiveSidebar) {
        dispatch(closeSidebar());
      }

      setIsRendered(true);
    }
  }, [dispatch, isActiveSidebar, isRendered]);

  return (
    <>
      <div
        className={classNames(
          'box-content border-r border-solid border-gray-200 bg-gray-100 transition-[width] duration-200 max-[770px]:absolute max-[770px]:top-0 max-[770px]:left-0 max-[770px]:z-[60] max-[770px]:h-full',
          { 'w-[50px]': !isActiveSidebar },
          { 'w-[200px] min-[1010px]:w-[290px]': isActiveSidebar },
        )}
      >
        <div className="mt-3 flex h-12 items-center px-2">
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center p-1 text-blue-500 hover:bg-white hover:shadow-[0_0_0_1px_#e4e4e7] focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-900"
            title="사이드바 표시/숨기기"
            onClick={() => dispatch(isActiveSidebar ? closeSidebar() : openSidebar())}
          >
            <IconContainer
              iconClassName={isActiveSidebar ? 'fas fa-chevron-left' : 'fas fa-chevron-right'}
              iconLabel="사이드바 표시/숨기기"
            />
          </button>
        </div>
        <div className="mt-2 max-h-[calc(100%-68px)] overflow-y-auto overflow-x-hidden">
          <ul>
            {anchors.map((anchorItem) => {
              invariant(
                isOneOf(anchorItem.key, [
                  'myday',
                  'important',
                  'planned',
                  'all',
                  'completed',
                  'inbox',
                ]),
              );

              const isActiveSmartList =
                isOneOf(anchorItem.key, ['myday', 'inbox']) ||
                (smartListSettings[anchorItem.key] !== false &&
                  !(autoHideEmptyLists && anchorItem.isHideAutomatically));
              const isActiveRoute =
                router.pathname === anchorItem.href ||
                anchorItem.hrefAliases?.includes(router.pathname);

              return isActiveSmartList ? (
                <li
                  key={anchorItem.key}
                  className={classNames(
                    { 'hover:bg-gray-50': !isActiveRoute },
                    { 'bg-gray-200 font-bold': isActiveRoute },
                  )}
                >
                  <Link
                    href={anchorItem.href}
                    className="flex h-9 items-center overflow-hidden whitespace-nowrap px-3"
                  >
                    <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center text-gray-500">
                      <i className={anchorItem.icon.className} />
                    </span>
                    <span
                      className={classNames(
                        'ml-2 flex-1 text-[14px]',
                        { hidden: !isActiveSidebar },
                        { 'text-gray-700': !isActiveRoute },
                        { [anchorItem.textColor ?? '']: isActiveRoute },
                      )}
                    >
                      {anchorItem.text}
                    </span>
                    {anchorItem.count ? (
                      <span
                        className={classNames(
                          'text-[14px]',
                          { hidden: !isActiveSidebar },
                          { 'text-gray-700': !isActiveRoute },
                          { [anchorItem.textColor ?? '']: isActiveRoute },
                        )}
                      >
                        {anchorItem.count}
                      </span>
                    ) : null}
                  </Link>
                </li>
              ) : null;
            })}
          </ul>
        </div>
      </div>
      <div
        className={classNames(
          'hidden max-[770px]:absolute max-[770px]:top-0 max-[770px]:left-0 max-[770px]:block max-[770px]:h-full max-[770px]:w-full max-[770px]:bg-gray-700 max-[770px]:transition-opacity max-[770px]:duration-200',
          { 'pointer-events-none max-[770px]:z-0 max-[770px]:opacity-0': !isActiveSidebar },
          {
            'max-[770px]:pointer-events-auto max-[770px]:z-50 max-[770px]:opacity-40':
              isActiveSidebar,
          },
        )}
        onClick={() => dispatch(closeSidebar())}
        aria-hidden="true"
      />
    </>
  );
}
