import { useRef } from 'react';
import classNames from 'classnames/bind';
import { useDispatch, useSelector } from 'react-redux';
import { openSearchBox, closeSearchBox } from '@/store/todoSlice';
import styles from './SearchBox.module.scss';

const cx = classNames.bind(styles);

export default function SearchBox() {
  const dispatch = useDispatch();
  const isActiveSearchBox = useSelector(({ todo: state }) => state.isActiveSearchBox);
  const $refs = {
    input: useRef(null),
  };

  const activateSearchBox = () => {
    if (!isActiveSearchBox) {
      dispatch(openSearchBox());
    }

    setTimeout(() => $refs.input.current.focus());
  };
  const deactivateSearchBox = () => {
    $refs.input.current.value = '';

    if (isActiveSearchBox) {
      dispatch(closeSearchBox());
    }
  };
  const inputHandler = (event) => {
    const inputElement = event.target;
    const encodedKeyword = encodeURIComponent(inputElement.value);

    if (encodedKeyword) {
      console.log(`Route URL to [/tasks/search/${encodedKeyword}]`);
    }
    else {
      console.log(`Route URL to [/tasks/search]`);
    }
  };
  const blurHandler = (event) => {
    const inputElement = event.target;

    if (!inputElement.value) {
      deactivateSearchBox();
    }
  };

  return (
    <div
      className={cx(
        'container',
        { 'is-active': isActiveSearchBox },
      )}
    >
      <button
        className={cx('button', 'is-opener')}
        title="검색"
        onClick={() => activateSearchBox()}
      >
        <span className={cx('icon-wrapper')}>
          <i className="fas fa-search"></i>
          <span className="sr-only">검색</span>
        </span>
      </button>
      <input
        ref={$refs.input}
        className={cx('input')}
        type="text"
        placeholder="검색"
        disabled={!isActiveSearchBox}
        onInput={e => inputHandler(e)}
        onBlur={e => blurHandler(e)}
      />
      <button
        className={cx('button', 'is-closer')}
        title="검색 종료"
        disabled={!isActiveSearchBox}
        onClick={() => deactivateSearchBox()}
      >
        <span className={cx('icon-wrapper')}>
          <i className="fas fa-times"></i>
          <span className="sr-only">검색 종료</span>
        </span>
      </button>
    </div>
  );
}
