import '@fortawesome/fontawesome-free/css/all.css';
import 'tailwindcss/tailwind.css';
import 'react-datepicker/dist/react-datepicker.css';
import { Provider } from 'react-redux';
import { store } from '@/store/index';
import './_app.scss';
import AppContainer from '@/layouts/AppContainer';

function MyToDoApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <AppContainer>
        <Component {...pageProps} />
      </AppContainer>
    </Provider>
  );
}

export default MyToDoApp;
