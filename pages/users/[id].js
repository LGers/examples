import  { useRouter } from 'next/router';
import styles from './user.module.scss';
import { MainContainer } from '../../components/MainContainer';

const User = ({ user }) => {
  const { query } = useRouter();

  return (
    <MainContainer keywords={". User page " + user.name}>

      <div className={styles.user}>
        <h1>User with id:  {query.id}</h1>
        <div>User name: {user.name}</div>
      </div>
    </MainContainer>
  );
};

export default User;

export async function getServerSideProps({ params }) {
  const res = await fetch(`https://jsonplaceholder.typicode.com/users/${params.id}`);
  const data = await res.json();
  const user = { id: data.id, name: data.name };

  return {
    props: {user}, // will be passed to the page component as props
  }
}