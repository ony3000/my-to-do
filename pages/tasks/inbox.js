import Head from 'next/head';
import classNames from 'classnames/bind';
import styles from './inbox.module.scss';

const cx = classNames.bind(styles);

export default function Inbox() {
  return (
    <main className={cx('main')}>
      <Head>
        <title>Tasks - To Do</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={cx('toolbar')}>
        <div className={cx('toolbar-headline')}>
          <div className={cx('toolbar-title-container')}>
            {/* 테마 색상 */}
            <h1 className={cx('list-title')}>Tasks</h1>

            {/* gray-500 색상 고정 */}
            <button
              className={cx('toolbar-button')}
              title="목록 옵션"
              onClick={() => console.log('목록 옵션')}
            >
              <span className={cx('icon-wrapper')}>
                <i className="fas fa-ellipsis-h"></i>
                <span className="sr-only">목록 옵션</span>
              </span>
            </button>
          </div>
        </div>

        <div>
          {/* 테마 색상 */}
          <button
            className={cx(
              'toolbar-button',
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
      </div>

      <div className={cx('body')}>
        <div className={cx('input-section')}>
          <div className={cx('input-container')}>
            {/* 테마 색상 */}
            <button
              className={cx('list-button', 'is-left')}
              title="작업 추가"
              onClick={() => console.log('작업 추가')}
            >
              <span className={cx('icon-wrapper')}>
                <i className="fas fa-plus"></i>
                <span className="sr-only">작업 추가</span>
              </span>
            </button>

            {/* 엔터 입력 또는 input blur 시, trim 결과가 비어있지 않으면 작업 추가 */}
            <input
              className={cx('input')}
              type="text"
              placeholder="작업 추가"
            />

            {/* 테마 색상, 작업 입력창의 값이 비어있지 않을 때만 노출됨 */}
            <button
              className={cx('list-button', 'is-right')}
              title="추가"
              onClick={() => console.log('추가')}
              style={{
                display: 'none',
                fontSize: '12px',
              }}
            >
              <span className={cx('icon-wrapper')}>
                <span>추가</span>
              </span>
            </button>
          </div>
        </div>

        <div className={cx('list-section')}>
          <div className={cx('list-container')}>
            {Array(20).fill(null).map((_, index) => (
              <div
                key={index}
                className={cx('todo-item')}
              >
                <div className={cx('todo-item-body')}>
                  {/* 테마 색상 */}
                  <button
                    className={cx('list-button', 'is-left')}
                    title={/* 완료되지 않았으면 */ true ? '완료됨으로 표시' : '완료되지 않음으로 표시'}
                    onClick={() => console.log('toggle completion')}
                  >
                    <span className={cx('icon-wrapper')}>
                      {/* 완료되지 않았으면 */ true ? (
                        <i className="far fa-circle"></i>
                      ) : (
                        <i className="fas fa-check-circle"></i>
                      )}
                      <span className="sr-only">{/* 완료되지 않았으면 */ true ? '완료됨으로 표시' : '완료되지 않음으로 표시'}</span>
                    </span>
                  </button>

                  <button className={cx('item-summary')}>
                    <div className={cx('item-title')}>Task #{1 + index}</div>
                    <div className={cx('item-metadata')}>
                      {/* 화면 너비가 좁으면 두 줄로 떨어져야 함 */}
                      <span>
                        <span className={cx('meta-icon-wrapper')}>
                          <i className="far fa-sun" />
                        </span>
                        <span>오늘 할 일</span>
                      </span>
                      <span className={cx('meta-delimiter')}>&bull;</span>
                      <span>1/3</span>
                      <span className={cx('meta-delimiter')}>&bull;</span>
                      <span>
                        {/* 기한이 지났으면 빨간색, 오늘까지면 파란색, 오늘 이후면 회색 */}
                        <span className={cx('meta-icon-wrapper')}>
                          <i className="far fa-calendar" />
                        </span>
                        <span>오늘까지</span>
                        {/* 지났음: */ /* <span>지연, 2월 25일, 목</span> */}
                        {/* 오늘까지: */ /* <span>오늘까지</span> */}
                        {/* 내일까지: */ /* <span>내일까지</span> */}
                        {/* D+2 이상: */ /* <span>3월 3일, 수까지</span> */}
                      </span>
                      <span className={cx('meta-delimiter')}>&bull;</span>
                      <span className={cx('meta-icon-wrapper')}>
                        <i className="far fa-sticky-note" />
                      </span>
                    </div>
                  </button>

                  {/* 테마 색상 */}
                  <button
                    className={cx('list-button', 'is-right')}
                    title={/* 중요도가 없으면 */ true ? '작업을 중요로 표시합니다.' : '중요도를 제거합니다.'}
                    onClick={() => console.log('toggle importance')}
                  >
                    <span className={cx('icon-wrapper')}>
                      <i className="far fa-star"></i>
                      <span className="sr-only">{/* 중요도가 없으면 */ true ? '작업을 중요로 표시합니다.' : '중요도를 제거합니다.'}</span>
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className={cx('list-background')} />
        </div>
      </div>
    </main>
  );
}
