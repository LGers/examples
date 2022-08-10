import { A } from '../../components/A';
import styles from './users.module.scss';
import { MainContainer } from '../../components/MainContainer';

const Users = ({ users }) => {
  return (
    <MainContainer keywords={"Users next js page"}>
      <h1>Users</h1>
      <ul>
        {users.map((user) => {
          return (
            <li key={user.id}>
              <A text={user.name} href={`/users/${user.id}`} className={styles.user}/>
            </li>
          );
        })}
      </ul>
    </MainContainer>
  );
};

export default Users;

export async function getStaticProps(context) {
  const res = await fetch('https://jsonplaceholder.typicode.com/users/');
  const data = await res.json();
  const users = data.map((u) => ({ id: u.id, name: u.name }))

  return {
    props: {users}, // will be passed to the page component as props
  }
}
