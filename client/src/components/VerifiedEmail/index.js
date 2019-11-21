import React, { Component } from "react";
import {withRouter} from "react-router-dom";
import { Loader, Header } from "semantic-ui-react";
import queryString from "query-string";

const post = require("../../helpers/fetch").post;

class VerifiedEmail extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = async () => {
    this.setState({ verified: null });
    const values = queryString.parse(this.props.location.search);
    const token = this.props.match.params.token;
    const res = await post(`/verifyemail/verify-email/${token}`);
    if (res.ok) {
      this.setState({ verified: true });
    } else {
      this.setState({ verified: false });
    }
  };

  render() {
    return (
      <div>
          <Header>
              Потвърждаване на имейл:
          </Header>
        {this.state.verified === null ? <Loader active></Loader> : null}
        {this.state.verified === true ? (
          <Header>Успешно потвърден имейл</Header>
        ) : null}
        {this.state.verified === false ? (
          <Header>Неуспешно потвърждаване на имейл</Header>
        ) : null}
      </div>
    );
  }
}

export default withRouter(VerifiedEmail);
