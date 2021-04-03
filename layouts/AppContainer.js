import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames/bind';
import { useDispatch, useSelector } from 'react-redux';
import { launchApp } from '@/store/todoSlice';
import styles from './AppContainer.module.scss';
import AppSplash from '@/components/AppSplash';
import AppHeader from '@/components/AppHeader';
import NavigationDrawer from '@/components/NavigationDrawer';
import AppRightColumn from '@/components/AppRightColumn';
import SettingPanel from '@/components/SettingPanel';

const cx = classNames.bind(styles);

export default function AppContainer({ children }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const isAppReady = useSelector(({ todo: state }) => state.isAppReady);
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
    <div className="min-h-screen flex flex-col">
      {isAppReady ? (
        <>
          <AppHeader />

          <SettingPanel />

          <div className={cx('body')}>
            <NavigationDrawer />

            <div className="flex-1">
              {children}
            </div>

            {/* <AppRightColumn /> */}
          </div>
        </>
      ) : (
        <AppSplash />
      )}
    </div>
  );
}
