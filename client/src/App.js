import React, { Component } from "react";
import Ballot from "./contracts/Ballot.json";
import getWeb3 from "./getWeb3";
import Select from 'react-select';
import "./App.css";

class App extends Component {
  state = { storageValue: 0,
            web3: null,
            accounts: [], 
            contract: null, 
            route : "Vote",
            Register_value: null,
            Vote_value : null, 
            dic: [],
            counter : 0,
  
            proposals : [] ,
            chairperson : null,
            unregistered_voters : [] ,
            registered_voters  : [] ,

  }  
             

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
      this.setState({ web3, accounts, contract: instance },this.Info);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };
  

    Info = async()=>{
    const response =  await this.state.contract.methods.ContractInfo().call();
    console.log(response);
    this.setState( { proposals: response[0], chairperson : response[1], unregistered_voters : response [2] });
    this.state.unregistered_voters.forEach(voter=>{
      let newCount = this.state.counter + 1;  
      this.setState({counter: newCount }) ;
      this.state.dic.push({value: this.state.counter , label : voter});
    });
    
  }


  RegisterButton = async(account)=>{
     await this.state.contract.methods.unRegistered_Users(account).send({from : this.state.accounts [0]});
    console.log(account);
    alert("Requested");
  } 
  handleChange = (event)=>{
    
   this.setState({Register_value: event.label});
  }
  SubmitChange= async()=>{
    let ind= 0 ;
    this.state.unregistered_voters.forEach((voter,index)=>{
      if(voter ===this.state.value){
        this.state.registered_voters.push(this.state.unregistered_voters[index]);
        ind = index ;
      }
    });
    await this.state.contract.methods.giveRightToVote(this.state.Register_value,ind).send({from: this.state.accounts[0]});
    alert("Given Authority");
  }
  handleVoteChange=(event)=>{
    this.setState({Vote_value :event.target.value});
    
  }
  SubmitVote =async()=>{
    try{
      
    await this.state.contract.methods.vote(this.state.Vote_value).send({from : this.state.accounts [0]});
    alert("Sucessful");
    }
    catch(error){
      alert("Either Already Registered or Voted Previously")
    }
  }


  render() {
    
    if(this.state.chairperson && this.state.web3 ){
     return (
        <div className="App">
        
         {this.state.accounts[0]===this.state.chairperson ? this.state.route = "Chairperson" : this.state.route = "Register"}
         <div>
            { this.state.route === "Register"
              ? <div> 
                 <h1>Ballot V 2.0 !</h1>
                 <p>Your Account no. is .{this.state.accounts[0]} </p>
                 <p>
                    Register Yourself first for voting procedure to follow !
                  </p>
                 <button className="register_button" onClick ={()=> this.RegisterButton(this.state.accounts[0])} >Request the chairperson</button>
                 
                  <div className ="Vote">
                    <h2> Hi There Account no. - {this.state.accounts[0]}</h2>
                    <p> Select the Candidate you wish to vote for!</p>
                    <select id ="proposal" onChange={(event)=>this.handleVoteChange(event)} >
                       
                       {this.state.proposals.map((proposal,index)=> <option value={index} >{proposal}</option>)}
                    </select>
                    <button onClick={()=>this.SubmitVote()}> VOTE !</button>
                  </div>
                </div>  
             : <div>
                <h2>Hi there chairperson ?</h2>
                <p> Give the the right to vote! </p>
                <div className = "Input">
                  <Select id ="Voters"  options ={this.state.dic} onChange= {(e)=>this.handleChange(e)}/>
                  <input type="submit" value="Submit" onClick = {()=>this.SubmitChange()}/>
                </div>
              </div>
                
            }  
          </div>
        </div>
      );
    }
    else
      return <div>Loading Web3, accounts, and contract...</div>;
  }
}

export default App;
