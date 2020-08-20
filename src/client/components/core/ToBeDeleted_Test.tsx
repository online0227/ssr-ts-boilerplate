import React, { Component } from "react";
import { withRouter, Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { isServer } from "../utils";
import FadeIn from "react-fade-in";
import Lottie from "react-lottie";
import * as legoData from "./legoloading.json";
import * as doneData from "./doneloading.json";
import { AppState } from "../reducers";
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import "../../styles/fetching.css";
import "../../styles/ToBeDeleted_Test.css"

const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: legoData['default'],
    rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
    }
};

const defaultOptions2 = {
    loop: false,
    autoplay: true,
    animationData: doneData['default'],
    rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
    }
};

interface IAttributeProps {

}

interface IStateProps {

}

interface IDispatchProps {

}

type PropsTypes = IAttributeProps & IStateProps & IDispatchProps & RouteComponentProps;

interface IReactStates {
    isDataFetched: boolean;
    loading: boolean;
    done: boolean;
}

type StateTypes = IReactStates;

class ToBeDeleted_Test extends Component<PropsTypes, StateTypes> {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            isDataFetched: false,
            loading: false,
            done: false
        };
    }

    componentDidMount() {
        this._isMounted = true;

        setTimeout(() => {
            fetch("https://jsonplaceholder.typicode.com/posts")
                .then(response => response.json())
                .then(json => {
                    this.setState({ loading: true });
                    setTimeout(() => {
                        this.setState({ done: true });
                    }, 1000);
                });
        }, 1200);

        if (this._isMounted) {
            this.setState({ isDataFetched: true });
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        if (!isServer && !this.state.isDataFetched) {
            return null;
        }

        return (
            <div>
                {!this.state.done ? (
                    <div className="fectching-header">
                        <FadeIn>
                            {!this.state.loading ? (
                                <div className="d-flex justify-content-center align-items-center">
                                    <h1>Fetching Data...</h1>
                                    <Lottie options={defaultOptions} height={120} width={120} />
                                </div>
                            ) : (
                                    <div className="d-flex justify-content-center align-items-center">
                                        <h1>Fetched!</h1>
                                        <Lottie options={defaultOptions2} height={120} width={120} />
                                    </div>
                                )}
                        </FadeIn>
                    </div>
                ) : (                        <div className="test-container">
                            <div className="test-content">
                                <h2>Welcome!</h2>
                                <p>We will check all the features that the boilerplate provides.
                                    The tests should work well in Chrome web browser.</p>
                                <h4>1. Server Side Rendering</h4>
                                <p>Press right mouse button and click "View page source".
                                    If you can see all the source code except the code corresponding to
                                    this modal box (because this modal box is imported via iframe),
                                    then the server side rendering is working well.
                                </p>
                                <h4>2. Code-splitting</h4>
                                <p>Turn on the network tab in Chrome web browser's console, check what are loaded.
                                    Then press the button below, you will be redirect to the another page.
                                    Check if only 2 files for rendering that page (core-NotFound.js and .css) are loaded additionally in
                                    the network tab. If so, it works correctly. To return back to this page, just press back button in the browser.
                                </p>
                                <p>
                                    <Link to="/itdoesnotexists">
                                        <button type="button">
                                            Go to NotFound page
                                    </button>
                                    </Link>
                                </p>
                                <h4>3. Redux</h4>
                                <p>
                                    To make Redux work with Server Side Rendering, Redux states that needs to be visible to the client must be fetched via both client and server side. If you check 
                                    the bottom of "View page source" in Chrome, there should be "window.INITIAL_STATE = &#123; ... &#125;", which are Redux 
                                    states fetched . If you can see anything inside of &#123; ... &#125;, then it works correctly.
                                </p>
                                <h4>4. Hot Reload</h4>
                                <p>
                                    In order to test this, you need to change any of JS, CSS file then save in development mode (Not Production).
                                </p>
                                <h4>5. Multi Domain & Markdown</h4>
                                <p>
                                    In order to test this, visit {window.location.protocol}//multi1.{window.location.host}. If you can see different text and
                                    image in the top of that page, multi-domain and markdown are working well.
                                </p>
                                <h4>6. REST</h4>
                                <p>
                                    You already saw that REST is working because those markdowns are fetched using REST.
                                </p>
                            </div>
                        </div>
                    )}
            </div>
        );
    };
};

function mapStateToProps(state: AppState): IStateProps {
    return {

    };
}

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, AnyAction>): IDispatchProps => {
    return {

    }
};

export default withRouter(
    connect<IStateProps, IDispatchProps, RouteComponentProps>(
        mapStateToProps, mapDispatchToProps
    )(ToBeDeleted_Test));