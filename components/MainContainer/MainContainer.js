import { A } from '../A';
import Head from 'next/head';
import styles from './MainContainer.module.scss';

export const MainContainer = ({ children, keywords }) => {
  return (
    <>
      <Head>
        <meta name="keywords" content={`LGers Next app ${keywords}`} />
        <title>Main page</title>
      </Head>

      <div className={styles.navbar}>
        <A href={'./'} text={'Main page'}/>
        <A href={'./users'} text={'Users'}/>
      </div>
      {children}
    </>
  );
};
