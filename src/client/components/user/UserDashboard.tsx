import React, { Component } from 'react';
import { withRouter, RouteComponentProps } from "react-router-dom";
import { connect } from 'react-redux';
import { syncUser } from '../actions/apiUser'
import Layout from "../core/Layout";
import { isServer } from "../auth";
import UserSideMenu from "./UserSideMenu"
import Footer from "../core/Footer"
import { AuthInfo } from '../types/authentication';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { AppState } from '../reducers';
import PrivateRoute from '../auth/PrivateRoute';

interface IAttributeProps {
    site: string;
}

interface IStateProps {
    user: AuthInfo;
}

interface IDispatchProps {
    syncUser: (site: string) => any;
}

type PropsTypes = IAttributeProps & IStateProps & IDispatchProps & RouteComponentProps;

interface IReactStates {
    isDataFetched: boolean;
}

type StateTypes = IReactStates;

class UserDashboard extends Component<PropsTypes, StateTypes> {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            isDataFetched: false
        };
    }

    componentDidMount() {
        this._isMounted = true;
        this.syncUser();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    async syncUser() {
        await this.props.syncUser(this.props.site).then(response => {
            if (response) {
                if (this._isMounted) {
                    this.setState({ isDataFetched: true });
                }
            }
        });
    };

    userInfo = () => {
        return (
            <div className="card mb-5">
                <h3 className="card-header">User Information</h3>
                <ul className="list-group">
                    <li className="list-group-item">{this.props.user.email}</li>
                    <li className="list-group-item">
                        {this.props.user.role === 1 ? "Admin" : "Registered User"}
                    </li>
                </ul>
            </div>
        );
    };

    render() {
        if (!isServer && !this.state.isDataFetched) {
            return null;
        }

        return (
            <div>
                <Layout
                    title="Dashboard"
                    description={`G'day ${this.props.user.email}!`}
                    className="container-fluid"
                >
                    <div className="row">
                        <div className="col-md-3">
                            <UserSideMenu />
                        </div>
                        <div className="col-md-9">
                            {this.userInfo()}
                        </div>
                    </div>
                </Layout>
                <Footer />
            </div>
        );
    };
};

function mapStateToProps(state: AppState): IStateProps {
    return {
        user: state.auth.userInfo
    };
}

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, AnyAction>): IDispatchProps => {
    return {
        syncUser: async (site: string) => await dispatch(syncUser(site)),
    }
};

export default withRouter(
    connect<IStateProps, IDispatchProps, RouteComponentProps>(
        mapStateToProps, mapDispatchToProps
    )(PrivateRoute(UserDashboard)));