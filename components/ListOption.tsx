import { useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import invariant from 'tiny-invariant';
import classNames from 'classnames/bind';
import { ListOption as ListOptionType } from '@/types/common';
import { isOneOf } from '@/types/guard';
import { SettingsPerPage } from '@/types/store/todoSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/index';
import {
  CHANGE_THEME,
  TOGGLE_COMPLETED_ITEMS,
  closeListOption,
  openThemePalette,
  showCompletedItems,
  hideCompletedItems,
} from '@/store/todoSlice';
import styles from './ListOption.module.scss';
import ThemePalette from '@/components/ThemePalette';

const cx = classNames.bind(styles);

type ListOptionProps = {
  availableOptions: ListOptionType[];
};

export default function ListOption({
  availableOptions = [],
}: ListOptionProps) {
  const router = useRouter();
  const pageKey = router.pathname.replace(/^\/tasks\/?/, '') || 'inbox';

  invariant(isOneOf(pageKey, ['important', 'planned', 'all', 'completed', 'inbox', 'search', 'search/[keyword]']));

  const dispatch = useAppDispatch();
  const listOptionPosition = useAppSelector(({ todo: state }) => state.listOptionPosition);
  const themePalettePosition = useAppSelector(({ todo: state }) => state.themePalettePosition);
  const settingsPerPage = useAppSelector<SettingsPerPage>(({ todo: state }) => state.pageSettings[pageKey]);
  const $refs = {
    container: useRef<HTMLDivElement>(null),
  };

  const isActiveListOption = listOptionPosition !== null;
  const topPosition = listOptionPosition?.top || 0;
  const leftPosition = listOptionPosition?.left || 0;
  const isActiveThemePalette = themePalettePosition !== null;

  const toggleCompletedItems = () => {
    invariant(isOneOf(pageKey, ['important', 'planned', 'search', 'search/[keyword]']));
    dispatch(settingsPerPage.isHideCompletedItems ? showCompletedItems(pageKey) : hideCompletedItems(pageKey));
    dispatch(closeListOption());
  };

  useEffect(() => {
    const clickHandler: EventListener = (event) => {
      if (isActiveListOption && $refs.container.current && event.target instanceof HTMLElement) {
        const optionContainer = event.target.closest(`.${$refs.container.current.className}`);

        if (optionContainer === null) {
          dispatch(closeListOption());
        }
      }
    };

    document.addEventListener('click', clickHandler);

    return () => {
      document.removeEventListener('click', clickHandler);
    };
  });

  return isActiveListOption ? (
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
          <div className={cx('title')}>목록 옵션</div>
          <ul>
            {availableOptions.map((option) => {
              let elements = null;

              switch (option) {
                case CHANGE_THEME:
                  elements = (
                    <>
                      <button
                        className={cx('option-button')}
                        onClick={(event) => !isActiveThemePalette && dispatch(openThemePalette({
                          event,
                          selector: `.${cx('option-button')}`,
                        }))}
                      >
                        <span className={cx('icon-wrapper')}>
                          <i className="fas fa-palette"></i>
                        </span>
                        <span className={cx('option-text')}>테마 변경</span>
                        <span className={cx('icon-wrapper')}>
                          <i className="fas fa-chevron-right"></i>
                        </span>
                      </button>

                      <ThemePalette />
                    </>
                  );
                  break;
                case TOGGLE_COMPLETED_ITEMS:
                  elements = (
                    <button
                      className={cx('option-button')}
                      onClick={() => toggleCompletedItems()}
                    >
                      <span className={cx('icon-wrapper')}>
                        <i className="far fa-check-circle"></i>
                      </span>
                      <span className={cx('option-text')}>
                        {settingsPerPage.isHideCompletedItems ? '완료된 작업 표시' : '완료된 작업 숨기기'}
                      </span>
                    </button>
                  );
                  break;
                default:
                  // nothing to do
              }

              return (
                <li key={option} className={cx('option-item')}>
                  {elements}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  ) : null;
}
