import { useRouter } from 'next/router';
import classNames from 'classnames/bind';
import { useDispatch, useSelector } from 'react-redux';
import { openListOption, openOrderingCriterion } from '@/store/todoSlice';
import dayjs from '@/plugins/dayjs';
import styles from './PageToolbar.module.scss';
import ListOption from '@/components/ListOption';
import OrderingCriterion from '@/components/OrderingCriterion';

const cx = classNames.bind(styles);

export default function PageToolbar({
  title = '',
  displayToday = false,
}) {
  const router = useRouter();
  const pageKey = router.pathname.replace(/^\/tasks\/?/, '') || 'inbox';
  const dispatch = useDispatch();
  const isActiveListOption = useSelector(({ todo: state }) => state.isActiveListOption);
  const isActiveOrderingCriterion = useSelector(({ todo: state }) => state.isActiveOrderingCriterion);
  const functionsPerPage = useSelector(({ todo: state }) => state.toolbarFunctions[pageKey]);
  const settingsPerPage = useSelector(({ todo: state }) => state.pageSettings[pageKey]);
  const midnightToday = dayjs().startOf('day');

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
                'transform',
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
