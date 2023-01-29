import { useRouter } from 'next/router';
import invariant from 'tiny-invariant';
import { IconContainer } from '@/components/layout';
import { OrderingCriterion } from '@/lib/types/common';
import { isOneOf } from '@/lib/types/guard';
import { useAppDispatch, useAppSelector } from '@/lib/hooks/index';
import {
  IMPORTANCE,
  DEADLINE,
  MYDAY,
  TITLE,
  CREATION_DATE,
  ASCENDING,
  reverseOrderingCriterion,
  unsetOrderingCriterion,
} from '@/lib/store/todoSlice';

export default function OrderingIndicator() {
  const router = useRouter();
  const pageKey = router.pathname.replace(/^\/tasks\/?/, '') || 'inbox';

  invariant(isOneOf(pageKey, ['myday', 'inbox']));

  const dispatch = useAppDispatch();
  const settingsPerPage = useAppSelector(({ todo: state }) => state.pageSettings[pageKey]);

  const readableCriterion = (criterion: OrderingCriterion) => {
    switch (criterion) {
      case IMPORTANCE:
        return '중요도별로';
      case DEADLINE:
        return '기한별로';
      case MYDAY:
        return '나의 하루 추가 여부로';
      case TITLE:
        return '제목순으로';
      case CREATION_DATE:
        return '만든 날짜순으로';
      default:
        return '정해진 기준으로';
    }
  };

  const buttonClassNames =
    'focus:shadow-like-outline-3 inline-flex h-6 w-6 items-center rounded-sm text-[14px] text-gray-500 hover:bg-gray-200 focus:shadow-blue-500 focus:outline-none';

  return settingsPerPage.ordering ? (
    <div className="flex items-center justify-end px-4 py-2.5">
      <button
        type="button"
        className={buttonClassNames}
        title="역순 정렬"
        onClick={() =>
          dispatch(
            reverseOrderingCriterion({
              pageKey,
            }),
          )
        }
      >
        <IconContainer
          iconClassName={
            settingsPerPage.ordering.direction === ASCENDING
              ? 'fas fa-chevron-up'
              : 'fas fa-chevron-down'
          }
          iconLabel="역순 정렬"
        />
      </button>
      <div className="mx-[5px] text-[12px] font-bold">
        <span>{readableCriterion(settingsPerPage.ordering.criterion)} 정렬됨</span>
        <span className="sr-only">
          , {settingsPerPage.ordering.direction === ASCENDING ? '오름차순' : '내림차순'}으로 정렬됨
        </span>
      </div>
      <button
        type="button"
        className={buttonClassNames}
        title="정렬 순서 옵션 제거"
        onClick={() =>
          dispatch(
            unsetOrderingCriterion({
              pageKey,
            }),
          )
        }
      >
        <IconContainer iconClassName="fas fa-times" iconLabel="정렬 순서 옵션 제거" />
      </button>
    </div>
  ) : null;
}
