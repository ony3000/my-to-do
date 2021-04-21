import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames/bind';
import { useDispatch, useSelector } from 'react-redux';
import { launchApp } from '@/store/todoSlice';
import styles from './AppContainer.module.scss';
import AppSplash from '@/components/AppSplash';
import AppHeader from '@/components/AppHeader';
import NavigationDrawer from '@/components/NavigationDrawer';
import DetailPanel from '@/components/DetailPanel';
import SettingPanel from '@/components/SettingPanel';

const cx = classNames.bind(styles);

export default function AppContainer({ children }) {
  const router = useRouter();
  const pageKey = router.pathname.replace(/^\/tasks\/?/, '') || 'inbox';
  const dispatch = useDispatch();
  const isAppReady = useSelector(({ todo: state }) => state.isAppReady);
  const settingsPerPage = useSelector(({ todo: state }) => state.pageSettings[pageKey]);
  const [ isMounted, setIsMounted ] = useState(false);

  useEffect(() => {
    if (!isMounted) {
      if (router.pathname === '/') {
        router.replace('/tasks');
      }

      if (!isAppReady) {
        dispatch(launchApp());
      }

      setIsMounted(true);
    }
  });

  return (
    <div
      className={cx(
        'min-h-screen flex flex-col',
        { [`is-${settingsPerPage?.themeColor}-theme`]: settingsPerPage?.themeColor },
      )}
    >
      {isAppReady ? (
        <>
          <AppHeader />

          <SettingPanel />

          <div className={cx('body')}>
            <NavigationDrawer />

            <div className="flex-1">
              {children}
            </div>

            <DetailPanel />
          </div>
        </>
      ) : (
        <AppSplash />
      )}
    </div>
  );
}
