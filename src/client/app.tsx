import React from "react"
import ReactDOM from "react-dom"
import AppRoot from "./components/AppRoot"
import { AppContainer } from "react-hot-loader"
import { Provider } from "react-redux"
import configureStore from "./store";
import Loadable from 'react-loadable'
const config = require("../config")

let site = "www";
if (typeof window != "undefined" && window.location.hostname != config.domain && window.location.hostname !== "localhost") {
  site = window.location.hostname.split(".")[0];
}

const store = configureStore(window['INITIAL_STATE'], site)
function render(Component) {
  const renderMethod = module.hot ? ReactDOM.render : ReactDOM.hydrate;  Loadable.preloadReady().then(() => {
    renderMethod(
      <Provider store={store}>
        <AppContainer>
          <Component site={site} />
        </AppContainer>
      </Provider>,
      document.getElementById("root")
    );
  });
}
render(AppRoot)

if (module.hot) {  module.hot.accept("./components/AppRoot.tsx", () => {
    const NewAppRoot = require("./components/AppRoot.tsx").default
    render(NewAppRoot)
  })
}
