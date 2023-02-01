import { Fragment, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import invariant from 'tiny-invariant';
import { LegacyListOption as ListOptionType } from '@/lib/types/common';
import { isOneOf } from '@/lib/types/guard';
import { SettingsPerPage } from '@/lib/types/store/todoSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks/index';
import {
  CHANGE_THEME,
  TOGGLE_COMPLETED_ITEMS,
  closeListOption,
  openThemePalette,
  showCompletedItems,
  hideCompletedItems,
} from '@/lib/store/todoSlice';
import { MenuLayer, MenuContainer, MenuItem } from './parts';
import ThemePalette from './ThemePalette';

type ListOptionProps = {
  availableOptions: ListOptionType[];
};

export default function ListOption({ availableOptions = [] }: ListOptionProps) {
  const router = useRouter();
  const pageKey = router.pathname.replace(/^\/tasks\/?/, '') || 'inbox';

  invariant(
    isOneOf(pageKey, [
      'important',
      'planned',
      'all',
      'completed',
      'inbox',
      'search',
      'search/[keyword]',
    ]),
  );

  const dispatch = useAppDispatch();
  const listOptionPosition = useAppSelector(({ todo: state }) => state.listOptionPosition);
  const themePalettePosition = useAppSelector(({ todo: state }) => state.themePalettePosition);
  const settingsPerPage = useAppSelector<SettingsPerPage>(
    ({ todo: state }) => state.pageSettings[pageKey],
  );
  const $refs = {
    container: useRef<HTMLDivElement>(null),
  };

  const isActiveListOption = listOptionPosition !== null;
  const topPosition = listOptionPosition?.top || 0;
  const leftPosition = listOptionPosition?.left || 0;
  const isActiveThemePalette = themePalettePosition !== null;

  const toggleCompletedItems = () => {
    invariant(isOneOf(pageKey, ['important', 'planned', 'search', 'search/[keyword]']));
    dispatch(
      settingsPerPage.isHideCompletedItems
        ? showCompletedItems(pageKey)
        : hideCompletedItems(pageKey),
    );
    dispatch(closeListOption());
  };

  useEffect(() => {
    const clickHandler: EventListener = (event) => {
      if (isActiveListOption && $refs.container.current && event.target instanceof HTMLElement) {
        const hasTarget = $refs.container.current.contains(event.target);

        if (!hasTarget) {
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
    <MenuLayer>
      <MenuContainer
        ref={$refs.container}
        title="목록 옵션"
        style={{
          top: `${topPosition}px`,
          left: `${leftPosition}px`,
        }}
      >
        <ul>
          {availableOptions.map((option) => {
            let innerElement = null;

            // becomes to MenuItem
            switch (option) {
              case CHANGE_THEME:
                innerElement = (
                  <MenuItem
                    type={CHANGE_THEME}
                    onClick={(event) =>
                      !isActiveThemePalette &&
                      dispatch(
                        openThemePalette({
                          event,
                        }),
                      )
                    }
                  />
                );
                break;
              case TOGGLE_COMPLETED_ITEMS:
                innerElement = (
                  <MenuItem
                    type={TOGGLE_COMPLETED_ITEMS}
                    onClick={() => toggleCompletedItems()}
                    title={
                      settingsPerPage.isHideCompletedItems
                        ? '완료된 작업 표시'
                        : '완료된 작업 숨기기'
                    }
                  />
                );
                break;
              default:
                return null;
            }

            return <Fragment key={option}>{innerElement}</Fragment>;
          })}
        </ul>

        {availableOptions.includes(CHANGE_THEME) && <ThemePalette />}
      </MenuContainer>
    </MenuLayer>
  ) : null;
}
