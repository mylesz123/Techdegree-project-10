import React, { Component } from 'react';
import Link from "react-router-dom/es/Link";
import axios from 'axios';
import {withRouter} from "react-router-dom";

class UserSignUp extends Component {

    state = {
        firstName: '',
        lastName: '',
        emailAddress: '',
        password: '',
        confirmPassword: '',
        validationErrorMsg: '',
        displayError: false,
    };

    onChange = (e) => {
        this.setState({ [e.target.name] : e.target.value});
    };

    handleSubmit = async (e) => {
        e.preventDefault();

        const { firstName, lastName, emailAddress, password, confirmPassword } = this.state;

        if(password === confirmPassword){
          try {
            const response = await axios.post('http://localhost:5000/api/users', {
              firstName,
              lastName,
              emailAddress,
              password
            })
            if(response.status === 201){
              this.setState({
                  displayError: false
              })
              this.props.signIn(this.state.emailAddress, this.state.password, this.props.history);
              this.props.history.push('/');
            }
          }
          catch (e) {
            if(e.response.status === 400){
              this.setState({
                  validationErrorMsg: this.handleValidationMsg(e.response.data.message),
                  displayError: true
              })
            }
          }  
        }

        else {
          this.setState({
              validationErrorMsg: 'Passwords must be identical',
              displayError: true
            })
        }
    };

    handleValidationMsg = (errorResponse) => {
        // Formatting the server response message to be rendered properly
        const splitAndSpliced = errorResponse.split(':').splice(2);
        const formattedErrorMsg = [];

        for (let i = 0; i < splitAndSpliced.length; i++){
          if(i !== splitAndSpliced.length - 1){
            formattedErrorMsg.push(splitAndSpliced[i].substring( 1 , splitAndSpliced[i].indexOf(',')));
          }
          else {
            formattedErrorMsg.push(splitAndSpliced[splitAndSpliced.length - 1].trim());
          }
        }

        if(this.state.firstName === ''){
          return formattedErrorMsg[0];
        }
        if(this.state.lastName === ''){
          return formattedErrorMsg[0];
        }
        if(this.state.emailAddress === ''){
          return formattedErrorMsg[0];
        }
        if(this.state.password === ''){
          return formattedErrorMsg[0];
        }
    };

    render() {
        const { firstName, lastName, emailAddress, password, confirmPassword, validationErrorMsg } = this.state;

        return (
            <div className="bounds">
                    <div className="grid-33 centered signin">
                        <div>
                        <h1>Sign Up</h1>
                            { this.state.displayError
                            ? <div>
                                <h2 className="validation--errors--label">Validation Error</h2>
                                <div className="validation-errors">
                                    <ul>
                                      <li>{ validationErrorMsg }</li>
                                    </ul>
                                </div>
                            </div> : null }

                            <form onSubmit={this.handleSubmit}>
                                <div>
                                    <input
                                        id="firstName"
                                        name="firstName"
                                        onChange={this.onChange}
                                        type="text"
                                        placeholder="First Name"
                                        value={ firstName }
                                    />
                                </div>
                                <div>
                                    <input
                                        id="lastName"
                                        name="lastName"
                                        onChange={this.onChange}
                                        type="text"
                                        placeholder="Last Name"
                                        value={ lastName }
                                    />
                                </div>
                                <div>
                                    <input
                                        id="emailAddress"
                                        name="emailAddress"
                                        onChange={this.onChange}
                                        type="email"
                                        placeholder="Email Address"
                                        value={ emailAddress }
                                        autoComplete="username"
                                    />
                                </div>
                                <div>
                                    <input
                                        id="password"
                                        name="password"
                                        onChange={this.onChange}
                                        type="password"
                                        placeholder="Password"
                                        value={ password }
                                        autoComplete="new-password"
                                    />
                                </div>
                                <div>
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        onChange={this.onChange}
                                        type="password"
                                        placeholder="Confirm Password"
                                        value={ confirmPassword }
                                        autoComplete="new-password"
                                    />
                                </div>
                                <div className="grid-100 pad-bottom">
                                    <button className="button" type="submit">Sign Up</button>
                                    <Link className="button button-secondary" to="/">Cancel</Link>
                                </div>
                            </form>
                        </div>
                        <p>&nbsp;</p>
                        <p>Already have a user account? <Link to="signin">Click here</Link> to sign in!</p>
                    </div>
                </div>
        )
    }
}

export default withRouter(UserSignUp)
