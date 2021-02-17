import React from 'react';
import classNames from 'classnames/bind';
import { connect } from 'react-redux';
import { openSettingPanel, closeSettingPanel } from '../../store/todoSlice';
import styles from './AppHeader.module.scss';
import SearchBox from '../SearchBox';

const cx = classNames.bind(styles);

const mapStateToProps = ({ todo: state }) => ({
  isActiveSettingPanel: state.isActiveSettingPanel,
});

class AppHeader extends React.Component {
  render() {
    const { isActiveSettingPanel } = this.props;

    return (
      <div className="bg-blue-500 h-12 flex items-center justify-between">
        <a className={cx('home-link')} href="/">
          To Do
        </a>
        <SearchBox />
        <button
          className={cx(
            'button',
            { 'is-active': isActiveSettingPanel },
          )}
          title="설정"
          onClick={() => this.toggleSettingPanel()}
        >
          <i className="fas fa-cog"></i>
          <span className="sr-only">설정</span>
        </button>
      </div>
    );
  }

  toggleSettingPanel() {
    const { dispatch, isActiveSettingPanel } = this.props;

    if (isActiveSettingPanel) {
      dispatch(closeSettingPanel());
    }
    else {
      dispatch(openSettingPanel());
    }
  }
}

export default connect(mapStateToProps)(AppHeader);
