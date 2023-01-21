import Head from 'next/head';
import classNames from 'classnames/bind';
import { PageToolbar } from '@/components/toolbar';
import { NoDataPlaceholder } from '@/components/placeholder';
import styles from '../inbox.module.scss'; // shared

const cx = classNames.bind(styles);

export default function Search() {
  return (
    <main className={cx('main')}>
      <Head>
        <title>&ldquo;&rdquo; 검색 중 - To Do</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <PageToolbar title="&ldquo;&rdquo; 검색 중" />

      <NoDataPlaceholder />
    </main>
  );
}
