import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import classNames from 'classnames/bind';
import { useDispatch, useSelector } from 'react-redux';
import { openSidebar, closeSidebar } from '@/store/todoSlice';
import dayjs from '@/plugins/dayjs';
import styles from './NavigationDrawer.module.scss';

const cx = classNames.bind(styles);

export default function NavigationDrawer() {
  const router = useRouter();
  const dispatch = useDispatch();
  const isActiveSidebar = useSelector(({ todo: state }) => state.isActiveSidebar);
  const smartListSettings = useSelector(({ todo: state }) => state.settings.smartList);
  const todoItems = useSelector(({ todo: state }) => state.todoItems);
  const pageSettings = useSelector(({ todo: state }) => state.pageSettings);
  const [ isMounted, setIsMounted ] = useState(false);

  const midnightToday = dayjs().startOf('day');
  const { autoHideEmptyLists } = smartListSettings;
  const incompleteTodoItems = todoItems.filter(item => !item.isComplete);
  const anchors = [
    {
      isHideAutomatically: false,
      key: 'myday',
      text: '오늘 할 일',
      href: '/tasks/myday',
      icon: {
        className: 'far fa-sun',
      },
      count: incompleteTodoItems.filter(item => item.isMarkedAsTodayTask).length,
    },
    {
      isHideAutomatically: (
        todoItems
          .filter(item => item.isImportant)
          .filter(item => !(item.isComplete && pageSettings['important'].isHideCompletedItems))
          .length === 0
      ),
      key: 'important',
      text: '중요',
      href: '/tasks/important',
      icon: {
        className: 'far fa-star',
      },
      count: incompleteTodoItems.filter(item => item.isImportant).length,
      textColor: 'text-blue-700',
    },
    {
      isHideAutomatically: (
        todoItems
          .filter(item => item.deadline)
          .filter(item => item.deadline >= Number(midnightToday.format('x')) || !item.isComplete)
          .filter(item => !(item.isComplete && pageSettings['planned'].isHideCompletedItems))
          .length === 0
      ),
      key: 'planned',
      text: '계획된 일정',
      href: '/tasks/planned',
      icon: {
        className: 'far fa-calendar-alt',
      },
      count: incompleteTodoItems.filter(item => item.deadline).length,
      textColor: 'text-blue-700',
    },
    {
      isHideAutomatically: todoItems.filter(item => !item.isComplete).length === 0,
      key: 'all',
      text: '모두',
      href: '/tasks/all',
      icon: {
        className: 'fas fa-infinity',
      },
      count: incompleteTodoItems.length,
      textColor: 'text-blue-700', // 테마 설정 가능
    },
    {
      isHideAutomatically: todoItems.filter(item => item.isComplete).length === 0,
      key: 'completed',
      text: '완료됨',
      href: '/tasks/completed',
      icon: {
        className: 'far fa-check-circle',
      },
      textColor: 'text-blue-700', // 테마 설정 가능
    },
    {
      isHideAutomatically: false,
      key: 'inbox',
      text: 'Tasks',
      href: '/tasks/inbox',
      hrefAliases: [
        '/tasks',
      ],
      icon: {
        className: 'fas fa-home text-blue-500', // 테마 설정 가능
      },
      count: incompleteTodoItems.length,
      textColor: 'text-blue-700', // 테마 설정 가능
    },
  ];

  useEffect(() => {
    if (!isMounted) {
      if (window.innerWidth < 920 && isActiveSidebar) {
        dispatch(closeSidebar());
      }

      setIsMounted(true);
    }
  });

  return (
    <>
      <div
        className={cx(
          'container',
          { 'is-active': isActiveSidebar },
        )}
      >
        <div className={cx('sidebar-header')}>
          <button
            className={cx('button')}
            title="사이드바 표시/숨기기"
            onClick={() => dispatch(isActiveSidebar ? closeSidebar() : openSidebar())}
          >
            <span className={cx('icon-wrapper')}>
              {isActiveSidebar ? (
                <i className="fas fa-chevron-left"></i>
              ) : (
                <i className="fas fa-chevron-right"></i>
              )}
              <span className="sr-only">사이드바 표시/숨기기</span>
            </span>
          </button>
        </div>
        <ul className="mt-2">
          {anchors.map((anchorItem) => {
            const isActiveSmartList = (smartListSettings[anchorItem.key] !== false) && !(autoHideEmptyLists && anchorItem.isHideAutomatically);

            return (isActiveSmartList ? (
              <li
                key={anchorItem.key}
                className={cx(
                  'sidebar-item',
                  { 'is-active': router.pathname === anchorItem.href || anchorItem.hrefAliases?.includes(router.pathname) },
                )}
              >
                <Link href={anchorItem.href}>
                  <a className={cx('sidebar-link')}>
                    <span className={cx('icon-wrapper')}>
                      <i className={anchorItem.icon.className}></i>
                    </span>
                    <span className={cx('link-text', 'is-title', anchorItem.textColor)}>
                      {anchorItem.text}
                    </span>
                    {anchorItem.count ? (
                      <span className={cx('link-text', anchorItem.textColor)}>
                        {anchorItem.count}
                      </span>
                    ) : null}
                  </a>
                </Link>
              </li>
            ) : null);
          })}
        </ul>
      </div>
      <div
        className={cx(
          'overlay',
          { 'is-active': isActiveSidebar },
        )}
        onClick={() => dispatch(closeSidebar())}
      />
    </>
  );
}
