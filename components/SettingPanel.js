import React from 'react';
import classNames from 'classnames/bind';
import { connect } from 'react-redux';
import { closeSettingPanel, turnOnSmartList, turnOffSmartList } from '../store/todoSlice';
import styles from './SettingPanel.module.scss';

const cx = classNames.bind(styles);

const mapStateToProps = ({ todo: state }) => ({
  isActiveSettingPanel: state.isActiveSettingPanel,
  smartListSettings: state.settings.smartList,
});

class SettingPanel extends React.Component {
  render() {
    const { dispatch, isActiveSettingPanel, smartListSettings } = this.props;
    const smartLists = [
      {
        key: 'important',
        text: '중요',
      },
      {
        key: 'planned',
        text: '계획된 일정',
      },
      {
        key: 'all',
        text: '모두',
      },
      {
        key: 'completed',
        text: '완료됨',
      },
      {
        key: 'autoHideEmptyLists',
        text: '빈 스마트 목록 자동 숨김',
      },
    ];

    return (isActiveSettingPanel ? (
      <div className={cx('container')}>
        <h1 className="inline-flex px-4 py-5 text-xl font-semibold">설정</h1>

        <div className="px-4">
          <div className={cx('setting-section')}>
            <h2 className={cx('title')}>스마트 목록</h2>

            <div className="flex flex-col items-start">
              {smartLists.map((smartListItem) => {
                const isActiveSmartList = smartListSettings[smartListItem.key];

                return (
                  <div
                    key={smartListItem.key}
                    className={cx(
                      'togglable-item',
                      { 'is-active': isActiveSmartList },
                    )}
                  >
                    <label className={cx('top-label')}>{smartListItem.text}</label>
                    <div className="inline-flex">
                      <button
                        className={cx('switch')}
                        title={isActiveSmartList ? '끄기' : '켜기'}
                        onClick={() => this.toggleSmartList(smartListItem.key)}
                      >
                        <span className={cx('switch-thumb')}></span>
                        <span className="sr-only">{isActiveSmartList ? '끄기' : '켜기'}</span>
                      </button>
                      <label className={cx('side-label')}>{isActiveSmartList ? '켬' : '끔'}</label>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={cx('setting-section')}>
            <h2 className={cx('title')}>정보</h2>

            <div className="flex">
              <div>
                <img className="w-20 h-20" src="/images/todo_check.png" alt="" />
              </div>
              <div className="ml-4">
                <p>
                  <span className="text-sm font-bold">My To Do</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <button
          className={cx('button')}
          title="창 닫기"
          onClick={() => dispatch(closeSettingPanel())}
        >
          <span className={cx('icon-wrapper')}>
            <i className="fas fa-times"></i>
            <span className="sr-only">창 닫기</span>
          </span>
        </button>
      </div>
    ) : null);
  }

  toggleSmartList(key) {
    const { dispatch, smartListSettings } = this.props;

    const isActiveSmartList = smartListSettings[key];

    if (isActiveSmartList) {
      dispatch(turnOffSmartList(key));
    }
    else {
      dispatch(turnOnSmartList(key));
    }
  }
}

export default connect(mapStateToProps)(SettingPanel);
