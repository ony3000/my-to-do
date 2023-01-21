import classNames from 'classnames/bind';
import { useAppDispatch, useAppSelector } from '@/lib/hooks/index';
import { openSettingPanel, closeSettingPanel } from '@/lib/store/todoSlice';
import styles from './AppHeader.module.scss';
import { SearchBox } from '@/components/input';

const cx = classNames.bind(styles);

export default function AppHeader() {
  const dispatch = useAppDispatch();
  const isActiveSettingPanel = useAppSelector(({ todo: state }) => state.isActiveSettingPanel);

  return (
    <div className="flex h-12 items-center justify-between bg-blue-500">
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a className={cx('home-link')} href="/">
        To Do
      </a>
      <SearchBox />
      <button
        type="button"
        className={cx('button', { 'is-active': isActiveSettingPanel })}
        title="설정"
        onClick={() => dispatch(isActiveSettingPanel ? closeSettingPanel() : openSettingPanel())}
      >
        <i className="fas fa-cog" />
        <span className="sr-only">설정</span>
      </button>
    </div>
  );
}
