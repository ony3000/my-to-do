import { useRef, useEffect } from 'react';
import classNames from 'classnames/bind';
import { useDispatch, useSelector } from 'react-redux';
import { CHANGE_THEME, HIDE_COMPLETED_ITEMS, closeListOption } from '@/store/todoSlice';
import styles from './ListOption.module.scss';

const cx = classNames.bind(styles);

export default function ListOption({
  availableOptions = [],
}) {
  const dispatch = useDispatch();
  const isActiveListOption = useSelector(({ todo: state }) => state.isActiveListOption);
  const { top: topPosition, left: leftPosition } = useSelector(({ todo: state }) => state.listOptionPosition);
  const $refs = {
    container: useRef(null),
  };

  useEffect(() => {
    function clickHandler(event) {
      if (isActiveListOption) {
        const optionContainer = event.target.closest(`.${$refs.container.current.className}`);

        if (optionContainer === null) {
          dispatch(closeListOption());
        }
      }
    }

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
                    <button className={cx('option-button')}>
                      <span className={cx('icon-wrapper')}>
                        <i className="fas fa-palette"></i>
                      </span>
                      <span className={cx('option-text')}>테마 변경</span>
                      <span className={cx('icon-wrapper')}>
                        <i className="fas fa-chevron-right"></i>
                      </span>
                    </button>
                  );
                  break;
                case HIDE_COMPLETED_ITEMS:
                  elements = (
                    <button className={cx('option-button')}>
                      <span className={cx('icon-wrapper')}>
                        <i className="far fa-check-circle"></i>
                      </span>
                      <span className={cx('option-text')}>완료된 작업 숨기기</span>
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
