import { useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import invariant from 'tiny-invariant';
import classNames from 'classnames/bind';
import { LegacyThemeColor } from '@/lib/types/common';
import { isOneOf } from '@/lib/types/guard';
import { useAppDispatch, useAppSelector } from '@/lib/hooks/index';
import { closeListOption, closeThemePalette, setThemeColor } from '@/lib/store/todoSlice';
import styles from './ThemePalette.module.scss';

const cx = classNames.bind(styles);

export default function ThemePalette() {
  const router = useRouter();
  const pageKey = router.pathname.replace(/^\/tasks\/?/, '') || 'inbox';

  invariant(isOneOf(pageKey, ['all', 'completed', 'inbox']));

  const dispatch = useAppDispatch();
  const themePalettePosition = useAppSelector(({ todo: state }) => state.themePalettePosition);
  const settingsPerPage = useAppSelector(({ todo: state }) => state.pageSettings[pageKey]);
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
    const clickHandler: EventListener = (event) => {
      if (isActiveThemePalette && $refs.container.current && event.target instanceof HTMLElement) {
        const hasTarget = $refs.container.current.contains(event.target);

        if (!hasTarget) {
          dispatch(closeThemePalette());
        }
      }
    };

    document.addEventListener('click', clickHandler);

    return () => {
      document.removeEventListener('click', clickHandler);
    };
  });

  return isActiveThemePalette ? (
    <div className={cx('fixed-layer')}>
      <div className={cx('visible-layer')}>
        <div
          ref={$refs.container}
          className={cx('container')}
          style={{
            top: `${topPosition}px`,
            left: `${leftPosition}px`,
          }}
        >
          {colors.map((color) => (
            <button
              key={color}
              type="button"
              className={cx('color', `is-${color}`)}
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
  ) : null;
}
