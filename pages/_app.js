import { useRouter } from 'next/router';
import '@fortawesome/fontawesome-free/css/all.css';
import 'tailwindcss/tailwind.css';
import classNames from 'classnames/bind';
import { Provider } from 'react-redux';
import store from '../store';
import styles from './_app.module.scss';
import AppHeader from '../components/layouts/AppHeader';
import AppLeftColumn from '../components/layouts/AppLeftColumn';
import AppRightColumn from '../components/layouts/AppRightColumn';

const cx = classNames.bind(styles);

function MyToDoApp({ Component, pageProps }) {
  const router = useRouter();

  if (router.pathname === '/') {
    return (
      <Provider store={store}>
        <div className="min-h-screen flex flex-col">
          <Component {...pageProps} />
        </div>
      </Provider>
    );
  }
  else {
    return (
      <Provider store={store}>
        <div className="min-h-screen flex flex-col">
          <AppHeader />

          <div className={cx('body')}>
            <AppLeftColumn />

            <div className="flex-1">
              <Component {...pageProps} />
            </div>

            <AppRightColumn />
          </div>
        </div>
      </Provider>
    );
  }
}

export default MyToDoApp;
