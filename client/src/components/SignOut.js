import React from 'react';
import Courses from "./Courses";

const SignOut = (props) => {
    if(localStorage.auth){
      props.signOut();
    }
    return <Courses />
};

export default SignOut;
