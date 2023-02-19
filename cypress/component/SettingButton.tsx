import classNames from 'classnames';
import { useAppDispatch, useAppSelector } from '@/lib/hooks/index';
import { openSettingPanel, closeSettingPanel } from '@/lib/store/todoSlice';

export default function SettingButton() {
  const dispatch = useAppDispatch();
  const isActiveSettingPanel = useAppSelector(({ todo: state }) => state.isActiveSettingPanel);

  return (
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
  );
}
