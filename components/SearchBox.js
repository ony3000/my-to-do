import React from 'react';
import classNames from 'classnames/bind';
import styles from './SearchBox.module.scss';

const cx = classNames.bind(styles);

class SearchBox extends React.Component {
  render() {
    return (
      <div
        className={cx(
          'container',
          { 'is-active': true },
        )}
      >
        <button
          className={cx('button')}
          title="검색"
        >
          <i className="fas fa-search"></i>
          <span className="sr-only">검색</span>
        </button>
        <input
          className={cx('input')}
          type="text"
          placeholder="검색"
          disabled={false /* .container의 .is-active 조건과 반대 */}
        />
        <button
          className={cx('button')}
          title="검색 종료"
          disabled={false /* .container의 .is-active 조건과 반대 */}
        >
          <i className="fas fa-times"></i>
          <span className="sr-only">검색 종료</span>
        </button>
      </div>
    );
  }
}

export default SearchBox;
