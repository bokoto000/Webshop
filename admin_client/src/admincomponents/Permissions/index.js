import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import Control from "./Control";
import CreateUser from "./CreateUser";

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
        </Switch>
      </div>
    );
  }
}
