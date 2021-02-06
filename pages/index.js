import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <Head>
        <title>My To Do</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="title">
        My To Do
      </h1>

      <p className="description">
        스플래시 이미지를 잠시 보여준 후, {
          <Link href="/tasks">
            <a>/tasks</a>
          </Link>
        }로 리다이렉트
      </p>

      <style jsx>{`
        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .title {
          margin: 0;
          font-size: 3rem;
        }

        .title,
        .description {
          text-align: center;
        }
      `}</style>
    </main>
  )
}
