import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import invariant from 'tiny-invariant';
import classNames from 'classnames';
import { LegacyThemeColor } from '@/lib/types/common';
import { isOneOf } from '@/lib/types/guard';
import { useAppDispatch, useAppSelector } from '@/lib/hooks/index';
import { closeListOption, closeThemePalette, setThemeColor } from '@/lib/store/todoSlice';

export default function ThemePalette() {
  const router = useRouter();
  const pageKey = router.pathname.replace(/^\/tasks\/?/, '') || 'inbox';

  invariant(isOneOf(pageKey, ['all', 'completed', 'inbox']));

  const dispatch = useAppDispatch();
  const themePalettePosition = useAppSelector(({ todo: state }) => state.themePalettePosition);
  const settingsPerPage = useAppSelector(({ todo: state }) => state.pageSettings[pageKey]);
  const [isRendered, setIsRendered] = useState(false);
  const $refs = {
    container: useRef<HTMLDivElement>(null),
  };

  const colors: LegacyThemeColor[] = ['blue', 'red', 'violet', 'lime', 'amber'];
  const isActiveThemePalette = themePalettePosition !== null;
  const topPosition = themePalettePosition?.top || 0;
  const leftPosition = themePalettePosition?.left || 0;

  const changeTheme = (color: LegacyThemeColor) => {
    dispatch(setThemeColor({ pageKey, color }));
    dispatch(closeThemePalette());
    dispatch(closeListOption());
  };

  useEffect(() => {
    if (!isRendered) {
      setIsRendered(true);
    }
  }, [isRendered]);

  useEffect(() => {
    const clickHandler: EventListener = (event) => {
      if (isActiveThemePalette && $refs.container.current && event.target instanceof HTMLElement) {
        const hasTarget = $refs.container.current.contains(event.target);

        if (!hasTarget) {
          dispatch(closeThemePalette());
        }
      }
    };

    if (isRendered) {
      document.addEventListener('click', clickHandler);
    }

    return () => {
      if (isRendered) {
        document.removeEventListener('click', clickHandler);
      }
    };
  });

  return (
    <div className="invisible fixed top-0 left-0 z-[1000000] min-h-screen w-full">
      <div className="visible relative">
        <div
          ref={$refs.container}
          className="shadow-elevation absolute flex rounded-sm bg-white p-4"
          style={{
            top: `${topPosition}px`,
            left: `${leftPosition}px`,
          }}
        >
          {colors.map((color) => (
            <button
              key={color}
              type="button"
              className={classNames(
                'focus:shadow-like-outline-3 hover:shadow-like-outline-2 m-[5px] inline-flex h-10 w-10 items-center justify-center rounded-full focus:shadow-black focus:outline-none',
                { 'bg-blue-500 hover:shadow-blue-500': color === 'blue' },
                { 'bg-red-500 hover:shadow-red-500': color === 'red' },
                { 'bg-violet-500 hover:shadow-violet-500': color === 'violet' },
                { 'bg-lime-500 hover:shadow-lime-500': color === 'lime' },
                { 'bg-amber-500 hover:shadow-amber-500': color === 'amber' },
              )}
              onClick={() => changeTheme(color)}
            >
              {color === settingsPerPage.themeColor ? (
                <i className="fas fa-check-circle text-base text-white" />
              ) : null}
              <span className="sr-only">{color}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
