import React from 'react';
import Link from 'next/link';
import { withRouter } from 'next/router';

class AppLeftColumn extends React.Component {
  render() {
    const { router } = this.props;
    const anchors = [
      {
        key: 'myday',
        text: '오늘 할 일',
        href: '/tasks/myday',
      },
      {
        key: 'important',
        text: '중요',
        href: '/tasks/important',
      },
      {
        key: 'planned',
        text: '계획된 일정',
        href: '/tasks/planned',
      },
      {
        key: 'inbox',
        text: 'Tasks',
        href: '/tasks/inbox',
        hrefAliases: [
          '/tasks',
        ],
      },
    ];

    return (
      <div>
        <ul>
          {anchors.map((anchorItem) => (
            <li
              key={anchorItem.key}
              className={router.pathname === anchorItem.href || anchorItem.hrefAliases?.includes(router.pathname) ? 'font-bold' : ''}
            >
              <Link href={anchorItem.href}>
                <a className="block">{anchorItem.text}</a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default withRouter(AppLeftColumn);
