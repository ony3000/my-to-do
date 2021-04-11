import { useRouter } from 'next/router';
import classNames from 'classnames/bind';
import { useDispatch, useSelector } from 'react-redux';
import { openListOption } from '@/store/todoSlice';
import dayjs from '@/plugins/dayjs';
import styles from './PageToolbar.module.scss';
import ListOption from '@/components/ListOption';

const cx = classNames.bind(styles);

export default function PageToolbar({
  title = '',
  displayToday = false,
}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const isActiveListOption = useSelector(({ todo: state }) => state.isActiveListOption);
  const functionsPerPage = useSelector(({ todo: state }) => state.toolbarFunctions[router.pathname.replace(/^\/tasks\//, '')]);
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
          {/* 테마 색상 */}
          <h1 className={cx('list-title')}>{title}</h1>

          {functionsPerPage.listOption ? (
            <>
              {/* gray-500 색상 고정 */}
              <button
                className={cx('button')}
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
          {/* 테마 색상 */}
          <button
            className={cx(
              'button',
              'transform',
              'rotate-90',
            )}
            title="정렬 기준"
            onClick={() => console.log('정렬 기준')}
          >
            <span className={cx('icon-wrapper')}>
              <i className="fas fa-exchange-alt"></i>
              <span className="sr-only">정렬 기준</span>
            </span>
          </button>
        </div>
      ) : null}
    </div>
  );
}
