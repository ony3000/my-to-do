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

/**
 * These classNames will not be purged
 *
 * placeholder-blue-500
 * placeholder-red-500
 * placeholder-violet-500
 * placeholder-lime-500
 * placeholder-amber-500
 *
 * text-blue-500
 * text-red-500
 * text-violet-500
 * text-lime-500
 * text-amber-500
 *
 * text-blue-700
 * text-red-700
 * text-violet-700
 * text-lime-700
 * text-amber-700
 */

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

            <div className="flex-1 overflow-hidden">
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
