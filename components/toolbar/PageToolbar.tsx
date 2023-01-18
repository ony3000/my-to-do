import { useRouter } from 'next/router';
import invariant from 'tiny-invariant';
import classNames from 'classnames/bind';
import { isOneOf } from '@/lib/types/guard';
import { SettingsPerPage } from '@/lib/types/store/todoSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks/index';
import { openListOption, openOrderingCriterion } from '@/lib/store/todoSlice';
import dayjs from '@/lib/plugins/dayjs';
import styles from './PageToolbar.module.scss';
import ListOption from '@/components/menu/ListOption';
import OrderingCriterion from '@/components/menu/OrderingCriterion';

const cx = classNames.bind(styles);

export default function PageToolbar({
  title = '',
  displayToday = false,
}) {
  const router = useRouter();
  const pageKey = router.pathname.replace(/^\/tasks\/?/, '') || 'inbox';

  invariant(isOneOf(pageKey, ['myday', 'important', 'planned', 'all', 'completed', 'inbox', 'search', 'search/[keyword]']));

  const dispatch = useAppDispatch();
  const listOptionPosition = useAppSelector(({ todo: state }) => state.listOptionPosition);
  const orderingCriterionPosition = useAppSelector(({ todo: state }) => state.orderingCriterionPosition);
  const functionsPerPage = useAppSelector(({ todo: state }) => state.toolbarFunctions[pageKey]);
  const settingsPerPage = useAppSelector<SettingsPerPage>(({ todo: state }) => state.pageSettings[pageKey]);
  const midnightToday = dayjs().startOf('day');

  const isActiveListOption = listOptionPosition !== null;
  const isActiveOrderingCriterion = orderingCriterionPosition !== null;

  return (
    <div
      className={cx(
        'container',
        { 'is-displaying-today': displayToday },
      )}
    >
      <div className={cx('flexible-section')}>
        <div className={cx('headline')}>
          <h1
            className={cx(
              'list-title',
              `text-${settingsPerPage.themeColor ? settingsPerPage.themeColor : 'blue'}-500`,
            )}
          >
            {title}
          </h1>

          {functionsPerPage.listOption ? (
            <>
              <button
                className={cx('button', 'text-gray-500')}
                title="목록 옵션"
                onClick={(event) => !isActiveListOption && dispatch(openListOption({
                  event,
                  selector: `.${cx('button')}`,
                }))}
              >
                <span className={cx('icon-wrapper')}>
                  <i className="fas fa-ellipsis-h"></i>
                  <span className="sr-only">목록 옵션</span>
                </span>
              </button>

              <ListOption
                availableOptions={functionsPerPage.listOption}
              />
            </>
          ) : null}
        </div>

        {displayToday ? (
          <div className={cx('today')}>
            {midnightToday.format('M월 D일, dddd')}
          </div>
        ) : null}
      </div>

      {functionsPerPage.listOrdering ? (
        <div>
          <button
            className={cx(
              'button',
              `text-${settingsPerPage.themeColor ? settingsPerPage.themeColor : 'blue'}-500`,
            )}
            title="정렬 기준"
            onClick={(event) => !isActiveOrderingCriterion && dispatch(openOrderingCriterion({
              event,
              selector: `.${cx('button')}`,
            }))}
            style={{
              minWidth: '2rem',
              width: 'auto',
            }}
          >
            <span
              className={cx(
                'icon-wrapper',
                'rotate-90',
              )}
            >
              <i className="fas fa-exchange-alt"></i>
            </span>
            <span className={cx('button-text')}>
              <span>정렬</span>
              <span className="sr-only">&nbsp;기준</span>
            </span>
          </button>

          <OrderingCriterion
            availableCriterions={functionsPerPage.listOrdering}
          />
        </div>
      ) : null}
    </div>
  );
}
