import React from "react"
import { renderToString } from "react-dom/server"
import { StaticRouter } from "react-router"
import serialize from 'serialize-javascript';
import Routes from "../client/components/Routes"
import configureStore from "./store"
import { Provider } from "react-redux"
import { renderRoutes } from 'react-router-config';
import Loadable from 'react-loadable';
import { getBundles } from 'react-loadable/webpack'
import stats from '../react-loadable.json';
import { matchRoutes } from 'react-router-config';
const config = require("../config");

export default ({ clientStats }) => async (req: any, res: any) => {
  let site = "www";
  if (req.hostname !== config.domain) {
    site = req.hostname.split(".")[0]
  }  const context = { url: site };
  const store = configureStore(req);

  let modules = [];  const renderer = () => {
    const app = () =>
      renderToString(
        <Loadable.Capture report={moduleName => modules.push(moduleName)}>
          <Provider store={store}>
            <StaticRouter location={req.originalUrl} context={context}>
              <div>{renderRoutes(Routes)}</div>
            </StaticRouter>
          </Provider>
        </Loadable.Capture>
      );

    const appOutput = app();    let bundles = getBundles(stats, modules);

    let styles = bundles.filter(bundle => bundle.file.endsWith('.css'));
    let scripts = bundles.filter(bundle => bundle.file.endsWith('.js'));

    return `
    <!DOCTYPE html>
    <html lang="en">
        <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>SSR Boilerplate</title>
          <link rel="shortcut icon" href="/public/img/favicon.ico" />
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" />
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css" />
          <link rel='stylesheet' href='/global.css' />
          ${styles.map(style => {
      return `<link href="/${style.file}" rel="stylesheet"/>`
    }).join('\n')}
        </head>
        <body>
          <div id="root">${appOutput}</div>
          <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"></script>
          <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>
          <script src="https://use.fontawesome.com/releases/v5.9.0/js/all.js"></script>
          <script src="/main-bundle.js"></script>
          ${scripts.map(script => {
      return `<script src="/${script.file}"></script>`
    }).join('\n')}
          <script>
            window.INITIAL_STATE = ${serialize(store.getState())}
          </script>
        </body>
      </html>
    `

  }

  const actionsTemp = matchRoutes(Routes, req.path).map(({ route }) => {    return !route.component.preload ? route.component : route.component.preload().then(res => {
      return res.default
    })
  });

  const loadedActions = await Promise.all(actionsTemp);
  const actions = loadedActions

    .map((component: any) => {      return component.fetching ? component.fetching({ ...store, path: req.path, site: site }) : null
    })

    .map(async actions => {      return await Promise.all(
        (actions || []).map(p => p && new Promise(resolve => p.then(resolve).catch(resolve)))
      )
    });

  await Promise.all(actions);
  const content = renderer();

  res.send(content);
}
