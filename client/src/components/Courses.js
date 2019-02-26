//stateful ... remeber that variables inside of functions are local!
import React, { Component } from 'react';
import Link from "react-router-dom/es/Link";
import {withRouter} from "react-router-dom";
import axios from "axios";

class Courses extends Component {
    /* establish state */
    state = {
        isLoaded: false,
        courses: []
    }

    /* async function to await for data (courses) to load */
    async componentDidMount(){
        try{
            const courses =  await axios.get('http://localhost:5000/api/courses');
            this.setState({
                courses: courses.data,
                isLoaded: true
            })
        }
        catch (err) {
            this.props.history.push('/error'); //route
        }
    }

    /* render component */
    render () {
        const { isLoaded, courses } = this.state;

        if (!isLoaded) {
            return <div className="loader">Loading...</div> ;
        }
        
        //once loaded
        return (
            <div className="bounds">
                { courses.map( course => (
                    <div className="grid-33" key={ course._id }>
                        <Link className="course--module course--link" to={ `/courses/${ course._id }` }>
                            <h4 className="course--label">Course</h4>
                            <h3 className="course--title"> { course.title }</h3>
                        </Link>
                    </div>
                ))}
                <div className="grid-33">
                    <Link className="course--module course--add--module" to="/courses/create">
                    <h3 className="course--add--title">
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 13 13" className="add">
                            <polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 "></polygon>
                        </svg>
                        New Course
                    </h3>
                    </Link>
                </div>
            </div>
            )
    } // end render

}

export default withRouter(Courses);