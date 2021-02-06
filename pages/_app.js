import { useRouter } from 'next/router';
import 'tailwindcss/tailwind.css';
import AppHeader from '../components/layouts/AppHeader';
import AppLeftColumn from '../components/layouts/AppLeftColumn';
import AppRightColumn from '../components/layouts/AppRightColumn';

function MyToDoApp({ Component, pageProps }) {
  const router = useRouter();

  if (router.pathname === '/') {
    return (
      <div className="min-h-screen flex flex-col">
        <Component {...pageProps} />
      </div>
    );
  }
  else {
    return (
      <div className="min-h-screen flex flex-col">
        <AppHeader />

        <div className="flex-1 flex">
          <AppLeftColumn />

          <div className="flex-1">
            <Component {...pageProps} />
          </div>

          <AppRightColumn />
        </div>
      </div>
    );
  }
}

export default MyToDoApp;
