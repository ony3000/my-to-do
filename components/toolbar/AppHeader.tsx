import classNames from 'classnames/bind';
import { useAppDispatch, useAppSelector } from '@/lib/hooks/index';
import { openSettingPanel, closeSettingPanel } from '@/lib/store/todoSlice';
import styles from './AppHeader.module.scss';
import SearchBox from '@/components/input/SearchBox';

const cx = classNames.bind(styles);

export default function AppHeader() {
  const dispatch = useAppDispatch();
  const isActiveSettingPanel = useAppSelector(({ todo: state }) => state.isActiveSettingPanel);

  return (
    <div className="bg-blue-500 h-12 flex items-center justify-between">
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a className={cx('home-link')} href="/">
        To Do
      </a>
      <SearchBox />
      <button
        className={cx(
          'button',
          { 'is-active': isActiveSettingPanel },
        )}
        title="설정"
        onClick={() => dispatch(isActiveSettingPanel ? closeSettingPanel() : openSettingPanel())}
      >
        <i className="fas fa-cog"></i>
        <span className="sr-only">설정</span>
      </button>
    </div>
  );
}
