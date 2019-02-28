import React, { Component } from 'react';
import axios from 'axios';
import Link from "react-router-dom/es/Link";
import { withRouter } from "react-router-dom";


class UpdateCourse extends Component {

    state = {
        user:{},
        title:'',
        description:'',
        estimatedTime:'',
        materialsNeeded:'',
        errorMsgHeader: '',
        errorMsg: '',
        hideValidationWrapper: true,
    };

    // Fetch existing data
    async componentDidMount() {
        try{
            const response = await axios.get(`http://localhost:5000/api/courses/${this.props.match.params.id}`);
                const { title, description, estimatedTime, materialsNeeded, user } = response.data;
                this.setState({
                    user,
                    title,
                    description,
                    estimatedTime,
                    materialsNeeded,
                });
        } catch (e) {
            if(e.response.status === 404) {
                this.props.history.push('/notfound');
            }  if(e.response.status === 401 || e.response.status === 403) {
                this.props.history.push('/forbidden');
            } else {
                this.props.history.push('/error');
            }
        }
    }

    handleChange = (e) => {
        this.setState({[e.target.id] : e.target.value});
    };

    // Update data
    handleSubmit = async (e) => {
        e.preventDefault();
        const { title, description, estimatedTime, materialsNeeded, user } = this.state;
        //if title and description are !blank then proceed, else throw validation error
        if(title !== "" && description !== ""){
            try{
                const response = await axios.put(`http://localhost:5000/api/courses/${this.props.match.params.id}`, {
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
                if(response.status === 204){
                    this.props.history.goBack();
                }
            } 
            catch (e) { //bad req
                if(e.response.status === 400){
                    this.setState({
                        errorMsgHeader: 'Validation error',
                        errorMsg: e.response.data.message,
                        hideValidationWrapper: false
                    });
                }
                //forbidden/ unauthorized
                if(e.response.status === 401 || e.response.status === 403){
                    this.setState({
                        errorMsgHeader: 'Authorization error',
                        errorMsg: e.response.data.message,
                        hideValidationWrapper: false
                    });
                }
            }
            
        }
        else {
            this.setState({
                hideValidationWrapper: false,
                errorMsgHeader: 'Validation error',
            });
        }
        

    };

    render() {
        const { title, description, estimatedTime, materialsNeeded, errorMsgHeader, errorMsg
        } = this.state;
        return (
            <div className="bounds course--detail">
                <h1>Update Course</h1>
                <div>
                    { !this.state.hideValidationWrapper ? <div>
                        <h2 className="validation--errors--label">{ errorMsgHeader }</h2>
                        <div className="validation-errors">
                            <ul>
                                <li>{ errorMsg }</li>
                            </ul>
                        </div>
                    </div> : null }
                    <form onSubmit={this.handleSubmit}>
                        <div className="grid-66">
                            <div className="course--header">
                                <h4 className="course--label">Course</h4>
                                <div>
                                    <input
                                        id="title"
                                        name="title"
                                        onChange={this.handleChange}
                                        type="text"
                                        className="input-title course--title--input"
                                        placeholder="Course title..."
                                        value={ title }/>
                                    </div>
                                <p>By {this.state.user.firstName} {this.state.user.lastName}</p>
                            </div>
                            <div className="course--description">
                                <div>
                                    <textarea
                                        id="description"
                                        name="description"
                                        onChange={this.handleChange}
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
                                                placeholder="List materials...">
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

export default withRouter(UpdateCourse);