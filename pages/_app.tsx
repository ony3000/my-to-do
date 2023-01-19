import '@/lib/styles/globals.css';
import type { AppProps } from 'next/app';
import '@fortawesome/fontawesome-free/css/all.css';
import 'react-datepicker/dist/react-datepicker.css';
import { Provider } from 'react-redux';
import { store } from '@/lib/store/index';
import './_app.scss';
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
