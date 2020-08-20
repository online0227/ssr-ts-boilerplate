import React from "react"
import { Router, RouteComponentProps } from "react-router-dom"
import Routes from "./Routes"
import { createMemoryHistory, createBrowserHistory } from 'history';
import { isServer } from "./utils";
import { renderRoutes } from 'react-router-config';

export const history = isServer
  ? createMemoryHistory()
  : createBrowserHistory();

interface IAttributeProps {
  site: string;
}

interface IStateProps {
}

interface IDispatchProps {
}

type PropsTypes = IAttributeProps & IStateProps & IDispatchProps & RouteComponentProps;

interface IReactStates {
}

type StateTypes = IReactStates;

export default class extends React.Component<PropsTypes, StateTypes> {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { site } = this.props;
    return (
      <Router key={Math.random()} history={history}>
        <div>{renderRoutes(Routes, { site })}</div>
      </Router>
    )
  }
}