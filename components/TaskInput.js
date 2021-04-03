import { useRef } from 'react';
import classNames from 'classnames/bind';
import { useDispatch } from 'react-redux';
import { createTodoItem } from '@/store/todoSlice';
import styles from './TaskInput.module.scss';

const cx = classNames.bind(styles);

export default function TaskInput({
  placeholder = '작업 추가',
  itemProps = {},
}) {
  const dispatch = useDispatch();
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
      {/* 테마 색상 */}
      <button
        className={cx('button', 'is-left')}
        title="작업 추가"
        onClick={() => $refs.input.current.focus()}
      >
        <span className={cx('icon-wrapper')}>
          <i className="fas fa-plus"></i>
          <span className="sr-only">작업 추가</span>
        </span>
      </button>

      {/* 엔터 입력 또는 input blur 시, trim 결과가 비어있지 않으면 작업 추가 */}
      <input
        ref={$refs.input}
        className={cx('input')}
        type="text"
        placeholder={placeholder}
        data-is-empty={true}
        onKeyUp={e => keyUpHandler(e)}
        onInput={e => inputHandler(e)}
        onBlur={e => blurHandler(e)}
      />

      {/* 테마 색상, 작업 입력창의 값이 비어있지 않을 때만 노출됨 */}
      <button
        className={cx('button', 'is-right', 'is-submit')}
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
