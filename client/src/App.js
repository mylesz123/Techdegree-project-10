//imports
import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import axios from 'axios';
//components
import Header from "./components/Header";
import Courses from "./components/Courses";
import CourseDetail from "./components/CourseDetail";
import CreateCourse from "./components/CreateCourse";
import CourseUpdate from "./components/CourseUpdate";
import PrivateRoute from "./components/PrivateRoute";
//sign in, out, and up
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import SignOut from "./components/SignOut";
//errors
import Err from "./components/errors/Err";
import Forbidden from "./components/errors/Forbidden";
import NotFound from "./components/errors/NotFound";


class App extends Component {
  //declare states
  state = {
    currentUser: '', //currently signed in
    signedIn: false,
    authErrorMsg: ''
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
  /*handle when user signs in*/
  signIn = async(email, password, history) => {
    try {
      const response =
      await axios.get('http://localhost:5000/api/users',
        { auth: {username: email, password: password} });
        localStorage.setItem('user', JSON.stringify(response.data));
        localStorage.setItem('auth', JSON.stringify(response.config.headers.Authorization)); //Authorization key
        this.setState({ currentUser: response.data, signedIn: true});
        //console.log(localStorage);
    }
    catch (err) {
      if(err.response.status === 401){
          this.setState({ authErrorMsg: err.response.data.message});
          history.push('/signin');
      }
      else {
          history.push('/error');
      }
    }
 }; 
  /*handle when user signs out*/
  signOut = () => {
    this.setState({
      user: '',
      signedIn: false
    });
    localStorage.clear();  //wipe user info and auth
    //console.log(localStorage);

  }; 
  
  /* render components when routes are navigated to */
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Route path='/' render={() => <Header user={this.state.currentUser} signedIn={this.state.signedIn} /> } />
          <Switch>
            {/* drop some code */}
            <PrivateRoute path="/courses/create" component={CreateCourse} user={this.state.currentUser} /> } />
            <PrivateRoute path="/courses/:id/update" component={CourseUpdate}  /> } />
            <Route exact path="/" render={ () => <Courses />} />
            <Route exact path="/signin" render={ () => <SignIn signIn={this.signIn} authErrorMsg={this.state.authErrorMsg} />} />
            <Route exact path="/signup" render={ () => <SignUp signIn={this.signIn} />  } />
            <Route exact path="/courses/:id" render={ (props) => <CourseDetail id={props.match.params.id} /> } />
            <Route exact path="/signout" render={() => <SignOut signOut={this.signOut}/>}/>
            <Route path="/forbidden" component={ Forbidden } />
            <Route path="/error" component={ Err } />
            <Route path="/notfound" component={ NotFound } />
            <Route component={ NotFound } />
          </Switch>
        </div>
      </BrowserRouter>
      
    );
  } // end render
}

export default App;
