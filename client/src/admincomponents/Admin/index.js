import React, { Component } from "react";
import { Route, Switch, Redirect, BrowserRouter } from "react-router-dom";

import { Grid } from "semantic-ui-react";
import Home from "../Home";
import Login from "../Login";


const get = require('../../helpers/fetch').get;

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
    const res = (await get('/get-sess-info/admin'));
    if (res.ok) {
      const userAdmin = (await res.json()).user;
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
      <div>
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
      </div>
    );
  }
}
