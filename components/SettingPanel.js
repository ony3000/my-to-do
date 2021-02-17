import React from 'react';
import classNames from 'classnames/bind';
import { connect } from 'react-redux';
import { closeSettingPanel } from '../store/todoSlice';
import styles from './SettingPanel.module.scss';

const cx = classNames.bind(styles);

const mapStateToProps = ({ todo: state }) => ({
  isActiveSettingPanel: state.isActiveSettingPanel,
});

class SettingPanel extends React.Component {
  render() {
    const { dispatch, isActiveSettingPanel } = this.props;

    const activeState = true;
    const inactiveState = false;

    return (isActiveSettingPanel ? (
      <div className={cx('container')}>
        <h1 className="inline-flex px-4 py-5 text-xl font-semibold">설정</h1>

        <div className="px-4">
          <div className={cx('setting-section')}>
            <h2 className={cx('title')}>스마트 목록</h2>

            <div className="flex flex-col items-start">
              <div
                className={cx(
                  'togglable-item',
                  { 'is-active': activeState },
                )}
              >
                <label className={cx('top-label')}>중요</label>
                <div className="inline-flex">
                  <button
                    className={cx('switch')}
                    title={activeState ? '끄기' : '켜기'}
                    onClick={() => console.log('toggle switch')}
                  >
                    <span className={cx('switch-thumb')}></span>
                    <span className="sr-only">{activeState ? '끄기' : '켜기'}</span>
                  </button>
                  <label className={cx('side-label')}>{activeState ? '켜짐' : '꺼짐'}</label>
                </div>
              </div>
              <div
                className={cx(
                  'togglable-item',
                  { 'is-active': inactiveState },
                )}
              >
                <label className={cx('top-label')}>계획된 일정</label>
                <div className="inline-flex">
                  <button
                    className={cx('switch')}
                    title={inactiveState ? '끄기' : '켜기'}
                    onClick={() => console.log('toggle switch')}
                  >
                    <span className={cx('switch-thumb')}></span>
                    <span className="sr-only">{inactiveState ? '끄기' : '켜기'}</span>
                  </button>
                  <label className={cx('side-label')}>{inactiveState ? '켜짐' : '꺼짐'}</label>
                </div>
              </div>
            </div>
          </div>

          <div className={cx('setting-section')}>
            <h2 className={cx('title')}>정보</h2>

            <div className="flex">
              <div>
                <img className="w-20 h-20" src="https://via.placeholder.com/80" alt="" />
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
}

export default connect(mapStateToProps)(SettingPanel);
