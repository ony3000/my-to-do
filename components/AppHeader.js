import classNames from 'classnames/bind';
import { useDispatch, useSelector } from 'react-redux';
import { openSettingPanel, closeSettingPanel } from '@/store/todoSlice';
import styles from './AppHeader.module.scss';
import SearchBox from '@/components/SearchBox';

const cx = classNames.bind(styles);

export default function AppHeader() {
  const dispatch = useDispatch();
  const isActiveSettingPanel = useSelector(({ todo: state }) => state.isActiveSettingPanel);

  return (
    <div className="bg-blue-500 h-12 flex items-center justify-between">
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
        onClick={() => isActiveSettingPanel ? dispatch(closeSettingPanel()) : dispatch(openSettingPanel())}
      >
        <i className="fas fa-cog"></i>
        <span className="sr-only">설정</span>
      </button>
    </div>
  );
}
