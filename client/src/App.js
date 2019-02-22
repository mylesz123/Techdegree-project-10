//imports
import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import axios from 'axios';

//components
import Header from "./components/Header";

class App extends Component {
  //declare states
  state ={
    currentUser: '',
    signedIn: false,
    authorizationErrorMsg: ''
  }

  //mounting component
  componentDidMount(){
    if(localStorage.user){
      this.setState({
        signedIn: true,
        currentUser: JSON.parse(window.localStorage.getItem('user')) //user key
      })
    }
  }

  //handle signing in and out
  signIn = async (email, password, history) => {
    try {
        const response = await axios.get('http://localhost:5000/api/users',
            { auth: {username: email, password: password} });
            localStorage.setItem('user', JSON.stringify(response.data));
            localStorage.setItem('auth', JSON.stringify(response.config.headers.Authorization));
            this.setState({ currentUser: response.data, signedIn: true});
    } 
    catch (err) {
          if(err.response.status === 401 || err.response.status === 500){
              this.setState({ authorizationErrorMsg: err.response.data.message});
              history.push('/signin');
          } 
          else {
              history.push('/error');
          }
    }
 };

  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Route path='/' render={() => <Header user={this.state.currentUser} signedIn={this.state.signedIn} /> } />
          <Switch>
            {/* drop some code */}
          </Switch>
        </div>
      </BrowserRouter>
      
    );
  }
}

export default App;
