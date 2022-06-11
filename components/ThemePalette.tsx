import { useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames/bind';
import { useAppDispatch, useAppSelector } from '@/hooks/index';
import { closeListOption, closeThemePalette, setThemeColor } from '@/store/todoSlice';
import styles from './ThemePalette.module.scss';

const cx = classNames.bind(styles);

export default function ThemePalette() {
  const router = useRouter();
  const pageKey = router.pathname.replace(/^\/tasks\/?/, '') || 'inbox';
  const dispatch = useAppDispatch();
  const themePalettePosition = useAppSelector(({ todo: state }) => state.themePalettePosition);
  const settingsPerPage = useAppSelector(({ todo: state }) => state.pageSettings[pageKey]);
  const $refs = {
    container: useRef(null),
  };

  const colors = [
    'blue',
    'red',
    'violet',
    'lime',
    'amber',
  ];
  const isActiveThemePalette = themePalettePosition !== null;
  const topPosition = themePalettePosition?.top || 0;
  const leftPosition = themePalettePosition?.left || 0;

  const changeTheme = (color) => {
    dispatch(setThemeColor({ pageKey, color }));
    dispatch(closeThemePalette());
    dispatch(closeListOption());
  };

  useEffect(() => {
    function clickHandler(event) {
      if (isActiveThemePalette && $refs.container.current) {
        const optionContainer = event.target.closest(`.${$refs.container.current.className}`);

        if (optionContainer === null) {
          dispatch(closeThemePalette());
        }
      }
    }

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
