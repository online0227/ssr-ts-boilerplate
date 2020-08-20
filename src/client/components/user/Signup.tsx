import React, { Component } from 'react';
import { withRouter, Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { signError, signUp } from '../actions';
import Layout from "../core/Layout";
import { AuthError, AuthInfo } from '../types/authentication';
import { AppState } from '../reducers';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

interface IAttributeProps {
    site: string;
}

interface IStateProps {
    error: AuthError;
}

interface IDispatchProps {
    signError: (error: AuthError) => any;
    signUp: (site: string, email: string, password: string, failed: Function) => any;
}

type PropsTypes = IAttributeProps & IStateProps & IDispatchProps & RouteComponentProps;

interface IReactStates {
    email: string;
    password: string;
    isSubmitting: boolean;
    success: boolean;
}

type StateTypes = IReactStates;

class Signup extends Component<PropsTypes, StateTypes> {
    _isMounted = false;
    constructor(props) {        super(props);
        this.state = {
            email: "",
            password: "",
            isSubmitting: false,
            success: false
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
            this.setState({ [stateName]: event.target.value } as Pick<IReactStates, keyof IReactStates>);
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
                this.setState({ isSubmitting: false });            }
        };

        const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
        return sleep(300).then(() => {
            const promise = this.props.signUp(site, email, password, failed);
            promise.then(response => {
                if (response) {

                    this.props.signError({ status: 0, message: '' });
                    $('#submit').html('Submit');
                    if (this._isMounted) {
                        this.setState({
                            email: "",
                            password: "",
                            isSubmitting: false,
                            success: true
                        });
                    }
                } else {
                    if (this._isMounted) {
                        this.setState({
                            success: false
                        });
                    }
                }
            })
        });


    }

    signUpForm = () => (
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

    showSuccess = () => (
        <div
            className="alert alert-info"
            style={{ display: this.state.success ? "" : "none" }}
        >
            New account is created. Please <Link to="/signin">Signin</Link>
        </div>
    );

    render() {
        return (
            <Layout
                title="Signup"
                description="Signup to Node React E-commerce App"
                className="container col-md-8 offset-md-2"
            >
                {this.showSuccess()}
                {this.showError()}
                {this.signUpForm()}
            </Layout>
        );
    };
};

function mapStateToProps(state: AppState): IStateProps {
    return {
        error: state.auth.error,
    };
}

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, AnyAction>): IDispatchProps => {
    return {
        signError: (error: AuthError) => dispatch(signError(error)),
        signUp: (site: string, email: string, password: string, failed: Function) => dispatch(signUp(site, email, password, failed))
    }
};

export default withRouter(
    connect<IStateProps, IDispatchProps, RouteComponentProps>(
        mapStateToProps, mapDispatchToProps
    )(Signup));