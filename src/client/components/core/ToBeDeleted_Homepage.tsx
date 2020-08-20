import React, { Component } from "react";
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { isServer } from "../utils";
import Footer from "./Footer";
import { Link, animateScroll as scroll, scroller } from "react-scroll";
import ScrollAnimation from 'react-animate-on-scroll';
import Rodal from 'rodal';

import { fetchMD_Homepage } from "../actions/markdown"
import 'rodal/lib/rodal.css';
import "../../styles/ToBeDeleted_Homepage.css"
import "../../styles/modal.css"
import { AppState } from "../reducers";
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import ToBeDeleted_Test from "./ToBeDeleted_Test";

import {
    MarkdownError,
    MarkdownData,
} from "../types/markdown";

interface IAttributeProps {
    site: string;
}

interface IStateProps {
    error: MarkdownError;
    content: MarkdownData;
}

interface IDispatchProps {
    fetchMD_Homepage: (site: string) => any;}

type PropsTypes = IAttributeProps & IStateProps & IDispatchProps & RouteComponentProps;

interface IReactStates {
    currentScroll: number
    isDataFetched: boolean;
    visible: boolean;
}

type StateTypes = IReactStates;

class ToBeDeleted_Homepage extends Component<PropsTypes, StateTypes> {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            currentScroll: 0,
            isDataFetched: false,
            visible: false
        };
        this.getMarkdown = this.getMarkdown.bind(this);
    }    static fetching(props) {        return [props.dispatch(fetchMD_Homepage(props.site))];
    }

    componentDidMount() {
        this._isMounted = true;
        document.addEventListener('scroll', this.trackScrolling.bind(this));
        this.getMarkdown();
    }

    componentWillUnmount() {
        document.removeEventListener('scroll', this.trackScrolling);
        this._isMounted = false;
    }
    async getMarkdown() {
        await this.props.fetchMD_Homepage(this.props.site).then(data => {
            if (this._isMounted) {
                this.setState({ isDataFetched: true });
            }
        });
    };

    trackScrolling = () => {
        if (this._isMounted) {
            this.setState({ currentScroll: window.scrollY });
        }
    };

    show() {
        if (this._isMounted) {
            this.setState({ visible: true });
        }
    }

    hide() {
        if (this._isMounted) {
            this.setState({ visible: false });
        }
    }

    test = () => {
        return null;
    }

    render() {
        if (!isServer && !this.state.isDataFetched) {
            return null;
        }

        return (
            <div>

                <Rodal visible={this.state.visible} onClose={this.hide.bind(this)}
                    customStyles={{ width: "80%", height: "80%" }}
                    animation={"rotate"}
                >
                    <div className="modal-title">Website Console</div>
                    <div className="modal-container" style={{ overflow: "auto", backgroundColor: "#282c34" }}>
                        {this.state.visible && (
                            <ToBeDeleted_Test />
                        )}

                    </div>
                </Rodal>
                <div id="home">
                    <div className="landing">
                        <div className="home-wrap">
                            {this.props.content && (
                                <div className="home-inner" style={{
                                    backgroundImage: "url(" + this.props.content.backgroundImage + ")"
                                }}></div>
                            )}

                        </div>
                    </div>

                    <div className="caption text-center">
                        {this.props.content && (
                            <ScrollAnimation animateIn="bounceInUp" duration={1.0} animateOnce={true}>
                                <h1>{this.props.content.title}</h1>
                            </ScrollAnimation>
                        )}

                        {this.props.content && (
                            <ScrollAnimation animateIn="bounceInUp" duration={1.2} animateOnce={true}>
                                <h4>{this.props.content.subTitle}</h4>
                                <h3>All-In-One</h3>
                            </ScrollAnimation>
                        )}

                        <ScrollAnimation animateIn="bounceInUp" duration={1.2} animateOnce={true}>
                            <Link
                                to="features"
                                smooth={true}
                            >
                                <div className="btn btn-outline-light btn-lg" style={{ cursor: "pointer" }}>Get Started</div>
                            </Link>
                        </ScrollAnimation>

                    </div>
                    <Link
                        activeClass="active"
                        to="features"
                        spy={true}
                        smooth={true}
                        offset={7}
                        duration={500}
                    >

                        <ScrollAnimation animateIn="bounce" initiallyVisible={true} offset={0} style={{ opacity: (1 - this.state.currentScroll / 500) }}>
                            <div className="down-arrow">
                                <div className="arrow d-md-block">
                                    <i className="fas fa-angle-down" aria-hidden="true"></i>
                                </div>
                            </div>
                        </ScrollAnimation>

                    </Link>
                </div>

                <div id="features" className="offset">

                    <ScrollAnimation animateIn="fadeInUp" duration={1.0}>
                        <div className="narrow text-center">
                            <div className="col-12">
                                <h1>SSR-boilerplate React App</h1>
                                {this.props.content && (
                                    <p
                                        className="lead"
                                        dangerouslySetInnerHTML={{ __html: this.props.content.__content }}
                                    />
                                )}
                                <Link
                                    to="contact"
                                    smooth={true}
                                >
                                    <div className="btn btn-secondary btn-sm" style={{ cursor: "pointer" }}>Contact The Admin</div>
                                </Link>
                                <Link
                                    to="tests"
                                    smooth={true}
                                >
                                    <div className="btn btn-turquoise btn-sm" style={{ cursor: "pointer" }}>Test The App</div>
                                </Link>
                            </div>
                        </div>
                    </ScrollAnimation>

                    <div className="jumbotron">
                        <div className="narrow">

                            <ScrollAnimation animateIn="fadeInUp" duration={1.0}>
                                <h3 className="heading">Features</h3>
                                <div className="heading-underline"></div>
                            </ScrollAnimation>

                            <div className="row">

                                <div className="col-sm-6 col-md-4">
                                    <ScrollAnimation animateIn="fadeInLeft" duration={1.0}>
                                        <div className="feature">

                                            <span className="fa-layers fa-4x">
                                                <i className="fa fa-circle"></i>
                                                <i className="fas fa-mobile-alt fa-inverse" data-fa-transform="shrink-6 right-.25"></i>
                                            </span>
                                            <h3>Server Side Rendering</h3>
                                            <p>SSR makes the website SEO friendly for search engines such as Google, Bing, etc.</p>
                                        </div>
                                    </ScrollAnimation>
                                </div>

                                <div className="col-sm-6 col-md-4">
                                    <ScrollAnimation animateIn="fadeInUp" duration={1.0}>
                                        <div className="feature">
                                            <span className="fa-layers fa-4x">
                                                <i className="fa fa-circle"></i>
                                                <i className="fas fa-desktop fa-inverse" data-fa-transform="shrink-8 left-1."></i>
                                            </span>
                                            <h3>Code Splitting</h3>
                                            <p>Code-splitting helps the user to minimize the traffic by loading only necessary files.</p>
                                        </div>
                                    </ScrollAnimation>
                                </div>

                                <div className="col-sm-6 col-md-4">
                                    <ScrollAnimation animateIn="fadeInRight" duration={1.0}>
                                        <div className="feature">
                                            <span className="fa-layers fa-4x">
                                                <i className="fa fa-circle"></i>
                                                <i className="fas fa-play fa-inverse" data-fa-transform="shrink-.5 right-1.3"></i>
                                            </span>
                                            <h3>Redux</h3>
                                            <p>The powerful state management system across the whole website.</p>
                                        </div>
                                    </ScrollAnimation>
                                </div>

                                <div className="col-sm-6 col-md-4">
                                    <ScrollAnimation animateIn="fadeInLeft" duration={1.0}>
                                        <div className="feature">
                                            <span className="fa-layers fa-4x">
                                                <i className="fa fa-circle"></i>
                                                <i className="fas fa-angle-double-down fa-inverse" data-fa-transform="shrink-5.5 down-.3"></i>
                                            </span>
                                            <h3>Hot Reload</h3>
                                            <p>Any changes made during the development time will apply immediately as soon as saved.</p>
                                        </div>
                                    </ScrollAnimation>
                                </div>

                                <div className="col-sm-6 col-md-4">
                                    <ScrollAnimation animateIn="fadeInUp" duration={1.0}>
                                        <div className="feature">
                                            <span className="fa-layers fa-4x">
                                                <i className="fa fa-circle"></i>
                                                <i className="fas fa-sliders-h fa-inverse" data-fa-transform="shrink-8.5 right-.2"></i>
                                            </span>
                                            <h3>Multi Domain & Markdown</h3>
                                            <p>It supports multiple domains that have similar patterns along with the markdowns.</p>
                                        </div>
                                    </ScrollAnimation>
                                </div>

                                <div className="col-sm-6 col-md-4">
                                    <ScrollAnimation animateIn="fadeInRight" duration={1.0}>
                                        <div className="feature">
                                            <span className="fa-layers fa-4x">
                                                <i className="fa fa-circle"></i>
                                                <i className="fab fa-wpforms fa-inverse" data-fa-transform="grow-6 right-.5"></i>
                                            </span>
                                            <h3>REST</h3>
                                            <p>Strong backend support via REST.</p>
                                        </div>
                                    </ScrollAnimation>
                                </div>

                            </div>

                        </div>
                    </div>
                </div>
                <div className="tests">
                    <div className="row dark">

                        <div className="col-12">
                            <ScrollAnimation animateIn="fadeInUp" duration={1.0}>
                                <h3 className="heading">Test</h3>
                                <div className="heading-underline"></div>
                            </ScrollAnimation>
                        </div>

                        <div className="col-md-12">
                            <ScrollAnimation animateIn="fadeInUp" duration={1.0}>
                                <div className="feature">
                                    <span className="fa-layers fa-3x">
                                        <i className="fas fa-wrench"></i>
                                    </span>
                                </div>
                                <p className="lead">Click the button below to check if the boilerplate works well as intended.</p>
                                <div
                                    className="btn btn-outline-light btn-lg"
                                    style={{ cursor: "pointer" }}
                                    onClick={this.show.bind(this)}
                                >
                                    Test It Out</div>
                            </ScrollAnimation>
                        </div>

                    </div>

                    <div className="fixed-wrap">
                        <div id="fixed">
                        </div>
                    </div>

                </div>
                <Footer />
            </div>
        );
    };
};

function mapStateToProps(state: AppState): IStateProps {
    return {
        content: state.markdown.data,
        error: state.markdown.error
    };
}

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, AnyAction>): IDispatchProps => {
    return {
        fetchMD_Homepage: (site: string) => dispatch(fetchMD_Homepage(site)),    }
};

export default withRouter(
    connect<IStateProps, IDispatchProps, RouteComponentProps>(
        mapStateToProps, mapDispatchToProps
    )(ToBeDeleted_Homepage));// };