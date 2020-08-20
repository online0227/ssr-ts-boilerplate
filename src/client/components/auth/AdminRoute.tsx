
import React from 'react';
import { AuthInfo } from '../types/authentication';
import { connect } from 'react-redux';
import { Redirect } from "react-router-dom";

interface IsAuthenticatedProps {
    user?: AuthInfo;
    location?: Object;
}

export default ChildComponent => {
    class AdminRouteWrapper extends React.Component<IsAuthenticatedProps> {
        render() {
            if (this.props.user.logged && this.props.user.role === 1) {
                return <ChildComponent {...this.props} />;
            } else {
                return <Redirect
                    to={{
                        pathname: "/",
                        state: { from: this.props.location }
                    }}
                />;
            }
        }
    }

    function mapStateToProps(state) {
        return {
            user: state.auth.userInfo
        }
    }

    return connect(mapStateToProps)(AdminRouteWrapper);
};