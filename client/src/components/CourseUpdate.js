//stateful ... remeber that variables inside of functions are local!
import React, { Component } from 'react';
import Link from "react-router-dom/es/Link";
import {withRouter} from "react-router-dom";
import axios from "axios";

class CourseUpdate extends Component {
    state = {
        user:{},
        title:'',
        description:'',
        estimatedTime:'',
        materialsNeeded:'',
        errMsgHeader: '',
        errMsg: '',
        hideValidationWrapper: true,
    }

    // get existing data
    async componentDidMount(){
        try{
            const res = await axios.get(`http://localhost:5000/api/courses/${this.props.match.params.id}`);
            const { user, title, description, estimatedTime, materialsNeeded } = res.data;
            this.setState({
              user,
              title,
              description,
              estimatedTime,
              materialsNeeded,
            })
        }
        catch (err){
            //not found
            if(err.res.status === 404){
                this.props.history.push('/notFound');
            }
            //forbidden/ unauthorized
            if(err.res.status === 401 || err.res.status === 403){
                this.props.history.push('/forbidden');
            }
            else{this.props.history.push('/error')}
        }
    }

    handleChange = (event) => {
        this.setState({
            [event.target.id] : event.target.value
        });
    }

    // Update course data
    handleSubmit = async (event) => {
        event.preventDefault();
        const { title, description, estimatedTime, materialsNeeded, user } = this.state;
        try{
            const res = await axios.put(`http://localhost:5000/api/courses/${this.props.match.params.id}`, {
                user,
                title,
                description,
                estimatedTime,
                materialsNeeded,
            }, 
            //parse authorization data from local storage
            { headers: { 'Authorization' : JSON.parse(window.localStorage.getItem('auth'))} 
            });
            // if no content
            if(res.status === 204){
                this.props.history.goBack();
            }
        } 
        catch (err) {
            // incorrect request
            if(err.res.status === 400){
                this.setState({
                    errMsgHeader: 'Bad request',
                    errMsg: err.res.data.message,
                    hideValidationWrapper: false
                })
            }
            //forbidden/ unauthorized
            if(err.res.status === 401 || err.res.status === 403){
                this.setState({
                    errMsgHeader: 'Authorization error',
                    errMsg: err.res.data.message,
                    hideValidationWrapper: false
                })
            }
        }

    };

    
    render() {
        const { title, description, estimatedTime, materialsNeeded, errMsgHeader, errMsg } = this.state;

        return (
            <div className="bounds course--detail">
                <h1>Update Course</h1>
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
                                    <input
                                        id="title"
                                        name="title"
                                        onChange={ this.handleChange }
                                        type="text"
                                        className="input-title course--title--input"
                                        placeholder="Course title..."
                                        value={ title }/>
                                    </div>
                                <p> - By { this.state.user.firstName } { this.state.user.lastName } </p>
                            </div>
                            <div className="course--description">
                                <div>
                                    <textarea
                                        id="description"
                                        name="description"
                                        onChange={ this.handleChange }
                                        value={ description }
                                        placeholder="Course description...">
                                    </textarea>
                                </div>
                            </div>
                        </div>
                        <div className="grid-25 grid-right">
                            <div className="course--stats">
                                <ul className="course--stats--list">
                                    <li className="course--stats--list--item">
                                        <h4>Estimated Time</h4>
                                        <div>
                                            <input
                                                id="estimatedTime"
                                                name="estimatedTime"
                                                onChange={ this.handleChange }
                                                type="text"
                                                className="course--time--input"
                                                value={ estimatedTime }
                                                placeholder="Hours"/>
                                        </div>
                                    </li>
                                    <li className="course--stats--list--item">
                                        <h4>Materials Needed</h4>
                                        <div>
                                            <textarea
                                                id="materialsNeeded"
                                                name="materialsNeeded"
                                                onChange={this.handleChange}
                                                value={ materialsNeeded }
                                                placeholder=" What materials? ">
                                            </textarea>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="grid-100 pad-bottom">
                            <button className="button" type="submit">Update Course</button>
                            <Link to={`/courses/${this.props.match.params.id}`} className="button button-secondary">Cancel</Link>
                        </div>
                    </form>
                </div>
            </div>
        )     
    }


}

export default withRouter(CourseUpdate);