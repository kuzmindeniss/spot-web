import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { useAuth } from './hooks/Auth';

const PrivateRoute = ({children, ...rest}) => {
    let auth = useAuth();
    return (
        <Route {...rest} render={({ location }) =>{
            if (auth?.user || !auth?.didUserInit) return (children)
            else return <Redirect
                to={{
                    pathname: "/",
                    state: { from: location }
                }}
            />
        }}
        />
    );
}

export default PrivateRoute;    