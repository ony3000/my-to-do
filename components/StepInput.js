import { useRef } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames/bind';
import { useDispatch, useSelector } from 'react-redux';
import { createTodoItem, createSubStep } from '@/store/todoSlice';
import styles from './StepInput.module.scss';

const cx = classNames.bind(styles);

export default function StepInput({
  placeholder = '다음 단계',
  taskId,
}) {
  const router = useRouter();
  const pageKey = router.pathname.replace(/^\/tasks\/?/, '') || 'inbox';
  const dispatch = useDispatch();
  const settingsPerPage = useSelector(({ todo: state }) => state.pageSettings[pageKey]);
  const $refs = {
    input: useRef(null),
  };

  const createStep = () => {
    const inputElement = $refs.input.current;
    const trimmedTitle = inputElement.value.trim();

    if (trimmedTitle) {
      dispatch(createSubStep({
        taskId,
        title: trimmedTitle,
      }));

      inputElement.value = '';
      inputElement.dataset.isEmpty = true;
    }
  };
  const keyUpHandler = (event) => {
    if (event.key === 'Enter') {
      createStep();

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
      createStep();
    }
  };

  return (
    <div className={cx('container')}>
      <div className={cx('body')}>
        <button
          className={cx(
            'button',
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
            'is-submit',
            `text-${settingsPerPage.themeColor ? settingsPerPage.themeColor : 'blue'}-500`,
          )}
          title="추가"
          onClick={() => createStep()}
        >
          <span className={cx('icon-wrapper')}>
            <span>추가</span>
          </span>
        </button>
      </div>
    </div>
  );
}
