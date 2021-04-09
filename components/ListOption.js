import { useRef, useEffect } from 'react';
import classNames from 'classnames/bind';
import { useDispatch, useSelector } from 'react-redux';
import { closeListOption } from '@/store/todoSlice';
import styles from './ListOption.module.scss';

const cx = classNames.bind(styles);

export default function ListOption() {
  const dispatch = useDispatch();
  const isActiveListOption = useSelector(({ todo: state }) => state.isActiveListOption);
  const { top: topPosition, left: leftPosition } = useSelector(({ todo: state }) => state.listOptionPosition);
  const $refs = {
    container: useRef(null),
  };

  useEffect(() => {
    function clickHandler(event) {
      const optionContainer = event.target.closest(`.${cx('container')}`);

      if (isActiveListOption && optionContainer === null) {
        dispatch(closeListOption());
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
            <li className={cx('option-item')}>
              <button className={cx('option-button')}>
                <span className={cx('icon-wrapper')}>
                  <i className="fas fa-palette"></i>
                </span>
                <span className={cx('option-text')}>테마 변경</span>
                <span className={cx('icon-wrapper')}>
                  <i className="fas fa-chevron-right"></i>
                </span>
              </button>
            </li>
            <li className={cx('option-item')}>
              <button className={cx('option-button')}>
                <span className={cx('icon-wrapper')}>
                  <i className="far fa-check-circle"></i>
                </span>
                <span className={cx('option-text')}>완료된 작업 숨기기</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  ) : null;
}
