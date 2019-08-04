import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Route, Switch, Redirect, BrowserRouter } from "react-router-dom";
import "semantic-ui-css/semantic.min.css";
import Client from "./components/Client";
import Admin from "./admincomponents/Admin";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Client} />
        <Route exact path="/admin" component={Admin} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
