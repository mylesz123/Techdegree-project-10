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
        showErr: false,
    };

    onChange = (e) => {
        this.setState({ [e.target.name] : e.target.value});
    };

    handleSubmit = async (e) => {
        e.preventDefault();

        const { firstName, lastName, emailAddress, password, confirmPassword } = this.state;

        if(password === confirmPassword){
          try {
            const res = await axios.post('http://localhost:5000/api/users', {
              firstName,
              lastName,
              emailAddress,
              password
            })
            if(res.status === 201){
              this.setState({
                  showErr: false
              })
              this.props.signIn(this.state.emailAddress, this.state.password, this.props.history);
              this.props.history.push('/');
            }
          }
          catch (e) {
            if(e.res.status === 400){
              this.setState({
                  validationErrorMsg: this.handleValidationMsg(e.res.data.message),
                  showErr: true
              })
            }
          }
        }

        else {
          this.setState({
              validationErrorMsg: 'Passwords must be identical',
              showErr: true
            })
        }
    };

    handleValidationMsg = (errorResponse) => {
        // Formatting the server res message to be rendered properly
        const fixed = errorResponse.split(':').splice(2);
        const formattedErrorMsg = [];

        for (let i = 0; i < fixed.length; i++){
          if(i !== fixed.length - 1){
            formattedErrorMsg.push(fixed[i].substring( 1 , fixed[i].indexOf(',')));
          }
          else {
            formattedErrorMsg.push(fixed[fixed.length - 1].trim());
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
                            { this.state.showErr
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
                        <p>Already have an account? <Link to="signin">Click here</Link> to sign in!</p>
                    </div>
                </div>
        )
    }
}

export default withRouter(UserSignUp)
