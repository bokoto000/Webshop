import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button, Segment, Container } from "semantic-ui-react";

export default class SuccessOrderScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <Segment>
          <Container>Успешно направена поръчка.</Container>
          <Button as={Link} basic to="/">
            Продължи пазаруването
          </Button>
        </Segment>
      </div>
    );
  }
}
