import { useRef, FormEventHandler, FocusEventHandler } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import { useAppDispatch, useAppSelector } from '@/lib/hooks/index';
import { openSearchBox, closeSearchBox } from '@/lib/store/todoSlice';

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
    } else {
      router.push(`/tasks/search/${encodedKeyword}`);
    }
  };
  const blurHandler: FocusEventHandler<HTMLInputElement> = (event) => {
    const inputElement = event.currentTarget;

    if (!inputElement.value) {
      deactivateSearchBox();
    }
  };

  const buttonClassNames =
    'h-8 w-8 items-center text-blue-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-900';
  const iconClassNames = 'inline-flex h-8 w-8 items-center justify-center';

  return (
    <div
      className={classNames(
        'mx-2.5 flex min-w-0 max-w-[400px] flex-1 rounded-sm hover:bg-white hover:shadow-[0_0_0_1px_#fff]',
        { 'bg-blue-200': !isActiveSearchBox },
        { 'bg-white': isActiveSearchBox },
      )}
    >
      <button
        type="button"
        className={classNames(buttonClassNames, 'inline-flex', { 'flex-1': !isActiveSearchBox })}
        title="검색"
        onClick={() => activateSearchBox()}
      >
        <span className={iconClassNames}>
          <i className="fas fa-search" />
          <span className="sr-only">검색</span>
        </span>
      </button>
      <input
        ref={$refs.input}
        className={classNames('min-w-0 flex-1 px-2.5 text-sm', { hidden: !isActiveSearchBox })}
        type="text"
        placeholder="검색"
        disabled={!isActiveSearchBox}
        onInput={(e) => inputHandler(e)}
        onBlur={(e) => blurHandler(e)}
        defaultValue={keyword}
      />
      <button
        type="button"
        className={classNames(
          buttonClassNames,
          { hidden: !isActiveSearchBox },
          { 'inline-flex': isActiveSearchBox },
        )}
        title="검색 종료"
        disabled={!isActiveSearchBox}
        onClick={() => deactivateSearchBox()}
      >
        <span className={iconClassNames}>
          <i className="fas fa-times" />
          <span className="sr-only">검색 종료</span>
        </span>
      </button>
    </div>
  );
}
