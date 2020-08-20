import React, { Component } from 'react';
import { withRouter, RouteComponentProps } from "react-router-dom";
import { connect } from 'react-redux';
import { updateUserProfile, syncUser } from '../actions/apiUser';
import Layout from "../core/Layout";
import { isServer } from "../auth";
import UserSideMenu from "./UserSideMenu"
import { AuthInfo } from '../types/authentication';
import { UserDetail, UserError } from '../types/apiUser';
import PrivateRoute from '../auth/PrivateRoute';

interface IAttributeProps {
    site: string;
}

interface IStateProps {
    error: UserError;
    user: AuthInfo;
    userDatail: UserDetail;
}

interface IDispatchProps {
    syncUser: (site: string) => any;    updateUserProfile: (site: string, uid: number, firstName: string, lastName: string, city: string, country: string,
        street: string, email: string, password) => any;
}

type PropsTypes = IAttributeProps & IStateProps & IDispatchProps & RouteComponentProps;

interface IReactStates {
    isDataFetched: boolean;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    city: string;
    country: string;
    street: string;
    error: boolean;
    success: boolean;
    formData: any;
}

type StateTypes = IReactStates;

class UpdateProfile extends Component<PropsTypes, StateTypes> {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            city: "",
            country: "",
            street: "",
            error: false,
            success: false,
            isDataFetched: false,
            formData: "",
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
                    this.setState({
                        email: this.props.userDatail.email,
                        firstName: this.props.userDatail.firstName,
                        lastName: this.props.userDatail.lastName,
                        city: this.props.userDatail.address.city,
                        country: this.props.userDatail.address.country,
                        street: this.props.userDatail.address.street,
                        formData: new FormData(),
                        isDataFetched: true
                    });
                }
            }
        });
    };

    handleChange = name => e => {
        if (this._isMounted) {
            this.setState({ error: false, [name]: e.target.value } as any);
            const value = e.target.value;
            this.state.formData.set(name, value);
        }
    };

    clickSubmit = e => {
        const { firstName, lastName, city, country, street, email, password } = this.state;
        const { site } = this.props;
        e.preventDefault();
        this.props.updateUserProfile(site, this.props.user.uid, firstName, lastName, city, country, street, email, password).then(data => {
            if (data) {
                this.props.history.push("/dashboard");
            } else {
                this.props.history.push("/");
            }
        }
        );
    };
    profileUpdate = (email, firstName, lastName, city, country, street, password) => (
        <form>
            <div className="form-group">
                <label className="text-muted">Email</label>
                <input
                    type="email"
                    onChange={this.handleChange("email")}
                    className="form-control"
                    value={email}
                    autoComplete="new-password"
                />
            </div>
            <div className="form-group">
                <label className="text-muted">First Name</label>
                <input
                    type="text"
                    onChange={this.handleChange("firstName")}
                    className="form-control"
                    value={firstName}
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Last Name</label>
                <input
                    type="text"
                    onChange={this.handleChange("lastName")}
                    className="form-control"
                    value={lastName}
                />
            </div>

            <div className="form-group">
                <label className="text-muted">City</label>
                <input
                    type="text"
                    onChange={this.handleChange("city")}
                    className="form-control"
                    value={city}
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Country</label>
                <input
                    type="text"
                    onChange={this.handleChange("country")}
                    className="form-control"
                    value={country}
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Street</label>
                <input
                    type="text"
                    onChange={this.handleChange("street")}
                    className="form-control"
                    value={street}
                    autoComplete="new-password"
                />
            </div>
            <div className="form-group">
                <label className="text-muted">New Password (Leave it blank if you don't want to change)</label>
                <input
                    type="password"
                    onChange={this.handleChange("password")}
                    className="form-control"
                    value={password}
                    autoComplete="new-password"
                />
            </div>

            <button onClick={this.clickSubmit} className="btn btn-primary">
                Submit
            </button>
        </form>
    );

    showError = () => (
        <div
            className="alert alert-danger"
            style={{ display: this.props.error.message ? "" : "none" }}
        >
            {this.props.error.message}
        </div>
    );

    render() {
        if (!isServer && !this.state.isDataFetched) {
            return null;
        }

        return (
            <Layout
                title="Profile"
                description="Update your profile"
                className="container-fluid"
            >
                <div className="row">
                    <div className="col-md-3">
                        <UserSideMenu />
                    </div>
                    <div className="col-md-9">
                        <h2 className="mb-4">Profile updateUserProfile</h2>
                        {this.showError()}
                        <div className="col-md-8">
                            {this.profileUpdate(this.state.email, this.state.firstName, this.state.lastName,
                                this.state.city, this.state.country, this.state.street, this.state.password)}
                        </div>
                    </div>
                </div>


            </Layout>
        );
    };
};

function mapStateToProps(state) {
    return {
        error: state.user.error,
        user: state.auth.userInfo,
        userDatail: state.user.userDetail
    };
}

const mapDispatchToProps = dispatch => {
    return {        updateUserProfile: (site, uid, firstName, lastName, city, country, street, email, password) =>
            dispatch(updateUserProfile(site, uid, firstName, lastName, city, country, street, email, password)),

        syncUser: async (site: string) => await dispatch(syncUser(site)),
    }
};

export default withRouter(
    connect<IStateProps, IDispatchProps, RouteComponentProps>(
        mapStateToProps, mapDispatchToProps
    )(PrivateRoute(UpdateProfile)));