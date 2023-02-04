import '@fortawesome/fontawesome-free/css/all.css';
import 'react-datepicker/dist/react-datepicker.css';
import '@/lib/styles/globals.css';
import '@/lib/styles/react-datepicker.scss';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { store } from '@/lib/store/index';
import { AppContainer } from '@/components/layout';

function MyToDoApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <AppContainer>
        <Component {...pageProps} />
      </AppContainer>
    </Provider>
  );
}

export default MyToDoApp;
