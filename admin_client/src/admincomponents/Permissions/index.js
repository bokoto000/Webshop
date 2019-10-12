import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import Control from "./Control";
import Roles from "./Roles";
import Users from "./Users";

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
            path={`${this.props.match.url}/roles`}
            component={Roles}
          />
                    <Route
            exact
            path={`${this.props.match.url}/users`}
            component={Users}
          />
        </Switch>
      </div>
    );
  }
}
