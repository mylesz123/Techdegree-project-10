import React from 'react';
import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({ component: Component, ...rest }) => ( //spread into object
    <Route {...rest} render={(props) => (
        localStorage.getItem('auth') //make sure user is signed in before granting access
          ? <Component {...props} />
          : <Redirect to={{ pathname: '/signin', state: { from: props.location } }}/>
    )}/>
);

export default PrivateRoute;
