import Layout from 'components/shared/Layout';
import SEO from 'components/shared/Layout/Seo';
import React, { ReactElement, useEffect } from 'react';
import Web3 from "web3";
import Web3C from '../components/Web3';



// The home page
export default function IndexPage(): ReactElement {
  useEffect(() => {
    window.ethereum.request({ method: 'eth_requestAccounts' });

    
    const web3 = new Web3(window.ethereum);

    // console.log(web3.eth.accounts);
   
  }, []);

  return (
    <Layout>
      <SEO title="Home" />
      <h1>Sati token sale</h1>
      <h3>Get your tokens today!</h3>
      <br/>
      <p>KYC Whitelisting (let's say we will ask a ID later):</p>
      <input type="text" placeholder="Enter your address to whitelist" />
      <input type="submit" />
      <Web3C />
    </Layout>
  );
}
