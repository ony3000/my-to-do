import { Fragment, useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import invariant from 'tiny-invariant';
import {
  LegacyOrderingCriterion as OrderingCriterionType,
  LegacyOrderingDirection,
} from '@/lib/types/common';
import { isOneOf } from '@/lib/types/guard';
import { useAppDispatch, useAppSelector } from '@/lib/hooks/index';
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
} from '@/lib/store/todoSlice';
import { MenuLayer, MenuContainer, MenuItem } from './parts';

type OrderingCriterionProps = {
  availableCriterions: OrderingCriterionType[];
};

export default function OrderingCriterion({ availableCriterions = [] }: OrderingCriterionProps) {
  const router = useRouter();
  const pageKey = router.pathname.replace(/^\/tasks\/?/, '') || 'inbox';

  invariant(isOneOf(pageKey, ['myday', 'inbox']));

  const dispatch = useAppDispatch();
  const orderingCriterionPosition = useAppSelector(
    ({ todo: state }) => state.orderingCriterionPosition,
  );
  const settingsPerPage = useAppSelector(({ todo: state }) => state.pageSettings[pageKey]);
  const [isRendered, setIsRendered] = useState(false);
  const $refs = {
    container: useRef<HTMLDivElement>(null),
  };

  const isActiveOrderingCriterion = orderingCriterionPosition !== null;
  const topPosition = orderingCriterionPosition?.top || 0;
  const rightPosition = orderingCriterionPosition?.right;
  const leftPosition = orderingCriterionPosition?.left;

  const setOrderingCriterionToDefault = ({
    criterion,
    direction,
  }: {
    criterion: OrderingCriterionType;
    direction: LegacyOrderingDirection;
  }) => {
    if (
      settingsPerPage.ordering === null ||
      criterion !== settingsPerPage.ordering.criterion ||
      direction !== settingsPerPage.ordering.direction
    ) {
      dispatch(
        setOrderingCriterion({
          pageKey,
          criterion,
          direction,
        }),
      );
    }
    dispatch(closeOrderingCriterion());
  };

  useEffect(() => {
    if (!isRendered) {
      setIsRendered(true);
    }
  }, [isRendered]);

  useEffect(() => {
    const clickHandler: EventListener = (event) => {
      if (
        isActiveOrderingCriterion &&
        $refs.container.current &&
        event.target instanceof HTMLElement
      ) {
        const hasTarget = $refs.container.current.contains(event.target);

        if (!hasTarget) {
          dispatch(closeOrderingCriterion());
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
  }, [dispatch, isRendered, $refs.container, isActiveOrderingCriterion]);

  return (
    <MenuLayer>
      <MenuContainer
        ref={$refs.container}
        title="정렬 기준"
        style={{
          top: `${topPosition}px`,
          right: rightPosition ? `${rightPosition}px` : '',
          left: leftPosition ? `${leftPosition}px` : '',
        }}
      >
        <ul>
          {availableCriterions.map((option) => {
            let innerElement = null;

            switch (option) {
              case IMPORTANCE:
                innerElement = (
                  <MenuItem
                    type={IMPORTANCE}
                    onClick={() =>
                      setOrderingCriterionToDefault({
                        criterion: option,
                        direction: DESCENDING,
                      })
                    }
                  />
                );
                break;
              case DEADLINE:
                innerElement = (
                  <MenuItem
                    type={DEADLINE}
                    onClick={() =>
                      setOrderingCriterionToDefault({
                        criterion: option,
                        direction: ASCENDING,
                      })
                    }
                  />
                );
                break;
              case MYDAY:
                innerElement = (
                  <MenuItem
                    type={MYDAY}
                    onClick={() =>
                      setOrderingCriterionToDefault({
                        criterion: option,
                        direction: DESCENDING,
                      })
                    }
                  />
                );
                break;
              case TITLE:
                innerElement = (
                  <MenuItem
                    type={TITLE}
                    onClick={() =>
                      setOrderingCriterionToDefault({
                        criterion: option,
                        direction: ASCENDING,
                      })
                    }
                  />
                );
                break;
              case CREATION_DATE:
                innerElement = (
                  <MenuItem
                    type={CREATION_DATE}
                    onClick={() =>
                      setOrderingCriterionToDefault({
                        criterion: option,
                        direction: DESCENDING,
                      })
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
      </MenuContainer>
    </MenuLayer>
  );
}
