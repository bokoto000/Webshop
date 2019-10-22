import React, { Component } from "react";
import {Header} from "semantic-ui-react";
import CreatePermission from "./CreatePermission";
import AddPermission from "./AddPermission";

export default class Control extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <div>
      <Header textAlign="center">
        Контрол на права
      </Header>
      <CreatePermission>

      </CreatePermission>
      <AddPermission>

      </AddPermission>
    </div>;
  }
}
