import { useRef, KeyboardEventHandler, FormEventHandler, FocusEventHandler } from 'react';
import { useRouter } from 'next/router';
import invariant from 'tiny-invariant';
import classNames from 'classnames';
import { IconContainer } from '@/components/layout';
import { isOneOf } from '@/lib/types/guard';
import { SettingsPerPage } from '@/lib/types/store/todoSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks/index';
import { createSubStep } from '@/lib/store/todoSlice';
import { textColor, placeholderColor } from '@/lib/utils/styles';

type StepInputProps = {
  placeholder?: string;
  taskId: string;
};

export default function StepInput({ placeholder = '다음 단계', taskId }: StepInputProps) {
  const router = useRouter();
  const pageKey = router.pathname.replace(/^\/tasks\/?/, '') || 'inbox';

  invariant(
    isOneOf(pageKey, [
      'myday',
      'important',
      'planned',
      'all',
      'completed',
      'inbox',
      'search',
      'search/[keyword]',
    ]),
  );

  const dispatch = useAppDispatch();
  const settingsPerPage = useAppSelector<SettingsPerPage>(
    ({ todo: state }) => state.pageSettings[pageKey],
  );
  const $refs = {
    input: useRef<HTMLInputElement>(null),
  };

  const createStep = () => {
    const inputElement = $refs.input.current;

    if (inputElement) {
      const trimmedTitle = inputElement.value.trim();

      if (trimmedTitle) {
        dispatch(
          createSubStep({
            taskId,
            title: trimmedTitle,
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
      createStep();

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
      createStep();
    }
  };

  const buttonClassNames =
    'inline-flex h-8 w-8 items-center rounded-sm p-1 focus:shadow-[0_0_0_1px_#fff,0_0_0_3px_#3b82f6] focus:outline-none';

  return (
    <div className="px-1">
      <div className="flex h-10 items-center">
        <button
          type="button"
          className={classNames(buttonClassNames, textColor(settingsPerPage.themeColor))}
          title="작업 추가"
          onClick={() => focusInput()}
        >
          <IconContainer iconClassName="fas fa-plus" iconLabel="작업 추가" />
        </button>

        <input
          ref={$refs.input}
          className={classNames(
            'peer flex-1 px-1.5 py-1 text-[14px] text-gray-700 focus:placeholder-gray-500',
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
            'text-[12px] peer-data-[is-empty=true]:hidden',
            textColor(settingsPerPage.themeColor),
          )}
          title="추가"
          onClick={() => createStep()}
        >
          <span className="inline-flex h-6 w-6 items-center justify-center">
            <span>추가</span>
          </span>
        </button>
      </div>
    </div>
  );
}
