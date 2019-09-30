import React, { Component } from "react";
import Register from "../../Register";
export default class CreateUser extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <Register></Register>
      </div>
    );
  }
}
