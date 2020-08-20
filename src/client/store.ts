import { createStore, applyMiddleware, compose } from "redux"
import reducers from "./components/reducers"
import axios from 'axios';
import thunk from "redux-thunk"

export default (initialState, site) => {  const axiosInstance = axios.create({
    baseURL: '/api',    headers: { site, what : "client" }
  });

  const composeEnhancers =
    typeof window === "object" && window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] as typeof compose
      ? window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__']({}) as typeof compose
      : compose

  const enhancer = composeEnhancers(applyMiddleware(thunk.withExtraArgument(axiosInstance)))
  const store = createStore(reducers, initialState, enhancer)

  if (module.hot) {
    module.hot.accept("./components/reducers", () =>
      store.replaceReducer(require("./components/reducers"))
    )
  }

  return store
}
