import Head from 'next/head';
import classNames from 'classnames/bind';
import styles from '../inbox.module.scss'; // shared
import PageToolbar from '@/components/PageToolbar';
import NoDataPlaceholder from '@/components/placeholder/NoDataPlaceholder';

const cx = classNames.bind(styles);

export default function Search() {
  return (
    <main className={cx('main')}>
      <Head>
        <title>&ldquo;&rdquo; 검색 중 - To Do</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <PageToolbar
        title="&ldquo;&rdquo; 검색 중"
      />

      <NoDataPlaceholder />
    </main>
  );
}
