import React, { Component } from 'react';
import axios from "axios";
import { withRouter } from "react-router-dom"; // needed to use history prop
import Link from "react-router-dom/es/Link";
import ReactMarkdown from "react-markdown";

class CourseDetail extends Component {

    state = {
        course : {},
        courseOwner: {},
        materialsNeeded: '',
        showError: false,
        errorMsg: ''
    };

    async componentDidMount() {
        try {
            const res = await axios.get(`http://localhost:5000/api/courses/${this.props.id}`);
            this.setState({
                course: res.data,
                courseOwner: res.data.user,
                materialsNeeded: res.data.materialsNeeded
            });
        } 
        catch (err) {
            err.res.status === 404 
            ? this.props.history.push('/notfound') 
            : this.props.history.push('/error');
        }
    }
    // display items correctly in JSX.
    formatMaterials(){
        const materialsNeeded = this.state.materialsNeeded;
        if(materialsNeeded){
            return materialsNeeded.split(/[-,*|\t]+/);
        } 
        else { //if materialsNeeded is undefined
            return [];
        }
    }

     dropCourse = async () => {
        try{
            await axios.delete(`http://localhost:5000/api/courses/${this.props.id}`,
                {headers: {'Authorization': JSON.parse(window.localStorage.getItem('auth'))}});
                this.props.history.goBack();
        } catch (e) {
            if(e.res.status === 401 || e.res.status === 403){
                this.setState({
                    errorMsg: e.res.data.message,
                    showError: true,
                });
            } else {
                this.props.history.push('/error');
            }
        }
    };

    render() {
        const currentUser = JSON.parse(localStorage.getItem('user'));
        const { title, description, estimatedTime } = this.state.course;
        const { firstName, lastName, _id : ownerID } = this.state.courseOwner;

        return (
            <div>
                <div className="actions--bar">
                    <div className="bounds">
                        <div className="grid-100">
                            {/* update and delete shows only when current userID === course owner ID */}
                            { (currentUser) && currentUser._id === ownerID
                                ?
                                <span>
                                    <Link className="button" to={`/courses/${this.props.id}/update`}>Update Course</Link>
                                    <button className="button" onClick={this.dropCourse}>Delete Course</button>
                                </span>
                                : null
                            }
                            <Link className="button button-secondary" to="/">Return to List</Link>
                        </div>
                    </div>
                </div>
                <div className="bounds course--detail">
                    <div className="grid-66">
                        {this.state.showError 
                        ? 
                        <div>
                            <h2 className="validation--errors--label"> Error</h2>
                            <div className="validation-errors">
                                <ul>
                                    <li>{this.state.errorMsg}</li>
                                </ul>
                            </div>
                        </div> 
                        : null }
                        <div className="course--header">
                            <h4 className="course--label">Course</h4>
                            <h3 className="course--title">{ title }</h3>
                            <p>By { firstName } { lastName }</p>
                        </div>
                        <div className="course--description">
                            {/* <h4> Description </h4> */}
                            <ReactMarkdown>{ description }</ReactMarkdown>
                        </div>
                    </div>
                    <div className="grid-25 grid-right">
                        <div className="course--stats">
                            <ul className="course--stats--list">
                                <li className="course--stats--list--item">
                                    <h4>Estimated Time</h4>
                                    <h3>{ estimatedTime }</h3>
                                </li>
                                <li className="course--stats--list--item">
                                    <h4>Materials Needed</h4>
                                    <ul>
                                        {this.formatMaterials().map((item, index) => (
                                            <ReactMarkdown key={index}>{ item }</ReactMarkdown>
                                        ))}
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(CourseDetail);