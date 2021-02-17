import React from 'react';
import classNames from 'classnames/bind';
import styles from './AppSplash.module.scss';

const cx = classNames.bind(styles);

class AppSplash extends React.Component {
  render() {
    return (
      <main className={cx('main')}>
        <img className={cx('icon')} src="/images/todo_check.png" alt="" />

        <span className={cx('spinner', 'animate-spin')}>
          <span className="sr-only">Loading...</span>
        </span>
      </main>
    );
  }
}

export default AppSplash;
