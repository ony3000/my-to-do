import { useRef } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames/bind';
import { useDispatch, useSelector } from 'react-redux';
import { createTodoItem } from '@/store/todoSlice';
import styles from './TaskInput.module.scss';

const cx = classNames.bind(styles);

export default function TaskInput({
  placeholder = '작업 추가',
  itemProps = {},
}) {
  const router = useRouter();
  const pageKey = router.pathname.replace(/^\/tasks\/?/, '') || 'inbox';
  const dispatch = useDispatch();
  const settingsPerPage = useSelector(({ todo: state }) => state.pageSettings[pageKey]);
  const $refs = {
    input: useRef(null),
  };

  const createTask = () => {
    const inputElement = $refs.input.current;
    const trimmedTitle = inputElement.value.trim();

    if (trimmedTitle) {
      dispatch(createTodoItem({
        title: trimmedTitle,
        ...itemProps,
      }));

      inputElement.value = '';
      inputElement.dataset.isEmpty = true;
    }
  };
  const keyUpHandler = (event) => {
    if (event.key === 'Enter') {
      createTask();

      setTimeout(() => $refs.input.current.focus());
    }
  };
  const inputHandler = (event) => {
    const inputElement = event.target;
    const isInputEmpty = (inputElement.value === '');

    if (inputElement.dataset.isEmpty !== String(isInputEmpty)) {
      inputElement.dataset.isEmpty = isInputEmpty;
    }
  };
  const blurHandler = (event) => {
    const inputElement = event.target;
    const trimmedTitle = inputElement.value.trim();

    if (trimmedTitle) {
      createTask();
    }
  };

  return (
    <div className={cx('container')}>
      <button
        className={cx(
          'button',
          'is-left',
          `text-${settingsPerPage.themeColor ? settingsPerPage.themeColor : 'blue'}-500`,
        )}
        title="작업 추가"
        onClick={() => $refs.input.current.focus()}
      >
        <span className={cx('icon-wrapper')}>
          <i className="fas fa-plus"></i>
          <span className="sr-only">작업 추가</span>
        </span>
      </button>

      <input
        ref={$refs.input}
        className={cx(
          'input',
          `placeholder-${settingsPerPage.themeColor ? settingsPerPage.themeColor : 'blue'}-500`,
        )}
        type="text"
        placeholder={placeholder}
        maxLength={255}
        data-is-empty={true}
        onKeyUp={e => keyUpHandler(e)}
        onInput={e => inputHandler(e)}
        onBlur={e => blurHandler(e)}
      />

      <button
        className={cx(
          'button',
          'is-right',
          'is-submit',
          `text-${settingsPerPage.themeColor ? settingsPerPage.themeColor : 'blue'}-500`,
        )}
        title="추가"
        onClick={() => createTask()}
      >
        <span className={cx('icon-wrapper')}>
          <span>추가</span>
        </span>
      </button>
    </div>
  );
}
