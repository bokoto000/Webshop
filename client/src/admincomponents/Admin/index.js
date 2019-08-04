import React, { Component } from "react";
import { Route, Switch, Redirect, BrowserRouter } from "react-router-dom";

import { Grid } from "semantic-ui-react";
import Home from "../Home";
import Login from "../Login";

export default class Admin extends Component {
  constructor() {
    super();
    this.state = {
      isAuthAdmin: false,
      userAdmin: null,
      authenticatingAdmin: true
    };
  }

  async componentDidMount() {
    const res = { ok: false }; //(await get('/get-sess-info/user'));
    if (res.ok) {
      const userAdmin = res; //(await res.json()).user;
      this.setState({ isAuthAdmin: true, userAdmin: userAdmin, authenticatingAdmin: false });
    } else {
      this.setState({ isAuthAdmin: false, authenticatingAdmin: false });
    }
  }

  render() {
    const authenticatingAdmin = this.state.authenticatingAdmin;
    const isAuthAdmin = this.state.isAuthAdmin;
    console.log(isAuthAdmin);
    console.log(authenticatingAdmin);
    return authenticatingAdmin ? null : (
      <BrowserRouter>
        <Switch>
          <Route
            exact
            path="/admin/home"
            render={() => (isAuthAdmin ? <Home /> : <Redirect to="/admin" />)}
          />
          <Route
            exact
            path="/admin/"
            render={() => (isAuthAdmin ? <Redirect to="/admin/home" /> : <Login />)}
          />
        </Switch>
      </BrowserRouter>
    );
  }
}
