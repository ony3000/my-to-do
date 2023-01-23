import classNames from 'classnames';
import { useAppDispatch, useAppSelector } from '@/lib/hooks/index';
import { openSettingPanel, closeSettingPanel } from '@/lib/store/todoSlice';
import { SearchBox } from '@/components/input';

export default function AppHeader() {
  const dispatch = useAppDispatch();
  const isActiveSettingPanel = useAppSelector(({ todo: state }) => state.isActiveSettingPanel);

  return (
    <div className="flex h-12 items-center justify-between bg-blue-500">
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a
        className="mx-2.5 inline-flex h-full items-center font-bold text-white focus:outline-white"
        href="/"
      >
        To Do
      </a>
      <SearchBox />
      <button
        type="button"
        className={classNames(
          'h-12 w-12 -outline-offset-1 hover:bg-blue-700 hover:text-white hover:transition-all hover:duration-200 focus:outline focus:outline-1 active:bg-blue-900',
          { 'text-white focus:outline-white': !isActiveSettingPanel },
          { 'bg-gray-100 text-blue-500 focus:outline-blue-500': isActiveSettingPanel },
        )}
        title="설정"
        onClick={() => dispatch(isActiveSettingPanel ? closeSettingPanel() : openSettingPanel())}
      >
        <i className="fas fa-cog" />
        <span className="sr-only">설정</span>
      </button>
    </div>
  );
}
