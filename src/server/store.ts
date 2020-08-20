import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import axios from 'axios';
import reducers from '../client/components/reducers';
const config = require("../config")

export default req => {
  let site = "www";

  if (req.hostname !== config.domain) {
    site = req.hostname.split(".")[0];
  }  const axiosInstance = axios.create({
    baseURL: config.server_address,
    headers: { cookie: req.get('cookie') || '', site, what : "server" }
  });

  const store = createStore(
    reducers,
    {},
    applyMiddleware(thunk.withExtraArgument(axiosInstance))
  );

  return store;
};
