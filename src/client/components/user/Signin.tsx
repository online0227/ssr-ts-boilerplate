import React, { Component } from 'react';
import { withRouter, RouteComponentProps } from "react-router-dom";
import { connect } from 'react-redux';
import { Login } from '../actions';
import { signError } from '../actions';
import Layout from "../core/Layout";
import {
    AuthError,
    AuthInfo,
} from "../types/authentication";
import { AppState } from '../reducers';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

interface IAttributeProps {
    site: string;
}

interface IStateProps {
    error: AuthError;
    user: AuthInfo;
}

interface IDispatchProps {
    signError: (error: AuthError) => any;
    Login: (site: string, email: string, password: string, failed: Function) => any;
}

type PropsTypes = IAttributeProps & IStateProps & IDispatchProps & RouteComponentProps;

interface IReactStates {
    name: string;
    email: string;
    password: string;
    isSubmitting: boolean;
}

type StateTypes = IReactStates;

class Signin extends Component<PropsTypes, StateTypes> {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            email: "",
            password: "",
            isSubmitting: false
        };
    }

    componentDidMount() {
        this._isMounted = true;
        this.props.signError({ status: 0, message: '' });    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    handleChange = stateName => event => {
        if (this._isMounted) {
            this.setState({ [stateName]: event.target.value } as Pick<IReactStates, keyof IReactStates>)
        }
    };

    clickSubmit = e => {
        const { email, password } = this.state;
        const { site } = this.props;
        e.preventDefault();

        const { isSubmitting } = this.state;

        if (isSubmitting) return;

        if (!isSubmitting) {
            const imagePath = require(`../../../public/img/spinner.gif`)
            $('#submit').html(`<img src="${imagePath}"/>`);            if (this._isMounted) {
                this.setState({ isSubmitting: true });
            }
        }

        const failed = () => {
            $('#submit').html('Submit');
            if (this._isMounted) {
                this.setState({ isSubmitting: false });
            }
        };

        const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
        return sleep(300).then(() => {
            const promise = this.props.Login(site, email, password, failed);

            promise.then(data => {
                if (data == true && this.state.isSubmitting == true) {
                    this.props.history.push("/");
                }
            })
        });
    };

    signInForm = () => (
        <form>
            <div className="form-group">
                <label className="text-muted">Email</label>
                <input
                    onChange={this.handleChange("email")}
                    type="email"
                    className="form-control"
                    value={this.state.email}
                />
            </div>

            <div className="form-group">
                <label className="text-muted">Password</label>
                <input
                    onChange={this.handleChange("password")}
                    type="password"
                    className="form-control"
                    value={this.state.password}
                />
            </div>
            <button onClick={this.clickSubmit}
                id="submit"
                type="submit"
                value="Submit"
                name="submit"
                className="btn btn-primary">
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
        return (
            <Layout
                title="Signin"
                description="Signin to Node React E-commerce App"
                className="container col-md-8 offset-md-2"
            >
                {this.showError()}
                <hr />
                {this.signInForm()}
            </Layout>
        );
    };
};

function mapStateToProps(state: AppState): IStateProps {
    return {
        error: state.auth.error,
        user: state.auth.userInfo
    };
}

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, AnyAction>): IDispatchProps => {
    return {
        signError: (error: AuthError) => dispatch(signError(error)),
        Login: (site: string, email: string, password: string, failed: Function) => dispatch(Login(site, email, password, failed))
    }
};

export default withRouter(
    connect<IStateProps, IDispatchProps, RouteComponentProps>(
        mapStateToProps, mapDispatchToProps
    )(Signin));// };