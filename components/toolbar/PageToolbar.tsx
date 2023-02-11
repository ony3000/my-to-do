import { useRouter } from 'next/router';
import invariant from 'tiny-invariant';
import classNames from 'classnames';
import { IconContainer } from '@/components/layout';
import { ListOption, OrderingCriterion } from '@/components/menu';
import { isOneOf } from '@/lib/types/guard';
import { SettingsPerPage } from '@/lib/types/store/todoSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks/index';
import { openListOption, openOrderingCriterion } from '@/lib/store/todoSlice';
import dayjs from '@/lib/plugins/dayjs';
import { textColor } from '@/lib/utils/styles';

type PageToolbarProps = {
  title?: string;
  displayToday?: boolean;
};

export default function PageToolbar({ title = '', displayToday = false }: PageToolbarProps) {
  const router = useRouter();
  const pageKey = router.pathname.replace(/^\/tasks\/?/, '') || 'inbox';

  invariant(
    isOneOf(pageKey, [
      'myday',
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
  const orderingCriterionPosition = useAppSelector(
    ({ todo: state }) => state.orderingCriterionPosition,
  );
  const functionsPerPage = useAppSelector(({ todo: state }) => state.toolbarFunctions[pageKey]);
  const settingsPerPage = useAppSelector<SettingsPerPage>(
    ({ todo: state }) => state.pageSettings[pageKey],
  );
  const midnightToday = dayjs().startOf('day');

  const isActiveListOption = listOptionPosition !== null;
  const isActiveOrderingCriterion = orderingCriterionPosition !== null;

  const buttonClassNames = classNames(
    'focus:shadow-like-outline-3 inline-flex h-8 items-center rounded-sm p-1 hover:bg-gray-200 focus:shadow-blue-500 focus:outline-none',
    { 'my-2': displayToday },
  );

  return (
    <div
      className={classNames(
        'flex px-4 pt-3',
        { 'h-[60px] items-center': !displayToday },
        { 'h-auto min-h-[60px] items-start': displayToday },
      )}
    >
      <div className={classNames('flex-1', { 'my-[3px]': displayToday })}>
        <div className="flex items-center">
          <h1
            className={classNames(
              'truncate px-2 py-1.5 text-[20px] font-semibold',
              textColor(settingsPerPage.themeColor),
            )}
          >
            {title}
          </h1>

          {functionsPerPage.listOption ? (
            <>
              <button
                type="button"
                className={classNames(buttonClassNames, 'w-8 text-gray-500')}
                title="목록 옵션"
                onClick={(event) =>
                  !isActiveListOption &&
                  dispatch(
                    openListOption({
                      event,
                    }),
                  )
                }
              >
                <IconContainer iconClassName="fas fa-ellipsis-h" iconLabel="목록 옵션" />
              </button>

              {isActiveListOption && <ListOption availableOptions={functionsPerPage.listOption} />}
            </>
          ) : null}
        </div>

        {displayToday ? (
          <div className="px-2 pb-1 text-[12px] font-extralight">
            {midnightToday.format('M월 D일, dddd')}
          </div>
        ) : null}
      </div>

      {functionsPerPage.listOrdering ? (
        <div>
          <button
            type="button"
            className={classNames(
              buttonClassNames,
              'min-w-[32px]',
              textColor(settingsPerPage.themeColor),
            )}
            title="정렬 기준"
            onClick={(event) =>
              !isActiveOrderingCriterion &&
              dispatch(
                openOrderingCriterion({
                  event,
                }),
              )
            }
          >
            <span className="inline-flex h-6 w-6 rotate-90 items-center justify-center">
              <i className="fas fa-exchange-alt" />
            </span>
            <span className="text-[14px] max-[899px]:hidden">
              <span>정렬</span>
              <span className="sr-only">&nbsp;기준</span>
            </span>
          </button>

          {isActiveOrderingCriterion && (
            <OrderingCriterion availableCriterions={functionsPerPage.listOrdering} />
          )}
        </div>
      ) : null}
    </div>
  );
}
