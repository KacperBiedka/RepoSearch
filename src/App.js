import React from "react";
import { Route, BrowserRouter } from "react-router-dom";
import routes from "./routes";
import "./App.scss";

function App() {
  const routeComponents = routes.map(({ path, component }, key) => (
    <Route exact path={path} component={component} key={key} />
  ));
  return <BrowserRouter>{routeComponents}</BrowserRouter>;
}

export default App;
