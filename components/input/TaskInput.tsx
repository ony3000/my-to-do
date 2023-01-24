import { useRef, KeyboardEventHandler, FormEventHandler, FocusEventHandler } from 'react';
import { useRouter } from 'next/router';
import invariant from 'tiny-invariant';
import classNames from 'classnames';
import { IconContainer } from '@/components/layout';
import { isOneOf } from '@/lib/types/guard';
import { TodoItem, SettingsPerPage } from '@/lib/types/store/todoSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks/index';
import { createTodoItem } from '@/lib/store/todoSlice';
import { textColor, placeholderColor } from '@/lib/utils/styles';

type TaskInputProps = {
  placeholder?: string;
  itemProps?: Partial<TodoItem>;
};

export default function TaskInput({ placeholder = '작업 추가', itemProps = {} }: TaskInputProps) {
  const router = useRouter();
  const pageKey = router.pathname.replace(/^\/tasks\/?/, '') || 'inbox';

  invariant(isOneOf(pageKey, ['myday', 'important', 'planned', 'all', 'inbox']));

  const dispatch = useAppDispatch();
  const settingsPerPage = useAppSelector<SettingsPerPage>(
    ({ todo: state }) => state.pageSettings[pageKey],
  );
  const $refs = {
    input: useRef<HTMLInputElement>(null),
  };

  const createTask = () => {
    const inputElement = $refs.input.current;

    if (inputElement) {
      const trimmedTitle = inputElement.value.trim();

      if (trimmedTitle) {
        dispatch(
          createTodoItem({
            title: trimmedTitle,
            ...itemProps,
          }),
        );

        inputElement.value = '';
        inputElement.dataset.isEmpty = String(true);
      }
    }
  };
  const focusInput = () => {
    if ($refs.input.current) {
      $refs.input.current.focus();
    }
  };
  const keyUpHandler: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === 'Enter') {
      createTask();

      setTimeout(() => focusInput());
    }
  };
  const inputHandler: FormEventHandler<HTMLInputElement> = (event) => {
    const inputElement = event.currentTarget;
    const isInputEmpty = inputElement.value === '';

    if (inputElement.dataset.isEmpty !== String(isInputEmpty)) {
      inputElement.dataset.isEmpty = String(isInputEmpty);
    }
  };
  const blurHandler: FocusEventHandler<HTMLInputElement> = (event) => {
    const inputElement = event.currentTarget;
    const trimmedTitle = inputElement.value.trim();

    if (trimmedTitle) {
      createTask();
    }
  };

  const buttonClassNames =
    'inline-flex h-8 w-8 items-center rounded-sm p-1 focus:shadow-[0_0_0_1px_#fff,0_0_0_3px_#3b82f6] focus:outline-none';

  return (
    <div className="flex h-full items-center shadow-[0_1px_0_0_#e4e4e7]">
      <button
        type="button"
        className={classNames(buttonClassNames, '-ml-1', textColor(settingsPerPage.themeColor))}
        title="작업 추가"
        onClick={() => focusInput()}
      >
        <IconContainer iconClassName="fas fa-plus" iconLabel="작업 추가" />
      </button>

      <input
        ref={$refs.input}
        className={classNames(
          'peer mx-1 h-full flex-1 p-2 text-[14px] text-gray-700 focus:placeholder-gray-500',
          placeholderColor(settingsPerPage.themeColor),
        )}
        type="text"
        placeholder={placeholder}
        maxLength={255}
        data-is-empty
        onKeyUp={(e) => keyUpHandler(e)}
        onInput={(e) => inputHandler(e)}
        onBlur={(e) => blurHandler(e)}
      />

      <button
        type="button"
        className={classNames(
          buttonClassNames,
          '-mr-1 text-[12px] peer-data-[is-empty=true]:hidden',
          textColor(settingsPerPage.themeColor),
        )}
        title="추가"
        onClick={() => createTask()}
      >
        <span className="inline-flex h-6 w-6 items-center justify-center">
          <span>추가</span>
        </span>
      </button>
    </div>
  );
}
