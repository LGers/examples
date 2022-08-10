import { A } from '../components/A';
import Head from 'next/head';
import { MainContainer } from '../components/MainContainer';

const Index = () => {
  return (
    <MainContainer keywords={"main page"}>
      <div className="navbar">
        <A href={'./'} text={'Main page'} />
        <A href={'./users'} text={'Users'} />
      </div>
      <h1>Next Js Basic Main Page</h1>
      {/*<style jsx>
        {`
          .navbar {
            background: chocolate;
            padding: 15px;
          }
        `}
      </style>*/}
    </MainContainer>
  );
};

export default Index;
