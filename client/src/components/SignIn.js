import React, { Component } from 'react';
import Link from "react-router-dom/es/Link";
import {withRouter} from "react-router-dom";
import Redirect from "react-router-dom/es/Redirect";

class SignIn extends Component {

    state = {
        emailAddress: '',
        password: ''
    };

    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
    };

    handleSubmit = (event) => {
        event.preventDefault();
        this.props.signIn(this.state.emailAddress, this.state.password, this.props.history);
    };

    render() {
        const { emailAddress, password } = this.state;
        const { from } = this.props.location.state || { from: { pathname: '/'}};

        // redirect you to sign in from where ever you are to access certain info
        if(localStorage.getItem('auth')){
          return (
            <Redirect to={ from } />
          )
        }

        return (
            <div className="bounds">
                <div className="grid-33 centered signin">
                    <h1>Sign In</h1>

                    {this.props.authErrorMsg
                      ? <div>
                          <h2 className="validation--errors--label">Validation Error</h2>
                          <div className="validation-errors">
                              <ul>
                                  <li>{ this.props.authErrorMsg }</li>
                              </ul>
                          </div>
                      </div>
                    : null }

                    <div>
                        <form onSubmit={ this.handleSubmit }>
                            <div>
                                <input
                                    id="emailAddress"
                                    name="emailAddress"
                                    type="text"
                                    onChange={ this.handleChange }
                                    placeholder="Email Address"
                                    value={ emailAddress }
                                    autoComplete="username"

                                />
                            </div>
                            <div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    onChange={ this.handleChange }
                                    placeholder="Password"
                                    value={ password }
                                    autoComplete="current-password"
                                />
                            </div>
                            <div className="grid-100 pad-bottom">
                                <button className="button" type="submit">Sign In</button>
                                <Link className="button button-secondary" to="/">Cancel</Link>
                            </div>
                        </form>
                    </div>
                    <p>&nbsp;</p>
                    <p>Don't have an account? <Link to="signup">Click here</Link> to sign up!</p>
                </div>
            </div>
        )
    }
}

export default withRouter(SignIn);
