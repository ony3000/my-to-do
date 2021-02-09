import React from 'react';
import Link from 'next/link';
import { withRouter } from 'next/router';
import classNames from 'classnames/bind';
import styles from './AppLeftColumn.module.scss';

const cx = classNames.bind(styles);

class AppLeftColumn extends React.Component {
  render() {
    const { router } = this.props;
    const anchors = [
      {
        key: 'myday',
        text: '오늘 할 일',
        href: '/tasks/myday',
        icon: {
          className: 'far fa-sun',
        },
        count: 0,
      },
      {
        key: 'important',
        text: '중요',
        href: '/tasks/important',
        icon: {
          className: 'far fa-star',
        },
        count: 1,
        textColor: 'text-blue-700',
      },
      {
        key: 'planned',
        text: '계획된 일정',
        href: '/tasks/planned',
        icon: {
          className: 'far fa-calendar-alt',
        },
        count: 2,
        textColor: 'text-blue-700',
      },
      {
        key: 'all',
        text: '모두',
        href: '/tasks/all',
        icon: {
          className: 'fas fa-infinity',
        },
        count: 4,
        textColor: 'text-blue-700', // 테마 설정 가능
      },
      {
        key: 'completed',
        text: '완료됨',
        href: '/tasks/completed',
        icon: {
          className: 'far fa-check-circle',
        },
        textColor: 'text-blue-700', // 테마 설정 가능
      },
      {
        key: 'inbox',
        text: 'Tasks',
        href: '/tasks/inbox',
        hrefAliases: [
          '/tasks',
        ],
        icon: {
          className: 'fas fa-home text-blue-500', // 테마 설정 가능
        },
        count: 4,
        textColor: 'text-blue-700', // 테마 설정 가능
      },
    ];

    return (
      <div
        className={cx(
          'container',
          { 'is-active': true },
        )}
      >
        <div className={cx('sidebar-header')}>
          <button
            className={cx('button')}
            title="사이드바 표시/숨기기"
          >
            <span className={cx('icon-wrapper')}>
              <i className="fas fa-bars"></i>
              <span className="sr-only">사이드바 표시/숨기기</span>
            </span>
          </button>
        </div>
        <ul className="mt-2">
          {anchors.map((anchorItem) => (
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
          ))}
        </ul>
      </div>
    );
  }
}

export default withRouter(AppLeftColumn);
