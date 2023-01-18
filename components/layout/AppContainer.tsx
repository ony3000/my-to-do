import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames/bind';
import { isOneOf } from '@/lib/types/guard';
import { SettingsPerPage } from '@/lib/types/store/todoSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks/index';
import { launchApp } from '@/lib/store/todoSlice';
import styles from './AppContainer.module.scss';
import AppSplash from '@/components/placeholder/AppSplash';
import AppHeader from '@/components/toolbar/AppHeader';
import NavigationDrawer from '@/components/panel/NavigationDrawer';
import DetailPanel from '@/components/panel/DetailPanel';
import SettingPanel from '@/components/panel/SettingPanel';

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

type AppContainerProps = {
  children: JSX.Element;
};

export default function AppContainer({ children }: AppContainerProps) {
  const router = useRouter();
  const pageKey = router.pathname.replace(/^\/tasks\/?/, '') || 'inbox';
  const isExpectedPage = isOneOf(pageKey, ['myday', 'important', 'planned', 'all', 'completed', 'inbox', 'search', 'search/[keyword]']);
  const dispatch = useAppDispatch();
  const isAppReady = useAppSelector(({ todo: state }) => state.isAppReady);
  const settingsPerPage = useAppSelector<SettingsPerPage>(({ todo: state }) => isExpectedPage ? state.pageSettings[pageKey] : {});
  const [ isRendered, setIsRendered ] = useState(false);

  useEffect(() => {
    if (!isRendered) {
      if (router.pathname === '/') {
        router.replace('/tasks');
      }

      if (!isAppReady) {
        dispatch(launchApp());
      }

      setIsRendered(true);
    }
  }, [router, dispatch, isAppReady, isRendered]);

  return (
    <div
      className={cx(
        'min-h-screen flex flex-col',
        { [`is-${settingsPerPage?.themeColor}-theme`]: settingsPerPage?.themeColor },
      )}
    >
      {!isAppReady && <AppSplash />}
      {(isAppReady && !isExpectedPage) && <>{children}</>}
      {(isAppReady && isExpectedPage) && (
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
      )}
    </div>
  );
}
