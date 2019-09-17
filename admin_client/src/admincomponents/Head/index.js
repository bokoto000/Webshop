import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import {Button, Divider} from "semantic-ui-react";

const get = require("../../helpers/fetch").get;


class Head extends Component {
  handleSignOut = async () => {
    await get("/admin/logout");
    this.props.history.push(`/`);
    window.location.reload();
  };

  render() {
    return (
      <div>
        <Button
          onClick={this.handleSignOut}
          style={{ marginLeft: "0.5em" }}
          className="dekstopheader-button"
          color="blue"
        >
          Изход
        </Button>
        <Divider></Divider>
      </div>
    );
  }
}

export default withRouter(Head);
