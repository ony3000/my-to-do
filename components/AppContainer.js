import React from 'react';
import { withRouter } from 'next/router';
import classNames from 'classnames/bind';
import { connect } from 'react-redux';
import { launchApp } from '../store/todoSlice';
import styles from './AppContainer.module.scss';
import AppSplash from './AppSplash';
import AppHeader from './layouts/AppHeader';
import AppLeftColumn from './layouts/AppLeftColumn';
import AppRightColumn from './layouts/AppRightColumn';
import SettingPanel from './SettingPanel';

const cx = classNames.bind(styles);

const mapStateToProps = ({ todo: state }) => ({
  isAppReady: state.isAppReady,
});

class AppContainer extends React.Component {
  componentDidMount() {
    const { router, dispatch, isAppReady } = this.props;

    if (router.pathname === '/') {
      router.replace('/tasks');
    }

    if (!isAppReady) {
      dispatch(launchApp());
    }
  }

  render() {
    const { isAppReady, children } = this.props;

    return (
      <div className="min-h-screen flex flex-col">
        {isAppReady ? (
          <>
            <AppHeader />

            <SettingPanel />

            <div className={cx('body')}>
              <AppLeftColumn />

              <div className="flex-1">
                {children}
              </div>

              {/* <AppRightColumn /> */}
            </div>
          </>
        ) : (
          <AppSplash />
        )}
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps)(AppContainer));
