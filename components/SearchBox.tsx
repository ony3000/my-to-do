import { useRef, FormEventHandler, FocusEventHandler } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames/bind';
import { useAppDispatch, useAppSelector } from '@/lib/hooks/index';
import { openSearchBox, closeSearchBox } from '@/lib/store/todoSlice';
import styles from './SearchBox.module.scss';

const cx = classNames.bind(styles);

export default function SearchBox() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isActiveSearchBox = useAppSelector(({ todo: state }) => state.isActiveSearchBox);
  const $refs = {
    input: useRef<HTMLInputElement>(null),
  };

  const { keyword = '' } = router.query;

  const activateSearchBox = () => {
    if (!isActiveSearchBox) {
      dispatch(openSearchBox());
    }

    setTimeout(() => {
      if ($refs.input.current) {
        $refs.input.current.focus();
      }
    });
  };
  const deactivateSearchBox = () => {
    if ($refs.input.current) {
      $refs.input.current.value = '';
    }

    if (isActiveSearchBox) {
      dispatch(closeSearchBox());
    }

    router.push('/tasks/inbox');
  };
  const inputHandler: FormEventHandler<HTMLInputElement> = (event) => {
    const inputElement = event.currentTarget;
    const encodedKeyword = encodeURIComponent(inputElement.value);

    if (router.pathname.startsWith('/tasks/search')) {
      router.replace(`/tasks/search/${encodedKeyword}`);
    }
    else {
      router.push(`/tasks/search/${encodedKeyword}`);
    }
  };
  const blurHandler: FocusEventHandler<HTMLInputElement> = (event) => {
    const inputElement = event.currentTarget;

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
        defaultValue={keyword}
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
