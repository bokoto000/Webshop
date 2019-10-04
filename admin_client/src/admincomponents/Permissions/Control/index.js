import React, { Component } from "react";
import CreatePermission from "./CreatePermission";
import AddPermission from "./AddPermission";

export default class Control extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <div>
      <CreatePermission>

      </CreatePermission>
      <AddPermission>

      </AddPermission>
    </div>;
  }
}
