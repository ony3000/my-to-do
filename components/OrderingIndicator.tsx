import { useRouter } from 'next/router';
import classNames from 'classnames/bind';
import { useAppDispatch, useAppSelector } from '@/hooks/index';
import {
  IMPORTANCE,
  DEADLINE,
  MYDAY,
  TITLE,
  CREATION_DATE,
  ASCENDING,
  reverseOrderingCriterion,
  unsetOrderingCriterion,
} from '@/store/todoSlice';
import styles from './OrderingIndicator.module.scss';

const cx = classNames.bind(styles);

export default function OrderingIndicator() {
  const router = useRouter();
  const pageKey = router.pathname.replace(/^\/tasks\/?/, '') || 'inbox';
  const dispatch = useAppDispatch();
  const settingsPerPage = useAppSelector(({ todo: state }) => state.pageSettings[pageKey]);

  const readableCriterion = (criterion) => {
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
        // nothing to do
    }
  };

  return settingsPerPage.ordering ? (
    <div className={cx('container')}>
      <button
        className={cx('button', 'text-gray-500')}
        title="역순 정렬"
        onClick={() => dispatch(reverseOrderingCriterion({
          pageKey,
        }))}
      >
        <span className={cx('icon-wrapper')}>
          {settingsPerPage.ordering.direction === ASCENDING ? (
            <i className="fas fa-chevron-up"></i>
          ) : (
            <i className="fas fa-chevron-down"></i>
          )}
          <span className="sr-only">역순 정렬</span>
        </span>
      </button>
      <div className={cx('description')}>
        <span>{readableCriterion(settingsPerPage.ordering.criterion)} 정렬됨</span>
        <span className="sr-only">, {settingsPerPage.ordering.direction === ASCENDING ? '오름차순' : '내림차순'}으로 정렬됨</span>
      </div>
      <button
        className={cx('button', 'text-gray-500')}
        title="정렬 순서 옵션 제거"
        onClick={() => dispatch(unsetOrderingCriterion({
          pageKey,
        }))}
      >
        <span className={cx('icon-wrapper')}>
          <i className="fas fa-times"></i>
          <span className="sr-only">정렬 순서 옵션 제거</span>
        </span>
      </button>
    </div>
  ) : null;
}
