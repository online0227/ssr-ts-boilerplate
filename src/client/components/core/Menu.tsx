import React, { Fragment, Component } from "react";
import { withRouter, RouteComponentProps, NavLink } from "react-router-dom";
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { isServer } from "../utils";
import { Link, animateScroll as scroll, scroller } from "react-scroll";
import { fetchSignOut, refreshToken } from '../actions';import { AuthenticatedWrapper, AdminWrapper } from "../auth";import { AnyAction } from 'redux';
import { AppState } from "../reducers";
import { AuthInfo } from "../types/authentication";
import { UserDetail } from "../types/apiUser";
import { renderRoutes } from 'react-router-config';

interface IAttributeProps {
    site: string;
    route: any;
}

interface IStateProps {
    user: AuthInfo;
    userDatail: UserDetail;
}

interface IDispatchProps {
    fetchSignOut: (site: string) => any;
    refreshToken: (site: string) => any;
}

type PropsTypes = IAttributeProps & IStateProps & IDispatchProps & RouteComponentProps;

interface IReactStates {
    currentScroll: number;
    isDataFetched: boolean;
}

type StateTypes = IReactStates;

class Menu extends Component<PropsTypes, StateTypes> {
    private menu: HTMLElement;
    private inputElement: HTMLElement;
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            currentScroll: 0,
            isDataFetched: false
        };
    }    static fetching(props) {        return [props.dispatch(refreshToken(props.site))];
    }
    componentDidMount() {        this._isMounted = true;
        document.addEventListener('scroll', this.trackScrolling.bind(this));        this.refreshToken();
    }

    componentWillUnmount() {
        this._isMounted = false;
        document.removeEventListener('scroll', this.trackScrolling);
    }

    async refreshToken() {
        await this.props.refreshToken(this.props.site).then(data => {
            if (this._isMounted) {
                this.setState({ isDataFetched: true });
            }
        });
    };

    trackScrolling = () => {
        this.setState({ currentScroll: window.scrollY });
    };

    menuLogin = () => {        if (!this.props.user.logged) {
            return (
                <Fragment>
                    <li className="nav-item">
                        {(this.props.site === "www") ? (
                            <NavLink
                                className="nav-link"
                                activeStyle={{
                                    color: "#1ebba3"
                                }}
                                to="/signin"
                                onClick={(e) => { if (this.menu.classList.contains("show")) { this.inputElement.click() } }}
                            >
                                Signin
                            </NavLink>)
                            :
                            (                                <div></div>
                            )}

                    </li>

                    <li className="nav-item">
                        {(this.props.site === "www") ? (
                            <NavLink
                                className="nav-link"
                                activeStyle={{
                                    color: "#1ebba3"
                                }}
                                to="/signup"
                                onClick={(e) => { if (this.menu.classList.contains("show")) { this.inputElement.click() } }}
                            >
                                Signup
                            </NavLink>
                        ) : (                                <div></div>
                            )}
                    </li>
                </Fragment>
            );
        }        else {            return (
                <Fragment>
                    <AuthenticatedWrapper>
                        <li className="nav-item">
                            <NavLink
                                className="nav-link"
                                activeStyle={{
                                    color: "#1ebba3"
                                }}
                                to="/dashboard"
                                onClick={(e) => { if (this.menu.classList.contains("show")) { this.inputElement.click() } }}
                            >
                                Dashboard
                            </NavLink>
                        </li>
                    </AuthenticatedWrapper>
                    <AuthenticatedWrapper>
                        <AdminWrapper>
                            <li className="nav-item">
                                <NavLink
                                    className="nav-link"
                                    activeStyle={{
                                        color: "#1ebba3"
                                    }}
                                    to="/admin"
                                    onClick={(e) => { if (this.menu.classList.contains("show")) { this.inputElement.click() } }}
                                >
                                    Admin
                            </NavLink>
                            </li>
                        </AdminWrapper>
                    </AuthenticatedWrapper>

                    <li className="nav-item">
                        <span
                            className="nav-link"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                                this.props.fetchSignOut(this.props.site).then(data => {
                                    this.props.history.push("/");
                                });
                            }}
                        >
                            Signout
                        </span>
                    </li>
                </Fragment>
            );
        }
    };

    render() {
        if (!isServer && !this.state.isDataFetched) {
            return null;
        }

        return (
            <div>
                <nav className={`navbar navbar-expand-lg fixed-top ${this.state.currentScroll > 250 ? 'solid' : ''}`}>
                    <div className="container-fluid">
                        <a className="navbar-brand" href="/"><img src="/public/img/logo.png" alt="" /></a>
                        <button ref={(el: any) => { this.inputElement = el }}
                            className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive">
                            <span className="custom-toggler-icon"><i className="fas fa-bars"></i></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarResponsive" ref={(el: any) => { this.menu = el }}
                        >
                            <ul className="navbar-nav ml-auto">
                                <li className="nav-item">
                                    <NavLink
                                        className="nav-link"
                                        activeStyle={{
                                            color: "#1ebba3"
                                        }}
                                        exact to="/"
                                        onClick={(e) => { if (this.menu.classList.contains("show")) { this.inputElement.click() } }}
                                    >
                                        Home
                                        </NavLink>
                                </li>
                                {this.menuLogin()}
                            </ul>
                        </div>
                    </div>
                    {this.state.currentScroll > 500 ?
                        (
                            <Link
                                className="top-scroll"
                                style={{ display: "inline" }}
                                to="root"
                                smooth={true}
                                duration={500}
                            >
                                <i className="fas fa-angle-up"></i>
                            </Link>
                        )
                        :
                        (
                            <Link
                                className="top-scroll"
                                style={{ display: "none" }}
                                to="root"
                                smooth={true}
                                duration={500}
                            >
                                <i className="fas fa-angle-up"></i>
                            </Link>
                        )
                    }
                </nav>
                {renderRoutes(this.props.route.routes, { site: this.props.site })}
            </div>
        );
    }

};


function mapStateToProps(state: AppState): IStateProps {
    return {
        user: state.auth.userInfo,
        userDatail: state.user.userDetail
    };
}

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, AnyAction>): IDispatchProps => {
    return {
        fetchSignOut: async (site: string) => await dispatch(fetchSignOut(site)),
        refreshToken: async (site: string) => await dispatch(refreshToken(site))
    }
};

export default withRouter(
    connect<IStateProps, IDispatchProps, RouteComponentProps>(
        mapStateToProps, mapDispatchToProps
    )(Menu));// };