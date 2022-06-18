import { useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import invariant from 'tiny-invariant';
import classNames from 'classnames/bind';
import { OrderingCriterion as OrderingCriterionType, OrderingDirection } from '@/types/common';
import { isOneOf } from '@/types/guard';
import { useAppDispatch, useAppSelector } from '@/hooks/index';
import {
  IMPORTANCE,
  DEADLINE,
  MYDAY,
  TITLE,
  CREATION_DATE,
  ASCENDING,
  DESCENDING,
  closeOrderingCriterion,
  setOrderingCriterion,
} from '@/store/todoSlice';
import styles from './ListOption.module.scss'; // shared

const cx = classNames.bind(styles);

type OrderingCriterionProps = {
  availableCriterions: OrderingCriterionType[];
};

export default function OrderingCriterion({
  availableCriterions = [],
}: OrderingCriterionProps) {
  const router = useRouter();
  const pageKey = router.pathname.replace(/^\/tasks\/?/, '') || 'inbox';

  invariant(isOneOf(pageKey, ['myday', 'inbox']));

  const dispatch = useAppDispatch();
  const orderingCriterionPosition = useAppSelector(({ todo: state }) => state.orderingCriterionPosition);
  const settingsPerPage = useAppSelector(({ todo: state }) => state.pageSettings[pageKey]);
  const $refs = {
    container: useRef<HTMLDivElement>(null),
  };

  const isActiveOrderingCriterion = orderingCriterionPosition !== null;
  const topPosition = orderingCriterionPosition?.top || 0;
  const rightPosition = orderingCriterionPosition?.right;
  const leftPosition = orderingCriterionPosition?.left;

  const setOrderingCriterionToDefault = ({ criterion, direction }: {
    criterion: OrderingCriterionType;
    direction: OrderingDirection;
  }) => {
    if (settingsPerPage.ordering === null || criterion !== settingsPerPage.ordering.criterion || direction !== settingsPerPage.ordering.direction) {
      dispatch(setOrderingCriterion({
        pageKey,
        criterion,
        direction,
      }));
    }
    dispatch(closeOrderingCriterion());
  };

  useEffect(() => {
    const clickHandler: EventListener = (event) => {
      if (isActiveOrderingCriterion && $refs.container.current && event.target instanceof HTMLElement) {
        const criterionContainer = event.target.closest(`.${$refs.container.current.className}`);

        if (criterionContainer === null) {
          dispatch(closeOrderingCriterion());
        }
      }
    };

    document.addEventListener('click', clickHandler);

    return () => {
      document.removeEventListener('click', clickHandler);
    };
  });

  return isActiveOrderingCriterion ? (
    <div className={cx('fixed-layer')}>
      <div className={cx('visible-layer')}>
        <div
          ref={$refs.container}
          className={cx('container')}
          style={{
            top: `${topPosition}px`,
            right: (rightPosition !== undefined) && `${rightPosition}px`,
            left: (leftPosition !== undefined) && `${leftPosition}px`,
          }}
        >
          <div className={cx('title')}>정렬 기준</div>
          <ul>
            {availableCriterions.map((option) => {
              let elements = null;

              switch (option) {
                case IMPORTANCE:
                  elements = (
                    <button
                      className={cx('option-button')}
                      onClick={() => setOrderingCriterionToDefault({
                        criterion: option,
                        direction: DESCENDING,
                      })}
                    >
                      <span className={cx('icon-wrapper')}>
                        <i className="far fa-star"></i>
                      </span>
                      <span className={cx('option-text')}>
                        중요도
                      </span>
                    </button>
                  );
                  break;
                case DEADLINE:
                  elements = (
                    <button
                      className={cx('option-button')}
                      onClick={() => setOrderingCriterionToDefault({
                        criterion: option,
                        direction: ASCENDING,
                      })}
                    >
                      <span className={cx('icon-wrapper')}>
                        <i className="far fa-calendar-alt"></i>
                      </span>
                      <span className={cx('option-text')}>
                        기한
                      </span>
                    </button>
                  );
                  break;
                case MYDAY:
                  elements = (
                    <button
                      className={cx('option-button')}
                      onClick={() => setOrderingCriterionToDefault({
                        criterion: option,
                        direction: DESCENDING,
                      })}
                    >
                      <span className={cx('icon-wrapper')}>
                        <i className="far fa-sun"></i>
                      </span>
                      <span className={cx('option-text')}>
                        나의 하루에 추가됨
                      </span>
                    </button>
                  );
                  break;
                case TITLE:
                  elements = (
                    <button
                      className={cx('option-button')}
                      onClick={() => setOrderingCriterionToDefault({
                        criterion: option,
                        direction: ASCENDING,
                      })}
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
                      <span className={cx('option-text')}>
                        제목
                      </span>
                    </button>
                  );
                  break;
                case CREATION_DATE:
                  elements = (
                    <button
                      className={cx('option-button')}
                      onClick={() => setOrderingCriterionToDefault({
                        criterion: option,
                        direction: DESCENDING,
                      })}
                    >
                      <span className={cx('icon-wrapper')}>
                        <i className="far fa-calendar-plus"></i>
                      </span>
                      <span className={cx('option-text')}>
                        만든 날짜
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
