import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { isOneOf } from '@/lib/types/guard';
import { useAppDispatch, useAppSelector } from '@/lib/hooks/index';
import { launchApp } from '@/lib/store/todoSlice';
import { AppSplash } from '@/components/placeholder';
import { AppHeader } from '@/components/toolbar';
import { DetailPanel, NavigationDrawer, SettingPanel } from '@/components/panel';

type AppContainerProps = {
  children: JSX.Element;
};

export default function AppContainer({ children }: AppContainerProps) {
  const router = useRouter();
  const pageKey = router.pathname.replace(/^\/tasks\/?/, '') || 'inbox';
  const isExpectedPage = isOneOf(pageKey, [
    'myday',
    'important',
    'planned',
    'all',
    'completed',
    'inbox',
    'search',
    'search/[keyword]',
  ]);
  const dispatch = useAppDispatch();
  const isAppReady = useAppSelector(({ todo: state }) => state.isAppReady);
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    if (!isRendered) {
      if (!isAppReady) {
        dispatch(launchApp());
      }

      setIsRendered(true);
    }
  }, [dispatch, isAppReady, isRendered]);

  return (
    <div className="flex min-h-screen flex-col">
      {!isAppReady && <AppSplash />}
      {isAppReady && !isExpectedPage && children}
      {isAppReady && isExpectedPage && (
        <>
          <AppHeader />

          <SettingPanel />

          <div className="relative flex flex-1 max-[770px]:pl-[51px]">
            <NavigationDrawer />

            <div className="flex-1 overflow-hidden">{children}</div>

            <DetailPanel />
          </div>
        </>
      )}
    </div>
  );
}
