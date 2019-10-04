import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import Control from "./Control";
import CreateUser from "./CreateUser";
import Roles from "./Roles";

export default class Permissions extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <Switch style={{ minHeight: "80vh" }}>
          <Route
            exact
            path={`${this.props.match.url}/control`}
            component={Control}
          />
          <Route
            exact
            path={`${this.props.match.url}/create-user`}
            component={CreateUser}
          />
          <Route
            exact
            path={`${this.props.match.url}/roles`}
            component={Roles}
          />
        </Switch>
      </div>
    );
  }
}
