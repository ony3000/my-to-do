import React from 'react';
import classNames from 'classnames/bind';
import styles from './AppHeader.module.scss';
import SearchBox from '../SearchBox';

const cx = classNames.bind(styles);

class AppHeader extends React.Component {
  render() {
    return (
      <div className="bg-blue-500 h-12 flex items-center justify-between">
        <a className={cx('home-link')} href="/">
          To Do
        </a>
        <SearchBox />
        <button
          className={cx(
            'button',
            { 'is-active': false },
          )}
          title="설정"
          onClick={() => this.toggleContainer()}
        >
          <i className="fas fa-cog"></i>
          <span className="sr-only">설정</span>
        </button>
      </div>
    );
  }

  toggleContainer() {
    console.log('Toggle setting container');
  }
}

export default AppHeader;
