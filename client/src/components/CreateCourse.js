//stateful ... remeber that variables inside of functions are local!
import React, { Component } from 'react';
import Link from "react-router-dom/es/Link";
import {withRouter} from "react-router-dom";
import axios from "axios";

class CreateCourse extends Component {
    state = {
        title: "",
        errMsg: "",
        description: "",
        estimatedTime: "",
        errMsgHeader: "",
        materialsNeeded: "",
        hideValidationWrapper: true,
    }

    handleChange = (event) => {
        this.setState({
            [event.target.id] : event.target.value
        });

    }

    handleSubmit = async (event) => {
        event.preventDefault();
        const user = JSON.parse(window.localStorage.getItem('user'));
        console.log(user);
        const { title, description, estimatedTime, materialsNeeded} = this.state;
        
        // axios response
        try {
            const res = await axios.post('http://localhost:5000/api/courses',
            {
                user,
                title,
                description,
                estimatedTime,
                materialsNeeded,
            },
            {
                headers: {'Authorization': JSON.parse(window.localStorage.getItem('auth'))}
            });
            
            if (res.status === 201) {
                this.props.history.goBack();
            }
        }
        catch (err) {
            if(err.res.status === 400){
                this.setState({
                    errMsgHeader: 'Validation error',
                    errMsg: err.res.data.message,
                    hideValidationWrapper: false
                });
            }
            if(err.res.status === 401 || err.res.status === 403){
                this.setState({
                    errMsgHeader: 'Authorization error',
                    errMsg: err.res.data.message,
                    hideValidationWrapper: false
                });
            }
        }
    }

    //render
    render(){
        const { title, description, estimatedTime, materialsNeeded, errMsg, errMsgHeader } = this.state;

        return (
            <div className="bounds course--detail">
                <h1>Create Course</h1>
                <div>
                    { !this.state.hideValidationWrapper
                      ? <div>
                          <h2 className="validation--errors--label">{ errMsgHeader }</h2>
                          <div className="validation-errors">
                              <ul>
                                  <li>{ errMsg }</li>
                              </ul>
                          </div>
                      </div>
                      : null }
                    <form onSubmit={ this.handleSubmit }>
                        <div className="grid-66">
                            <div className="course--header">
                                <h4 className="course--label">Course</h4>
                                <div>
                                    <input className="input-title course--title--input"
                                        id="title"
                                        onChange={ this.handleChange }
                                        name="title"
                                        type="text"
                                        placeholder="Enter Course title"
                                        value={ title } />
                                </div>

                            </div>
                            <div className="course--description">
                                <div>
                                    <textarea
                                        id="description"
                                        name="description"
                                        onChange={ this.handleChange }
                                        value={ description }
                                        placeholder="Enter Course description">
                                    </textarea>
                                </div>
                            </div>
                        </div>
                        <div className="grid-25 grid-right">
                            <div className="course--stats">
                                <ul className="course--stats--list">
                                    <li className="course--stats--list--item">
                                        <h4>Estimated Time</h4>
                                        <div><input className="course--time--input"
                                            id="estimatedTime"
                                            name="estimatedTime"
                                            type="text"
                                            placeholder="Hours"
                                            onChange={ this.handleChange }
                                            value={ estimatedTime } />
                                        </div>
                                    </li>
                                    <li className="course--stats--list--item">
                                        <h4>Materials Needed</h4>
                                        <div>
                                            <textarea
                                                id="materialsNeeded"
                                                name="materialsNeeded"
                                                placeholder="List materials..."
                                                onChange={ this.handleChange }
                                                value={ materialsNeeded } >
                                            </textarea>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="grid-100 pad-bottom">
                            <button className="button" type="submit">Create Course</button>
                            <Link to="/" className="button button-secondary">Cancel</Link>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default withRouter(CreateCourse);