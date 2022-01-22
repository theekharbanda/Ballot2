import React, { Component } from "react";
import Ballot from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null, route : null };
  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      console.log(accounts);


  
      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      console.log(networkId);
      const deployedNetwork = Ballot.networks[networkId];
      const instance = new web3.eth.Contract(
        Ballot.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  Ballot = async()=>{
   // 
    const { accounts, contract } = this.state;
    

  }

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    await contract.methods.set(8).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Update state with the result.
    this.setState({ storageValue: response });
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        { this.state.route == "Register"
          ? <div> 
             <h1>Ballot V 2.0 !</h1>
              <p>Your Account no. is .</p>
              <p>
                 Register Yourself for voting procedure to follow !
              </p>
              <button classnName="register_button">Register</button>
              <div>The stored value is: {this.state.storageValue}</div>
            </div>  
          : <div>
            <h2> Hi There Account no. - {this.state.accounts}</h2>
            <p> Select the Candidate you wish to vote for!</p>
            <input type="text"></input>
            <button> VOTE !</button>
            </div>
        }  
      </div>
    );
  }
}

export default App;
