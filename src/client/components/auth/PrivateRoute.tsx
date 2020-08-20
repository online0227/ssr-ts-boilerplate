import React from 'react';
import { AuthInfo } from '../types/authentication';
import { connect } from 'react-redux';
import { Redirect } from "react-router-dom";

interface IsAuthenticatedProps {
    user?: AuthInfo;
    location?: Object;
}

export default ChildComponent => {
    class PrivateRouteWrapper extends React.Component<IsAuthenticatedProps> {
        render() {
            switch (this.props.user.logged) {
                case false:
                    return <Redirect
                        to={{
                            pathname: "/",
                            state: { from: this.props.location }
                        }}
                    />;
                default:
                    return <ChildComponent {...this.props} />;
            }
        }
    }

    function mapStateToProps(state) {
        return {
            user: state.auth.userInfo
        }
    }

    return connect(mapStateToProps)(PrivateRouteWrapper);
};